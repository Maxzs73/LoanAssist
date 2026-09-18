import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, CreditCard as CardIcon, IndianRupee, Briefcase, TrendingUp, Sparkles, Star } from 'lucide-react';
import { getCardImage } from '../../utils/cardImages';

const CreditCardDetailsModal = ({ card, isOpen, onClose }) => {
  if (!isOpen || !card) return null;

  const minIncome = card.minimum_income || card.min_income || card.monthly_income_requirement;
  const minCreditScore = card.minimum_credit_score || card.credit_score_requirement || card.min_credit_score;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-surface rounded-3xl shadow-2xl border border-border-subtle"
        >
          {/* Header Area */}
          <div className="relative p-8 pb-12 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-primary/30 rounded-full blur-3xl pointer-events-none"></div>
            
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md z-10 text-white"
            >
              <X size={24} />
            </button>

            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start mt-4">
              {/* Card Image */}
              <div className="w-64 h-40 rounded-2xl bg-gradient-to-tr from-white/10 to-transparent border border-white/20 shadow-2xl flex items-center justify-center overflow-hidden shrink-0">
                {getCardImage(card.card_name) ? (
                  <img src={getCardImage(card.card_name)} alt={card.card_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-white/50 flex flex-col items-center">
                    <CardIcon size={48} className="mb-2" />
                    <span className="text-xs uppercase tracking-widest">{card.bank_name}</span>
                  </div>
                )}
              </div>

              {/* Title & Badges */}
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md">
                    {card.category}
                  </span>
                  {card.recommendation_score && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/80 backdrop-blur-md flex items-center gap-1">
                      <Sparkles size={12} /> {card.recommendation_score}% Match
                    </span>
                  )}
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">{card.card_name}</h2>
                <p className="text-lg text-white/80 font-medium">{card.bank_name}</p>
              </div>
            </div>
          </div>

          {/* Body Area */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Left Column: Fees & Savings */}
              <div className="md:col-span-1 space-y-6">
                <div className="bg-slate-50 p-6 rounded-2xl border border-border-subtle">
                  <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4">Fees & Charges</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-text-secondary mb-1">Annual Fee</div>
                      <div className="text-xl font-bold text-text-primary">
                        {card.annual_fee === 0 ? <span className="text-emerald-600">Lifetime Free</span> : `₹${card.annual_fee?.toLocaleString()}`}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-text-secondary mb-1">Joining Fee</div>
                      <div className="text-lg font-bold text-text-primary">
                        {card.joining_fee === 0 ? 'Free' : `₹${card.joining_fee?.toLocaleString()}`}
                      </div>
                    </div>
                  </div>
                </div>

                {card.estimated_savings && (
                  <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                    <h3 className="text-sm font-bold text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <TrendingUp size={16} /> Est. Yearly Savings
                    </h3>
                    <div className="text-3xl font-black text-emerald-600">
                      ₹{card.estimated_savings.toLocaleString()}
                    </div>
                    <p className="text-xs text-emerald-700/80 mt-2">Based on typical spending in your profile category.</p>
                  </div>
                )}
              </div>

              {/* Right Column: Features & Eligibility */}
              <div className="md:col-span-2 space-y-8">
                
                {/* AI Reasons */}
                {card.ai_reasons && card.ai_reasons.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                      <Sparkles size={20} className="text-primary" /> AI Recommendation
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {card.ai_reasons.map((reason, idx) => (
                        <div key={idx} className="flex items-start gap-2 bg-primary/5 p-3 rounded-xl border border-primary/10">
                          <Check size={18} className="text-primary shrink-0 mt-0.5" />
                          <span className="text-sm font-medium text-text-primary">{reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Eligibility */}
                <div>
                  <h3 className="text-xl font-bold text-text-primary mb-4">Eligibility Requirements</h3>
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    <div className="bg-surface p-4 rounded-xl border border-border-subtle shrink-0 min-w-[160px]">
                      <div className="text-xs text-text-secondary font-bold uppercase tracking-wider mb-1">Min. Income</div>
                      <div className="text-lg font-black text-text-primary">
                        {minIncome ? `₹${Number(minIncome).toLocaleString()}` : 'N/A'}
                      </div>
                      <div className="text-xs text-text-secondary mt-1">per year</div>
                    </div>
                    <div className="bg-surface p-4 rounded-xl border border-border-subtle shrink-0 min-w-[160px]">
                      <div className="text-xs text-text-secondary font-bold uppercase tracking-wider mb-1">Min. Credit Score</div>
                      <div className="text-lg font-black text-text-primary">
                        {minCreditScore ? minCreditScore : 'N/A'}
                      </div>
                      <div className="text-xs text-text-secondary mt-1">CIBIL/Experian</div>
                    </div>
                  </div>
                </div>

                {/* Features list */}
                {card.benefits && Array.isArray(card.benefits) && card.benefits.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-text-primary mb-4">Key Features & Benefits</h3>
                    <ul className="space-y-3">
                      {card.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Star size={18} className="text-amber-500 shrink-0 mt-0.5" />
                          <span className="text-text-secondary">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CreditCardDetailsModal;
