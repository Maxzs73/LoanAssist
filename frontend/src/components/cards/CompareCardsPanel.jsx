import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Minus, Info, Search, Plus, CreditCard as CardIcon } from 'lucide-react';
import { getCardCatalog } from '../../api/cards';
import { getCardImage } from '../../utils/cardImages';

const CompareCardsPanel = ({ cards, recommendedCards = [], isOpen, onClose, onRemoveCard, onAddCard }) => {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [catalog, setCatalog] = useState([]);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isSelectorOpen && catalog.length === 0) {
      loadCatalog();
    }
  }, [isSelectorOpen]);

  const loadCatalog = async () => {
    setIsLoadingCatalog(true);
    try {
      const data = await getCardCatalog();
      setCatalog(data);
    } catch (err) {
      console.error('Failed to load catalog');
    } finally {
      setIsLoadingCatalog(false);
    }
  };

  if (!isOpen) {
    if (isSelectorOpen) setIsSelectorOpen(false); // Reset if closed externally
    return null;
  }

  const maxCards = 3;

  const normalizeCard = (card) => ({
    ...card,
    match:
        card.recommendation_score ??
        card.match_percentage ??
        card.matchPercent ??
        card.compatibility_score ??
        card.prediction_match ??
        card.match_score ??
        card.match ??
        card.confidence_score ??
        card.prediction_confidence ??
        card.score ??
        null,
    annualFee:
        card.annual_fee !== undefined && card.annual_fee !== null ? Number(card.annual_fee) :
        card.annualFee !== undefined && card.annualFee !== null ? Number(card.annualFee) : null,
    joiningFee:
        card.joining_fee !== undefined && card.joining_fee !== null ? Number(card.joining_fee) :
        card.joiningFee !== undefined && card.joiningFee !== null ? Number(card.joiningFee) : null,
    estimatedSavings:
        card.estimated_yearly_savings !== undefined && card.estimated_yearly_savings !== null ? Number(card.estimated_yearly_savings) :
        card.estimated_savings !== undefined && card.estimated_savings !== null ? Number(card.estimated_savings) :
        card.est_yearly_savings !== undefined && card.est_yearly_savings !== null ? Number(card.est_yearly_savings) : null,
    minimumIncome:
        card.minimum_income !== undefined && card.minimum_income !== null ? Number(card.minimum_income) :
        card.min_income !== undefined && card.min_income !== null ? Number(card.min_income) : null,
    minimumCreditScore:
        card.minimum_credit_score ??
        card.min_credit_score ??
        null,
  });

  const normalizedCards = cards.map(normalizeCard);

  // Features we want to compare
  const features = [
    { key: 'match', label: 'Match %', isHighlight: (vals) => Math.max(...vals), format: (v) => v !== null && v !== undefined ? `${v}%` : 'N/A' },
    { key: 'annualFee', label: 'Annual Fee', isHighlight: (vals) => Math.min(...vals), format: (v) => v === 0 ? 'Lifetime Free' : (v !== null && v !== undefined ? `₹${v.toLocaleString()}` : 'N/A') },
    { key: 'joiningFee', label: 'Joining Fee', isHighlight: (vals) => Math.min(...vals), format: (v) => v === 0 ? 'Lifetime Free' : (v !== null && v !== undefined ? `₹${v.toLocaleString()}` : 'N/A') },
    { key: 'estimatedSavings', label: 'Est. Yearly Savings', isHighlight: (vals) => Math.max(...vals), format: (v) => v !== null && v !== undefined ? `₹${v.toLocaleString()}` : 'N/A' },
    { key: 'minimumIncome', label: 'Min. Income', format: (v) => v !== null && v !== undefined ? `₹${v.toLocaleString()}/yr` : 'N/A' },
    { key: 'minimumCreditScore', label: 'Min. Credit Score', format: (v) => v !== null && v !== undefined ? v : 'N/A' },
    { key: 'reward_type', label: 'Reward Type', format: (v) => v || 'N/A' },
    { key: 'best_for', label: 'Best For', format: (v) => v || 'N/A' },
  ];

  // Helper to extract boolean benefits for comparison (Lounge, Fuel, Dining etc.)
  const hasBenefit = (card, keyword) => {
    if (!card.benefits || !Array.isArray(card.benefits)) return false;
    return card.benefits.some(b => b.toLowerCase().includes(keyword.toLowerCase()));
  };

  const extraBenefits = [
    { key: 'lounge', label: 'Airport Lounge' },
    { key: 'fuel', label: 'Fuel Surcharge' },
    { key: 'dining', label: 'Dining Offers' },
    { key: 'movie', label: 'Movie Tickets' }
  ];

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div 
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-surface w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col border border-border-subtle relative"
        >
          {/* Card Selector Overlay */}
          <AnimatePresence>
            {isSelectorOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute inset-0 z-50 bg-surface flex flex-col"
              >
                <div className="p-6 border-b border-border-subtle flex justify-between items-center bg-background/50">
                  <div>
                    <h3 className="text-xl font-bold text-text-primary">Select a Card to Compare</h3>
                  </div>
                  <button 
                    onClick={() => setIsSelectorOpen(false)}
                    className="p-2 rounded-full hover:bg-slate-200 text-text-secondary hover:text-text-primary transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                <div className="p-6 border-b border-border-subtle">
                  <div className="relative">
                    <Search size={18} className="absolute left-4 top-3.5 text-text-secondary" />
                    <input 
                      type="text" 
                      placeholder="Search by card or bank name..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-background border border-border-subtle rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                  {isLoadingCatalog ? (
                    <div className="flex justify-center py-12">
                      <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {catalog
                        .filter(c => !cards.find(compared => compared.card_id === c.id))
                        .filter(c => 
                          c.card_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.bank_name.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map(card => {
                          const img = getCardImage(card.card_name);
                          return (
                            <button
                              key={card.id}
                              onClick={() => {
                                const recCard = recommendedCards.find(rc => rc.card_id === card.id || rc.id === card.id);
                                const mergedCard = recCard ? { ...card, ...recCard, card_id: card.id, best_for: card.category } : { ...card, card_id: card.id, best_for: card.category };
                                onAddCard(mergedCard);
                                setIsSelectorOpen(false);
                                setSearchTerm('');
                              }}
                              className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-border-subtle hover:border-primary hover:shadow-md transition-all text-left group"
                            >
                              <div className="w-20 h-14 bg-slate-900 rounded-lg shrink-0 flex items-center justify-center overflow-hidden border border-slate-200 shadow-sm relative">
                                {img ? (
                                  <img src={img} alt={card.card_name} className="w-full h-full object-contain p-1" />
                                ) : (
                                  <CardIcon className="text-white/30" size={24} />
                                )}
                              </div>
                              <div className="flex-1 overflow-hidden">
                                <div className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-0.5">{card.bank_name}</div>
                                <div className="font-bold text-text-primary text-sm truncate">{card.card_name}</div>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-bold uppercase">{card.category}</span>
                                  <span className="text-[11px] text-text-secondary font-medium">Fee: ₹{card.annual_fee?.toLocaleString() || 0}</span>
                                </div>
                              </div>
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors text-slate-400 shrink-0">
                                <Plus size={16} />
                              </div>
                            </button>
                          );
                        })}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Header */}
          <div className="p-6 border-b border-border-subtle flex justify-between items-center bg-background/50">
            <div>
              <h2 className="text-2xl font-bold text-text-primary">Compare Credit Cards</h2>
              <p className="text-text-secondary text-sm">Comparing {cards.length} of {maxCards} cards</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-200 text-text-secondary hover:text-text-primary transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Body */}
          <div className="overflow-x-auto overflow-y-auto flex-1 p-6">
            {cards.length === 0 ? (
              <div className="text-center py-12 text-text-secondary">
                No cards selected for comparison.
              </div>
            ) : (
              <table className="w-full min-w-[600px] border-collapse">
                <thead>
                  <tr>
                    <th className="p-4 text-left w-48 border-b border-border-subtle align-bottom">
                      <span className="text-sm font-semibold text-text-secondary">Features & Benefits</span>
                    </th>
                    {normalizedCards.map((card, idx) => (
                      <th key={card.card_id} className="p-4 border-b border-border-subtle w-64 align-bottom">
                        <div className="relative">
                          {idx !== 0 && normalizedCards[0].match !== null && card.match !== null && normalizedCards[0].match > card.match && (
                            <div className="absolute -top-10 left-0 right-0 bg-yellow-50 text-yellow-800 text-[10px] p-1.5 rounded-md border border-yellow-200 flex items-start gap-1">
                              <Info size={12} className="shrink-0 mt-0.5" />
                              <span className="font-normal leading-tight text-left">
                                Why not Rank #1? Lower match score ({card.match}%) than {normalizedCards[0].card_name}.
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] uppercase font-bold text-primary tracking-wider bg-primary/10 px-2 py-0.5 rounded">Card {idx + 1}</span>
                            <button onClick={() => onRemoveCard(card.card_id)} className="text-danger/60 hover:text-danger text-xs flex items-center gap-1"><X size={12}/> Remove</button>
                          </div>
                          <div className="h-12 flex items-end">
                            <span className="font-bold text-text-primary text-base leading-tight">{card.card_name}</span>
                          </div>
                        </div>
                      </th>
                    ))}
                    {/* Filler for empty slots */}
                    {Array.from({ length: maxCards - cards.length }).map((_, i) => (
                      <th key={`empty-${i}`} className="p-4 border-b border-border-subtle w-64 align-bottom">
                        <button 
                          onClick={() => setIsSelectorOpen(true)}
                          className="w-full h-20 flex flex-col items-center justify-center border-2 border-dashed border-border-subtle hover:border-primary hover:bg-primary/5 rounded-xl text-text-secondary/50 hover:text-primary transition-all group"
                        >
                          <Plus size={20} className="mb-1 opacity-50 group-hover:opacity-100" />
                          <span className="text-xs font-bold">ADD CARD</span>
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {features.map(feature => {
                    // Extract values for highlighting
                    const values = normalizedCards.map(c => c[feature.key]).filter(v => typeof v === 'number');
                    const bestValue = feature.isHighlight && values.length > 0 ? feature.isHighlight(values) : null;

                    return (
                      <tr key={feature.key} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-medium text-text-secondary text-sm border-b border-border-subtle/50">
                          {feature.label}
                        </td>
                        {normalizedCards.map(card => {
                          const val = card[feature.key];
                          const isBest = bestValue !== null && val === bestValue;
                          return (
                            <td key={card.card_id} className={`p-4 border-b border-border-subtle/50 ${isBest ? 'bg-emerald-50/30' : ''}`}>
                              <span className={`text-sm ${isBest ? 'font-bold text-emerald-700' : 'text-text-primary font-medium'}`}>
                                {feature.format ? feature.format(val) : val}
                              </span>
                              {isBest && <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold uppercase">Best</span>}
                            </td>
                          );
                        })}
                        {Array.from({ length: maxCards - normalizedCards.length }).map((_, i) => (
                          <td key={`empty-td-${i}`} className="p-4 border-b border-border-subtle/50"></td>
                        ))}
                      </tr>
                    );
                  })}
                  
                  {/* Extra Boolean Benefits */}
                  {extraBenefits.map(eb => (
                    <tr key={eb.key} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-medium text-text-secondary text-sm border-b border-border-subtle/50">
                        {eb.label}
                      </td>
                      {normalizedCards.map(card => {
                        const hasIt = hasBenefit(card, eb.key);
                        return (
                          <td key={card.card_id} className="p-4 border-b border-border-subtle/50">
                            {hasIt ? <Check size={18} className="text-emerald-500" /> : <Minus size={18} className="text-slate-300" />}
                          </td>
                        );
                      })}
                      {Array.from({ length: maxCards - cards.length }).map((_, i) => (
                        <td key={`empty-btd-${i}`} className="p-4 border-b border-border-subtle/50"></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CompareCardsPanel;
