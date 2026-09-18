import { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, IndianRupee, Gift, ChevronUp } from 'lucide-react';
import { getCardCatalog } from '../../api/cards';
import { motion, AnimatePresence } from 'framer-motion';
import CreditCardCard from '../shared/CreditCardCard';

const ExploreAllCards = ({ onViewDetails, onCompare, isCompareDisabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [catalog, setCatalog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('lowest_fee');

  const categories = ['All', 'Cashback', 'Travel', 'Shopping', 'Premium', 'Student', 'Rewards', 'Business', 'Lifetime Free'];

  useEffect(() => {
    if (isOpen && catalog.length === 0) {
      loadCatalog();
    }
  }, [isOpen]);

  const loadCatalog = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getCardCatalog();
      setCatalog(data);
    } catch (err) {
      setError('Failed to load card catalog. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCards = catalog.filter(card => {
    // Search
    const matchesSearch = 
      card.card_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      card.bank_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category filter
    let matchesCategory = true;
    if (activeCategory !== 'All') {
      if (activeCategory === 'Lifetime Free') {
        matchesCategory = parseFloat(card.annual_fee) === 0;
      } else {
        matchesCategory = card.category.toLowerCase() === activeCategory.toLowerCase();
      }
    }

    return matchesSearch && matchesCategory;
  });

  const sortedCards = [...filteredCards].sort((a, b) => {
    const feeA = parseFloat(a.annual_fee) || 0;
    const feeB = parseFloat(b.annual_fee) || 0;
    
    if (sortBy === 'lowest_fee') return feeA - feeB;
    if (sortBy === 'highest_fee') return feeB - feeA;
    return 0; // Default order
  });

  return (
    <div className="mt-20 border-t border-border-subtle pt-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-text-primary tracking-tight">Explore All Credit Cards</h2>
          <p className="text-text-secondary text-lg mt-1">Browse our complete database of {catalog.length > 0 ? catalog.length : '19'} premium cards</p>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-surface border border-border-subtle hover:border-primary text-text-primary font-bold shadow-sm transition-all hover:shadow-md"
        >
          {isOpen ? 'Hide Catalog' : 'View Full Catalog'}
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
            <ChevronDown size={20} />
          </motion.div>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            {/* Filters & Search */}
            <div className="bg-surface p-6 rounded-3xl border border-border-subtle shadow-sm mb-8 space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search size={18} className="absolute left-4 top-3.5 text-text-secondary" />
                  <input 
                    type="text" 
                    placeholder="Search by card or bank name..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-background border border-border-subtle rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
                
                {/* Sort */}
                <div className="w-full md:w-48 shrink-0">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border-subtle rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="lowest_fee">Lowest Fee First</option>
                    <option value="highest_fee">Highest Fee First</option>
                  </select>
                </div>
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1.5 mr-2 text-text-secondary text-sm font-semibold uppercase tracking-wider">
                  <Filter size={14} /> Filter:
                </div>
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${
                      activeCategory === cat 
                        ? 'bg-primary text-white shadow-md shadow-primary/20' 
                        : 'bg-background border border-border-subtle text-text-secondary hover:border-primary hover:text-primary'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Results */}
            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center text-primary gap-4">
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                <p className="font-semibold text-lg text-text-secondary">Loading complete catalog...</p>
              </div>
            ) : error ? (
              <div className="py-12 text-center text-danger font-semibold bg-danger/5 rounded-2xl border border-danger/10">
                {error}
              </div>
            ) : (
              <div>
                <div className="mb-6 font-semibold text-text-secondary">
                  Showing {sortedCards.length} {sortedCards.length === 1 ? 'card' : 'cards'}
                </div>
                
                {sortedCards.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedCards.map(card => (
                      <CreditCardCard 
                        key={card.id} 
                        card={{...card, card_id: card.id, best_for: card.category}} 
                        rank={null}
                        onViewDetails={onViewDetails}
                        onCompare={onCompare}
                        isCompareDisabled={isCompareDisabled}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-24 bg-surface rounded-3xl border border-dashed border-border-subtle">
                    <p className="text-lg text-text-secondary font-medium">No cards found matching your filters.</p>
                    <button 
                      onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}
                      className="mt-4 text-primary font-bold hover:underline"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExploreAllCards;
