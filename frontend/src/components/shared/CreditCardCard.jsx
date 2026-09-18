import { motion } from 'framer-motion';
import { CreditCard as CardIcon, IndianRupee, Gift, Check, Star, Sparkles, TrendingUp, Info, Scale } from 'lucide-react';
import { getCardImage } from '../../utils/cardImages';

const categoryColors = {
  'travel': 'bg-blue-100 text-blue-700',
  'cashback': 'bg-green-100 text-green-700',
  'rewards': 'bg-purple-100 text-purple-700',
  'student': 'bg-orange-100 text-orange-700',
  'business': 'bg-slate-100 text-slate-700',
  'premium': 'bg-yellow-100 text-yellow-800',
  'default': 'bg-gray-100 text-gray-700'
};

const CreditCardCard = ({ card, rank, onViewDetails, onCompare, isCompareDisabled }) => {
  const categoryStr = card.category?.toLowerCase() || 'default';
  const badgeStyle = categoryColors[categoryStr] || categoryColors.default;

  const image = getCardImage(card.card_name);

  return (
    <motion.div 
      className={`relative bg-surface rounded-3xl border border-blue-100 hover:border-blue-300 shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-2 overflow-hidden flex flex-col group`}
    >
      {/* Image Header */}
      <div className="h-[175px] w-full relative bg-[#08111f] flex items-center justify-center overflow-hidden">
        {image ? (
          <>
            <img
              src={image}
              alt={card.card_name}
              className="max-w-[90%] max-h-[88%] object-contain object-center z-10 relative"
            />
            <div 
              className="absolute inset-0 z-10 pointer-events-none"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.45), rgba(0,0,0,0.08))' }}
            ></div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
             <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
             <div className="absolute -right-16 -top-16 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
             <CardIcon size={48} className="absolute bottom-4 right-4 text-white/10" />
          </div>
        )}

        {/* Badges Overlay */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
          {rank === 1 ? (
            <span className="bg-[#FBBF24] text-[#111827] text-xs font-semibold px-3 py-1 rounded-full shadow-md">
              ⭐ TOP PICK
            </span>
          ) : <div />}
          
          <div className="flex items-center gap-1.5 bg-[#2563EB] text-white px-3 py-1 rounded-full shadow-sm">
            <span className="font-semibold text-white text-xs">✨ {card.recommendation_score}% Match</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-5 pb-5 flex-1 flex flex-col bg-gradient-to-b from-surface to-background/50">
        
        {/* Title and Category Chips */}
        <div className="mt-3 flex flex-col">
          <div className="text-xs tracking-[0.18em] uppercase font-semibold text-gray-500">
            {card.bank_name || 'Partner Bank'}
          </div>
          <div className="text-[30px] font-bold leading-tight tracking-tight text-text-primary mt-1">
            {card.card_name || 'Credit Card'}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-[10px]">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${badgeStyle}`}>
            {card.category || 'Rewards'}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
            Best For: {card.best_for || 'General'}
          </span>
        </div>
        
        {/* Key Features */}
        <div className="mt-[18px] flex flex-col gap-3">
          <div className="space-y-3 bg-surface p-4 rounded-2xl border border-border-subtle/50 shadow-sm">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary flex items-center gap-2"><IndianRupee size={15} /> Annual Fee</span>
              <span className="font-bold text-text-primary">
                {card.annual_fee === 0 ? <span className="text-emerald-600">Lifetime Free</span> : `₹${card.annual_fee?.toLocaleString()}`}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary flex items-center gap-2"><Gift size={15} /> Reward Type</span>
              <span className="font-bold text-text-primary truncate max-w-[120px] text-right" title={card.reward_type}>
                {card.reward_type || 'Cashback'}
              </span>
            </div>
          </div>
          
          <div className="bg-[#ECFDF5] border border-[#BBF7D0] p-4 rounded-2xl flex items-center justify-between shadow-sm">
            <span className="text-emerald-700 flex items-center gap-2 text-sm font-semibold"><TrendingUp size={16} /> Est. Savings</span>
            <span className="text-green-600 font-bold text-lg">
              ₹{card.estimated_savings?.toLocaleString()}/year
            </span>
          </div>
        </div>

        {/* AI Recommendation Reason */}
        {card.ai_reasons && card.ai_reasons.length > 0 && (
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-5 mt-4">
            <h4 className="text-sm font-bold text-blue-600 mb-3 flex items-center gap-2 uppercase tracking-wide">
              <Sparkles size={16} /> Why AI Recommended This
            </h4>
            <ul className="space-y-2">
              {card.ai_reasons.slice(0, 3).map((reason, idx) => (
                <li key={idx} className="text-[13px] text-text-secondary flex items-start gap-2">
                  <Check size={16} className="text-green-500 shrink-0 mt-0.5" />
                  <span className="leading-snug">{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-auto pt-5 grid grid-cols-2 gap-3">
          <button 
            onClick={(e) => { e.preventDefault(); onCompare?.(card); }}
            disabled={isCompareDisabled}
            className={`flex items-center justify-center gap-1.5 h-[44px] rounded-xl border text-sm font-bold transition-colors ${
              isCompareDisabled 
                ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-200 text-text-primary'
            }`}
          >
            <Scale size={16} /> {isCompareDisabled ? 'Max 3 Cards' : 'Compare'}
          </button>
          <button 
            onClick={(e) => { e.preventDefault(); onViewDetails?.(card); }}
            className="flex items-center justify-center gap-1.5 h-[44px] rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/25 text-white text-sm font-bold transition-colors"
          >
            <Info size={16} /> Details
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CreditCardCard;
