import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ArrowRight, Calculator } from 'lucide-react';
import AnimatedCounter from '../components/shared/AnimatedCounter';

const EMICalculatorPage = () => {
  const [loanAmount, setLoanAmount] = useState(5000000); // 50 Lakhs default
  const [interestRate, setInterestRate] = useState(8.5); // 8.5% default
  const [tenureYears, setTenureYears] = useState(20); // 20 years default

  // Calculate EMI
  const { monthlyEmi, totalPayment, totalInterest } = useMemo(() => {
    const monthlyRate = interestRate / 12 / 100;
    const tenureMonths = tenureYears * 12;
    
    let emi = 0;
    let payment = 0;
    let interest = 0;
    
    if (interestRate === 0) {
      emi = loanAmount / tenureMonths;
      payment = loanAmount;
      interest = 0;
    } else {
      const factor = Math.pow(1 + monthlyRate, tenureMonths);
      emi = (loanAmount * monthlyRate * factor) / (factor - 1);
      payment = emi * tenureMonths;
      interest = payment - loanAmount;
    }

    return {
      monthlyEmi: emi,
      totalPayment: payment,
      totalInterest: interest
    };
  }, [loanAmount, interestRate, tenureYears]);

  const pieData = [
    { name: 'Principal Amount', value: loanAmount, color: '#3b82f6' }, // blue-500
    { name: 'Total Interest', value: totalInterest, color: '#f59e0b' }, // amber-500
  ];

  const formatRupee = (val) => new Intl.NumberFormat('en-IN').format(val);

  return (
    <div className="max-w-6xl mx-auto pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-text-primary tracking-tight mb-2 flex items-center gap-3">
          <Calculator className="text-primary" size={32} />
          EMI Calculator
        </h1>
        <p className="text-text-secondary text-lg">
          Plan your loan repayment instantly with our interactive calculator.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Inputs */}
        <div className="lg:col-span-5 space-y-8 bg-surface p-8 rounded-3xl border border-border-subtle shadow-sm">
          
          {/* Loan Amount Input */}
          <div>
            <div className="flex justify-between items-end mb-4">
              <label className="text-sm font-semibold text-text-primary">Loan Amount</label>
              <div className="relative w-1/2">
                <span className="absolute left-3 top-2.5 text-text-secondary font-semibold">₹</span>
                <input 
                  type="number"
                  min={50000}
                  max={20000000}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 bg-background border border-border-subtle rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-semibold text-right"
                />
              </div>
            </div>
            <input 
              type="range"
              min={50000}
              max={20000000}
              step={50000}
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full accent-primary h-2 bg-border-subtle rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs font-medium text-text-secondary mt-2">
              <span>₹50K</span>
              <span>₹2Cr</span>
            </div>
          </div>

          {/* Interest Rate Input */}
          <div>
            <div className="flex justify-between items-end mb-4">
              <label className="text-sm font-semibold text-text-primary">Interest Rate (% p.a.)</label>
              <div className="relative w-1/3">
                <input 
                  type="number"
                  min={5}
                  max={20}
                  step={0.1}
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full pl-3 pr-8 py-2 bg-background border border-border-subtle rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-semibold text-right"
                />
                <span className="absolute right-3 top-2.5 text-text-secondary font-semibold">%</span>
              </div>
            </div>
            <input 
              type="range"
              min={5}
              max={20}
              step={0.1}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full accent-primary h-2 bg-border-subtle rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs font-medium text-text-secondary mt-2">
              <span>5%</span>
              <span>20%</span>
            </div>
          </div>

          {/* Tenure Input */}
          <div>
            <div className="flex justify-between items-end mb-4">
              <label className="text-sm font-semibold text-text-primary">Tenure (Years)</label>
              <div className="relative w-1/3">
                <input 
                  type="number"
                  min={1}
                  max={30}
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full pl-3 pr-8 py-2 bg-background border border-border-subtle rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-semibold text-right"
                />
                <span className="absolute right-3 top-2.5 text-text-secondary font-semibold text-xs">Yr</span>
              </div>
            </div>
            <input 
              type="range"
              min={1}
              max={30}
              step={1}
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full accent-primary h-2 bg-border-subtle rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs font-medium text-text-secondary mt-2">
              <span>1 Yr</span>
              <span>30 Yrs</span>
            </div>
          </div>

        </div>

        {/* Right Column: Results (Sticky) */}
        <div className="lg:col-span-7 sticky top-24 space-y-6">
          <div className="bg-surface rounded-3xl border border-border-subtle shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            
            <div className="p-8 md:p-10 text-center relative z-10 border-b border-border-subtle">
              <span className="text-sm font-bold uppercase tracking-wider text-text-secondary mb-2 block">Monthly EMI</span>
              <AnimatedCounter 
                value={monthlyEmi} 
                prefix="₹" 
                duration={0.6}
                wrapperClassName="flex flex-col items-center justify-center"
                className="text-5xl md:text-6xl font-black text-primary tracking-tight"
              />
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <AnimatedCounter 
                  value={loanAmount} 
                  label="Principal Amount" 
                  prefix="₹" 
                  duration={0.6}
                  wrapperClassName="flex flex-col items-start"
                  className="text-2xl font-bold text-text-primary"
                />
                <AnimatedCounter 
                  value={totalInterest} 
                  label="Total Interest Payable" 
                  prefix="₹" 
                  duration={0.6}
                  wrapperClassName="flex flex-col items-start"
                  className="text-2xl font-bold text-amber-500"
                />
                <AnimatedCounter 
                  value={totalPayment} 
                  label="Total Payment (Principal + Interest)" 
                  prefix="₹" 
                  duration={0.6}
                  wrapperClassName="flex flex-col items-start"
                  className="text-2xl font-bold text-text-primary"
                />
              </div>

              <div className="h-[250px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => `₹${formatRupee(Math.round(value))}`}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link 
              to="/dashboard/loan" 
              state={{ prefillAmount: loanAmount }}
              className="group block bg-primary/10 border border-primary/20 rounded-2xl p-6 text-center hover:bg-primary/15 transition-colors"
            >
              <span className="text-primary font-bold text-lg flex items-center justify-center gap-2">
                Ready to check if you're eligible for this loan?
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EMICalculatorPage;
