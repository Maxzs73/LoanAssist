import { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertCircle, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { predictLoan } from '../api/loans';
import { useApplicationHistory } from '../store/historyStore';
import BankCard from '../components/shared/BankCard';
import EMICard from '../components/shared/EMICard';
import FinancialHealthGauge from '../components/shared/FinancialHealthGauge';
import { ReasonCard, SuggestionCard } from '../components/shared/ReasonCard';
import { formatConfidence } from '../utils/formatters';

const loanSchema = z.object({
  gender: z.enum(['Male', 'Female', 'Other']),
  married: z.preprocess((val) => {
    if (val === 'true' || val === true) return true;
    if (val === 'false' || val === false) return false;
    return undefined;
  }, z.boolean({ required_error: 'Please select your marital status', invalid_type_error: 'Please select your marital status' })),
  dependents: z.enum(['0', '1', '2', '3+']),
  education: z.enum(['Graduate', 'Not Graduate']),
  self_employed: z.preprocess((val) => {
    if (val === 'true' || val === true) return true;
    if (val === 'false' || val === false) return false;
    return undefined;
  }, z.boolean({ required_error: 'Please select your employment type', invalid_type_error: 'Please select your employment type' })),
  
  applicant_income: z.number().min(10000, "Minimum income is ₹10,000").max(1000000, "Maximum income is ₹10,00,000"),
  coapplicant_income: z.preprocess(
    (val) => (val === '' || val === null || val === undefined || Number.isNaN(Number(val))) ? undefined : Number(val),
    z.number().min(0, "Income cannot be negative").max(1000000, "Maximum income is ₹10,00,000").optional()
  ),
  savings: z.preprocess(
    (val) => (val === '' || val === null || val === undefined || Number.isNaN(Number(val))) ? undefined : Number(val),
    z.number({ required_error: 'Savings amount is required', invalid_type_error: 'Savings must be a valid number' }).min(0, "Savings cannot be negative")
  ),
  existing_loans: z.preprocess(
    (val) => (val === '' || val === null || val === undefined || Number.isNaN(Number(val))) ? undefined : Number(val),
    z.number({ required_error: 'Please select number of existing loans' }).min(0, "Cannot be negative").max(10, "Maximum 10 loans allowed")
  ),
  
  loan_amount: z.number().min(1000, "Minimum loan amount is ₹1,000"),
  loan_amount_term: z.number(),
  property_area: z.enum(['Urban', 'Semiurban', 'Rural']),
  credit_history: z.preprocess((val) => {
    if (val === '1' || val === 1) return 1.0;
    if (val === '0' || val === 0) return 0.0;
    if (val === 'not_sure') return null;
    return undefined;
  }, z.union([z.literal(1.0), z.literal(0.0), z.null()], {
    required_error: 'Please select your credit history',
    invalid_type_error: 'Please select your credit history'
  })),
});

const ResultSection = ({ result, onReset }) => {
  if (!result) return null;

  const isApproved = result.prediction === 'Approved';
  const confidencePercent = formatConfidence(result.confidence_score);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: 'spring', bounce: 0.2 }}
      className="mt-12"
    >
      {/* Main Result Card */}
      <div className={`p-8 md:p-10 rounded-3xl border shadow-xl relative overflow-hidden ${
        isApproved 
          ? 'bg-emerald-50 border-emerald-200 shadow-emerald-900/5' 
          : 'bg-red-50 border-red-200 shadow-red-900/5'
      }`}>
        {/* Background blob */}
        <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 -mr-20 -mt-20 pointer-events-none ${
          isApproved ? 'bg-emerald-500' : 'bg-red-500'
        }`} />

        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
            className={`w-24 h-24 rounded-full flex items-center justify-center shrink-0 shadow-lg ${
              isApproved ? 'bg-emerald-500 text-white shadow-emerald-500/30' : 'bg-red-500 text-white shadow-red-500/30'
            }`}
          >
            {isApproved ? <CheckCircle2 size={48} /> : <XCircle size={48} />}
          </motion.div>

          <div className="flex-1 text-center md:text-left">
            <h2 className={`text-3xl md:text-4xl font-extrabold tracking-tight mb-2 ${
              isApproved ? 'text-emerald-900' : 'text-red-900'
            }`}>
              {isApproved ? 'Congratulations! You are Approved' : 'Not Eligible Right Now'}
            </h2>
            <p className={`text-lg font-medium ${
              isApproved ? 'text-emerald-700/80' : 'text-red-700/80'
            }`}>
              {isApproved 
                ? 'Based on your profile, you have a high probability of securing this loan.'
                : 'Your profile does not meet the criteria for this specific loan request.'
              }
            </p>
          </div>

          <div className={`flex flex-col items-center justify-center shrink-0 px-6 py-4 rounded-2xl bg-white/60 backdrop-blur-sm border ${
            isApproved ? 'border-emerald-200' : 'border-red-200'
          }`}>
            <span className="text-sm font-bold uppercase tracking-wider text-text-secondary mb-1">AI Confidence</span>
            <span className={`text-3xl font-black ${
              isApproved ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {confidencePercent}%
            </span>
          </div>
        </div>

        {/* Try Again CTA for Rejected */}
        {!isApproved && (
          <div className="mt-8 flex justify-center md:justify-start">
            <button 
              onClick={onReset}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-md hover-lift"
            >
              <RotateCcw size={18} />
              Adjust & Try Again
            </button>
          </div>
        )}
      </div>

      {/* Rejection Reasons & Suggestions */}
      {!isApproved && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {result.rejection_reasons?.length > 0 && (
            <div className="bg-surface p-6 rounded-2xl border border-border-subtle shadow-sm">
              <h3 className="text-lg font-bold text-text-primary mb-4">Why were you rejected?</h3>
              <div className="space-y-3">
                {result.rejection_reasons.map((r, i) => <ReasonCard key={i} reason={r} />)}
              </div>
            </div>
          )}
          {result.improvement_suggestions?.length > 0 && (
            <div className="bg-surface p-6 rounded-2xl border border-border-subtle shadow-sm">
              <h3 className="text-lg font-bold text-text-primary mb-4">How to improve your chances</h3>
              <div className="space-y-3">
                {result.improvement_suggestions.map((s, i) => <SuggestionCard key={i} suggestion={s} />)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* EMI Details */}
      {isApproved && result.emi_details && (
        <div className="mt-8">
          <EMICard emiDetails={result.emi_details} />
        </div>
      )}

      {/* Recommended Banks */}
      {isApproved && result.recommended_banks?.length > 0 && (
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
            Top Recommendations <span className="text-sm font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">{result.recommended_banks.length} Matches</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {result.recommended_banks.map((bank, index) => (
              <BankCard key={index} bank={bank} rank={index + 1} />
            ))}
          </div>
        </div>
      )}

      {/* Financial Health */}
      {result.financial_health && (
        <FinancialHealthGauge health={result.financial_health} />
      )}
    </motion.div>
  );
};

const LoanEligibilityPage = () => {
  const [globalError, setGlobalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  
  const resultRef = useRef(null);
  const formRef = useRef(null);
  const { addApplication } = useApplicationHistory();

  const { register, handleSubmit, control, watch, formState: { errors, isValid }, setError, reset } = useForm({
    resolver: zodResolver(loanSchema),
    mode: 'all',
    defaultValues: {
      married: '',
      self_employed: '',
      dependents: '0',
      education: 'Graduate',
      gender: 'Male',
      applicant_income: 50000,
      coapplicant_income: '',
      savings: '',
      existing_loans: '',
      loan_amount: 1000000,
      loan_amount_term: 120,
      property_area: 'Urban',
      credit_history: '',
    }
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setGlobalError('');
    setResult(null);
    
    try {
      // Compute debt_ratio client-side: estimated EMI for the requested loan
      // plus a flat ₹5,000/month per existing loan, divided by total income.
      // Compute debt_ratio client-side: estimated EMI for the requested loan
      // plus a flat ₹5,000/month per existing loan, divided by total income.
      const finalData = { ...data, coapplicant_income: data.coapplicant_income || 0 };
      const totalIncome = finalData.applicant_income + finalData.coapplicant_income;

      // Estimate monthly EMI for the loan being requested (8.5% matches the
      // backend EMICalculator fallback rate used before a bank is selected)
      const monthlyRate = 8.5 / 12 / 100;
      const tenureMonths = finalData.loan_amount_term || 360;
      const factor = Math.pow(1 + monthlyRate, tenureMonths);
      const estimatedNewEmi = finalData.loan_amount > 0
        ? (finalData.loan_amount * monthlyRate * factor) / (factor - 1)
        : 0;

      const existingLoanObligation = finalData.existing_loans * 5000; // flat estimate per existing loan
      const totalMonthlyObligation = estimatedNewEmi + existingLoanObligation;

      finalData.debt_ratio = totalIncome > 0
        ? Math.min(totalMonthlyObligation / totalIncome, 5) // cap at 5 to avoid extreme outliers skewing the model
        : 1; // if no income reported, treat as maximally risky rather than 0

      const response = await predictLoan(finalData);
      setResult(response);
      
      // Store in history
      addApplication({
        type: 'loan',
        result: response.prediction,
        score: response.financial_health?.score,
        confidence: response.confidence_score
      });

      // Scroll to result smoothly
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

    } catch (err) {
      if (err.response?.status === 400 && typeof err.response.data === 'object') {
        const errorData = err.response.data;
        Object.keys(errorData).forEach((field) => {
          if (Array.isArray(errorData[field])) {
            setError(field, { type: 'server', message: errorData[field][0] });
          }
        });
        setGlobalError('Please fix the errors in the form.');
      } else {
        setGlobalError('We couldn\'t process your application — please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const FieldError = ({ name }) => (
    <AnimatePresence>
      {errors[name] && (
        <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-1.5 text-xs font-medium text-danger">
          {errors[name]?.message}
        </motion.p>
      )}
    </AnimatePresence>
  );

  return (
    <div className="max-w-5xl mx-auto pb-24">
      <div className="mb-10" ref={formRef}>
        <h1 className="text-3xl font-extrabold text-text-primary tracking-tight mb-2">Check Your Home Loan Eligibility</h1>
        <p className="text-text-secondary text-lg max-w-2xl">
          Fill in your details below to get an instant AI-powered eligibility decision, customized EMI plans, and matched banks.
        </p>
      </div>

      <AnimatePresence>
        {globalError && (
          <motion.div 
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-3 p-4 bg-danger/10 text-danger text-sm font-medium rounded-xl border border-danger/20">
              <AlertCircle size={18} />
              {globalError}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-surface rounded-3xl shadow-sm border border-border-subtle overflow-hidden">
        {/* SECTION 1: Personal Details */}
        <div className="p-8 md:p-10 border-b border-border-subtle">
          <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">1</span>
            Personal Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Gender</label>
              <select {...register('gender')} className="w-full px-4 py-3 bg-background border border-border-subtle rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <FieldError name="gender" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Marital Status</label>
              <div className="flex items-center gap-6 py-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="true" {...register('married')} className="w-4 h-4 text-primary accent-primary" />
                  <span className="text-sm font-medium text-text-secondary">Married</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="false" {...register('married')} className="w-4 h-4 text-primary accent-primary" />
                  <span className="text-sm font-medium text-text-secondary">Single</span>
                </label>
              </div>
              <FieldError name="married" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Dependents</label>
              <select {...register('dependents')} className="w-full px-4 py-3 bg-background border border-border-subtle rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none">
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3+">3+</option>
              </select>
              <FieldError name="dependents" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Education</label>
              <select {...register('education')} className="w-full px-4 py-3 bg-background border border-border-subtle rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none">
                <option value="Graduate">Graduate</option>
                <option value="Not Graduate">Not Graduate</option>
              </select>
              <FieldError name="education" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Employment Type</label>
              <div className="flex items-center gap-6 py-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="true" {...register('self_employed')} className="w-4 h-4 text-primary accent-primary" />
                  <span className="text-sm font-medium text-text-secondary">Self Employed</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="false" {...register('self_employed')} className="w-4 h-4 text-primary accent-primary" />
                  <span className="text-sm font-medium text-text-secondary">Salaried</span>
                </label>
              </div>
              <FieldError name="self_employed" />
            </div>
          </div>
        </div>

        {/* SECTION 2: Income Details */}
        <div className="p-8 md:p-10 border-b border-border-subtle bg-background/50">
          <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">2</span>
            Financial Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2 flex justify-between">
                Monthly Income
                <span className="text-primary font-bold">
                  {watch('applicant_income') ? `₹${watch('applicant_income').toLocaleString('en-IN')}/month` : ''}
                </span>
              </label>
              <input 
                type="range" 
                min="10000" 
                max="1000000" 
                step="1000" 
                {...register('applicant_income', { valueAsNumber: true })} 
                className="w-full accent-primary h-2 bg-border-subtle rounded-lg appearance-none cursor-pointer mt-3" 
              />
              <div className="flex justify-between text-xs text-text-secondary mt-2">
                <span>₹10K</span>
                <span>₹10L</span>
              </div>
              <FieldError name="applicant_income" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Co-applicant Income <span className="text-text-secondary font-normal">(Optional)</span></label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-text-secondary font-semibold">₹</span>
                <input 
                  type="number" 
                  placeholder="e.g. 25000"
                  onKeyDown={(e) => {
                    if (['e', 'E', '+', '-', '.'].includes(e.key)) e.preventDefault();
                  }}
                  onInput={(e) => {
                    if (e.target.value.length > 1 && e.target.value.startsWith('0')) {
                      e.target.value = e.target.value.replace(/^0+/, '');
                      if (e.target.value === '') e.target.value = '0';
                    }
                  }}
                  {...register('coapplicant_income')} 
                  className={`w-full pl-8 pr-4 py-3 bg-surface border rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all ${errors.coapplicant_income ? 'border-danger' : 'border-border-subtle'}`} 
                />
              </div>
              <FieldError name="coapplicant_income" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Total Savings</label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-text-secondary font-semibold">₹</span>
                <input 
                  type="number" 
                  placeholder="e.g. 150000"
                  onKeyDown={(e) => {
                    if (['e', 'E', '+', '-', '.'].includes(e.key)) e.preventDefault();
                  }}
                  onInput={(e) => {
                    if (e.target.value.length > 1 && e.target.value.startsWith('0')) {
                      e.target.value = e.target.value.replace(/^0+/, '');
                      if (e.target.value === '') e.target.value = '0';
                    }
                  }}
                  {...register('savings')} 
                  className={`w-full pl-8 pr-4 py-3 bg-surface border rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all ${errors.savings ? 'border-danger' : 'border-border-subtle'}`} 
                />
              </div>
              <FieldError name="savings" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Number of Existing Loans</label>
              <select {...register('existing_loans', { valueAsNumber: true })} className={`w-full px-4 py-3 bg-surface border rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none ${errors.existing_loans ? 'border-danger' : 'border-border-subtle'}`}>
                <option value="" disabled>Select number of loans</option>
                {[...Array(11).keys()].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
              <FieldError name="existing_loans" />
            </div>
          </div>
        </div>

        {/* SECTION 3: Loan Details */}
        <div className="p-8 md:p-10">
          <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">3</span>
            Loan Requirements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2 flex justify-between">
                Required Loan Amount
                <span className="text-primary font-bold">₹{watch('loan_amount')?.toLocaleString('en-IN')}</span>
              </label>
              <input type="range" min="10000" max="5000000" step="10000" {...register('loan_amount', { valueAsNumber: true })} className="w-full accent-primary h-2 bg-border-subtle rounded-lg appearance-none cursor-pointer mt-3" />
              <div className="flex justify-between text-xs text-text-secondary mt-2">
                <span>₹10K</span>
                <span>₹50L</span>
              </div>
              <FieldError name="loan_amount" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Loan Term (Months)</label>
              <select {...register('loan_amount_term', { valueAsNumber: true })} className="w-full px-4 py-3 bg-background border border-border-subtle rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none">
                <option value="12">1 Year (12 months)</option>
                <option value="36">3 Years (36 months)</option>
                <option value="60">5 Years (60 months)</option>
                <option value="120">10 Years (120 months)</option>
                <option value="240">20 Years (240 months)</option>
                <option value="360">30 Years (360 months)</option>
              </select>
              <FieldError name="loan_amount_term" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Property Area</label>
              <div className="flex bg-background rounded-xl p-1 border border-border-subtle">
                {['Urban', 'Semiurban', 'Rural'].map(area => (
                  <label key={area} className="flex-1 text-center">
                    <input type="radio" value={area} {...register('property_area')} className="hidden peer" />
                    <div className="py-2.5 text-sm font-semibold text-text-secondary rounded-lg cursor-pointer peer-checked:bg-surface peer-checked:text-primary peer-checked:shadow-sm transition-all">
                      {area}
                    </div>
                  </label>
                ))}
              </div>
              <FieldError name="property_area" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Do you have a good credit history?</label>
              <div className="flex items-center gap-6 py-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="1" {...register('credit_history')} className="w-4 h-4 text-primary accent-primary" />
                  <span className="text-sm font-medium text-text-secondary">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="0" {...register('credit_history')} className="w-4 h-4 text-primary accent-primary" />
                  <span className="text-sm font-medium text-text-secondary">No</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="not_sure" {...register('credit_history')} className="w-4 h-4 text-primary accent-primary" />
                  <span className="text-sm font-medium text-text-secondary">Not Sure</span>
                </label>
              </div>
              <FieldError name="credit_history" />
            </div>
          </div>
        </div>

        <div className="p-8 bg-background border-t border-border-subtle">
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl shadow-lg shadow-primary/20 text-base font-bold text-surface bg-primary hover:bg-primary-dark focus:outline-none focus:ring-4 focus:ring-primary/30 transition-all hover-lift disabled:opacity-70 disabled:hover:-translate-y-0 disabled:hover:shadow-none disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Analyzing your application...
              </>
            ) : (
              'Predict Eligibility'
            )}
          </button>
        </div>
      </form>

      <div ref={resultRef}>
        <ResultSection result={result} onReset={handleReset} />
      </div>
    </div>
  );
};

export default LoanEligibilityPage;
