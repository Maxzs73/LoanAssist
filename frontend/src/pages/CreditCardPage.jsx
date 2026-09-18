import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertCircle, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { predictCard } from '../api/cards';
import { useApplicationHistory } from '../store/historyStore';
import CreditCardCard from '../components/shared/CreditCardCard';
import FinancialHealthGauge from '../components/shared/FinancialHealthGauge';
import { ReasonCard, SuggestionCard } from '../components/shared/ReasonCard';
import { formatConfidence } from '../utils/formatters';
import CompareCardsPanel from '../components/cards/CompareCardsPanel';
import ExploreAllCards from '../components/cards/ExploreAllCards';
import CreditCardDetailsModal from '../components/cards/CreditCardDetailsModal';

const cardSchema = z.object({
  age: z.number({ invalid_type_error: "Please enter your age" }).min(18, "Must be at least 18").max(100),
  annual_income: z.number({ invalid_type_error: "Please enter your annual income" }).min(0, "Cannot be negative"),
  credit_score: z.number({ invalid_type_error: "Please enter your credit score" }).min(300, "Typically between 300-900").max(900, "Typically between 300-900"),
  employment_status: z.enum(['employed', 'self_employed', 'unemployed', 'student', 'retired']),
  existing_credit_cards: z.number({ invalid_type_error: "Please enter number of existing cards" }).min(0).max(50),
  total_debt: z.number({ invalid_type_error: "Please enter total outstanding debt" }).min(0),
  monthly_housing_payment: z.number({ invalid_type_error: "Please enter monthly housing payment" }).min(0),
  bank_balance: z.number({ invalid_type_error: "Please enter your bank balance" }).min(0),
  selected_credit_card: z.string().optional().nullable(),
});

const ResultSection = ({ result, onReset, onViewDetails, onCompare, isCompareDisabled }) => {
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
      <div className={`p-8 md:p-10 rounded-3xl border shadow-xl relative overflow-hidden ${
        isApproved ? 'bg-emerald-50 border-emerald-200 shadow-emerald-900/5' : 'bg-red-50 border-red-200 shadow-red-900/5'
      }`}>
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
              {isApproved ? 'Approved for Credit' : 'Not Eligible Right Now'}
            </h2>
            <p className={`text-lg font-medium ${
              isApproved ? 'text-emerald-700/80' : 'text-red-700/80'
            }`}>
              {isApproved 
                ? 'Great news! Your profile meets the criteria for top credit cards.'
                : 'Your profile does not currently meet the criteria for our credit card partners.'
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
              <h3 className="text-lg font-bold text-text-primary mb-4">How to improve your score</h3>
              <div className="space-y-3">
                {result.improvement_suggestions.map((s, i) => <SuggestionCard key={i} suggestion={s} />)}
              </div>
            </div>
          )}
        </div>
      )}

      {isApproved && result.recommended_cards?.length > 0 && (
        <div className="mt-12">
          <div className="mb-8 p-6 bg-gradient-to-r from-primary/10 to-transparent rounded-2xl border border-primary/10">
            <h3 className="text-xl font-extrabold text-primary mb-2">Recommendation Summary</h3>
            <p className="text-text-secondary">
              Out of <span className="font-bold text-text-primary">{result.total_available_cards || 19} available cards</span>, <span className="font-bold text-emerald-600">{result.total_eligible_cards || result.recommended_cards.length} cards matched</span> your profile. The top {result.recommended_cards.length} recommendations are shown below.
            </p>
          </div>
          
          <h3 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
            Top Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {result.recommended_cards.map((card, index) => (
              <CreditCardCard 
                key={index} 
                card={card} 
                rank={index + 1} 
                onViewDetails={onViewDetails}
                onCompare={onCompare}
                isCompareDisabled={isCompareDisabled}
              />
            ))}
          </div>
        </div>
      )}

      {result.financial_health && (
        <FinancialHealthGauge health={result.financial_health} />
      )}
    </motion.div>
  );
};

