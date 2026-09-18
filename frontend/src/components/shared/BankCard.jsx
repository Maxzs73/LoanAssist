import { motion } from 'framer-motion';
import { Building2, Percent, IndianRupee } from 'lucide-react';
import { useEffect } from 'react';

const BankCard = ({ bank, rank }) => {
  useEffect(() => {
    if (!bank.bank_name) {
      console.warn("BankCard: 'bank_name' field is missing or null in the bank object. Check backend API response.", bank);
    }
  }, [bank]);

  return (
    <motion.div 
      whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
      className={`relative bg-surface rounded-2xl p-6 border ${rank === 1 ? 'border-primary shadow-md' : 'border-border-subtle shadow-sm'} transition-all`}
    >
      <div className={`absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${rank === 1 ? 'bg-primary text-surface scale-110' : 'bg-background text-text-secondary border border-border-subtle'}`}>
        #{rank}
      </div>
      
      <div className="flex items-center gap-3 mb-4 border-b border-border-subtle pb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <Building2 size={20} />
        </div>
        <div>
          <h4 className="font-bold text-text-primary">{bank.bank_name || 'Partner Bank'}</h4>
        </div>
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary flex items-center gap-1.5"><Percent size={14} /> Interest Rate</span>
          <span className="font-semibold text-text-primary">{bank.interest_rate || '8.5'}%</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary flex items-center gap-1.5"><IndianRupee size={14} /> Proc. Fee</span>
          <span className="font-semibold text-text-primary">₹{bank.processing_fee || '10,000'}</span>
        </div>
      </div>

      {bank.reason && (
        <div className="mt-4 pt-4 border-t border-border-subtle">
          <p className="text-xs text-text-secondary bg-background p-2.5 rounded-lg">
            <span className="font-semibold text-primary">Why:</span> {bank.reason}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default BankCard;