const CreditCardPage = () => {
  const [globalError, setGlobalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  
  // State for modals/panels
  const [selectedCardForDetails, setSelectedCardForDetails] = useState(null);
  const [compareCards, setCompareCards] = useState([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  
  const resultRef = useRef(null);
  const formRef = useRef(null);
  const { addApplication } = useApplicationHistory();

  const { register, handleSubmit, watch, formState: { errors }, setError, setValue } = useForm({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      age: 25,
      annual_income: 600000,
      credit_score: 750,
      employment_status: 'employed',
      existing_credit_cards: 0,
      total_debt: 0,
      monthly_housing_payment: 10000,
      bank_balance: 50000,
      selected_credit_card: ''
    }
  });

  const handleZeroFocus = (e) => {
    if (e.target.value === '0') e.target.value = '';
  };

  const handleZeroBlur = (e, fieldName) => {
    if (e.target.value === '') {
      setValue(fieldName, 0, { shouldValidate: true });
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setGlobalError('');
    setResult(null);
    
    try {
      const payload = { ...data };
      if (!payload.selected_credit_card) {
        payload.selected_credit_card = null;
      }
      
      const response = await predictCard(payload);
      setResult(response);
      
      addApplication({
        type: 'card',
        result: response.prediction,
        score: response.financial_health?.score,
        confidence: response.confidence_score
      });

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

  const handleViewDetails = (card) => {
    setSelectedCardForDetails(card);
  };

  const handleCompare = (card) => {
    setCompareCards(prev => {
      // Don't add if already there
      if (prev.find(c => c.card_id === card.card_id)) return prev;
      // Keep max 3 cards
      const newCards = [...prev, card];
      if (newCards.length > 3) newCards.shift();
      return newCards;
    });
    setIsCompareOpen(true);
  };

  const handleRemoveCompareCard = (cardId) => {
    setCompareCards(prev => prev.filter(c => c.card_id !== cardId));
    if (compareCards.length <= 1) {
      setIsCompareOpen(false);
    }
  };

  const isCompareDisabled = compareCards.length >= 3;

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
        <h1 className="text-3xl font-extrabold text-text-primary tracking-tight mb-2">Find Your Perfect Credit Card</h1>
        <p className="text-text-secondary text-lg max-w-2xl">
          Get an instant AI-powered eligibility decision and discover credit cards perfectly matched to your profile.
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
        <div className="p-8 md:p-10 border-b border-border-subtle">
          <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">1</span>
            Your Profile
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Age</label>
              <input type="number" {...register('age', { valueAsNumber: true })} className="w-full px-4 py-3 bg-background border border-border-subtle rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
              <FieldError name="age" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Employment Status</label>
              <select {...register('employment_status')} className="w-full px-4 py-3 bg-background border border-border-subtle rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none">
                <option value="employed">Employed</option>
                <option value="self_employed">Self Employed</option>
                <option value="unemployed">Unemployed</option>
                <option value="student">Student</option>
                <option value="retired">Retired</option>
              </select>
              <FieldError name="employment_status" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Annual Income</label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-text-secondary font-semibold">₹</span>
                <input type="number" {...register('annual_income', { valueAsNumber: true })} className="w-full pl-8 pr-4 py-3 bg-background border border-border-subtle rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
              </div>
              <FieldError name="annual_income" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Credit Score *</label>
              <input type="number" placeholder="300 - 900" {...register('credit_score', { valueAsNumber: true })} className="w-full px-4 py-3 bg-background border border-border-subtle rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
              <FieldError name="credit_score" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Number of Existing Credit Cards</label>
              <input type="number" {...register('existing_credit_cards', { valueAsNumber: true, onBlur: (e) => handleZeroBlur(e, 'existing_credit_cards') })} onFocus={handleZeroFocus} className="w-full px-4 py-3 bg-background border border-border-subtle rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
              <FieldError name="existing_credit_cards" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Total Debt</label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-text-secondary font-semibold">₹</span>
                <input type="number" {...register('total_debt', { valueAsNumber: true, onBlur: (e) => handleZeroBlur(e, 'total_debt') })} onFocus={handleZeroFocus} className="w-full pl-8 pr-4 py-3 bg-background border border-border-subtle rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
              </div>
              <FieldError name="total_debt" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Monthly Housing Payment</label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-text-secondary font-semibold">₹</span>
                <input type="number" {...register('monthly_housing_payment', { valueAsNumber: true })} className="w-full pl-8 pr-4 py-3 bg-background border border-border-subtle rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
              </div>
              <FieldError name="monthly_housing_payment" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Bank Balance</label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-text-secondary font-semibold">₹</span>
                <input type="number" {...register('bank_balance', { valueAsNumber: true })} className="w-full pl-8 pr-4 py-3 bg-background border border-border-subtle rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
              </div>
              <FieldError name="bank_balance" />
            </div>

          </div>
        </div>

        <div className="p-8 bg-background border-t border-border-subtle">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl shadow-lg shadow-primary/20 text-base font-bold text-surface bg-primary hover:bg-primary-dark focus:outline-none focus:ring-4 focus:ring-primary/30 transition-all hover-lift disabled:opacity-70 disabled:hover:-translate-y-0 disabled:hover:shadow-none"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Analyzing your profile...
              </>
            ) : (
              'Check Eligibility'
            )}
          </button>
        </div>
      </form>

      <div ref={resultRef}>
        <ResultSection 
          result={result} 
          onReset={handleReset} 
          onViewDetails={handleViewDetails}
          onCompare={handleCompare}
          isCompareDisabled={isCompareDisabled}
        />
      </div>

      <ExploreAllCards 
        onViewDetails={handleViewDetails}
        onCompare={handleCompare}
        isCompareDisabled={isCompareDisabled}
      />

      <CompareCardsPanel 
        cards={compareCards}
        recommendedCards={result?.recommended_cards || []}
        isOpen={isCompareOpen}
        onClose={() => {
          setIsCompareOpen(false);
          setCompareCards([]);
        }}
        onRemoveCard={handleRemoveCompareCard}
        onAddCard={handleCompare}
      />

      <CreditCardDetailsModal 
        card={selectedCardForDetails}
        isOpen={!!selectedCardForDetails}
        onClose={() => setSelectedCardForDetails(null)}
      />
    </div>
  );
};

export default CreditCardPage;
