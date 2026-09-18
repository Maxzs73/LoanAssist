import { Calendar, Percent, IndianRupee } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

const EMICard = ({ emiDetails }) => {
  if (!emiDetails) return null;

  return (
    <div className="bg-surface rounded-2xl p-6 border border-border-subtle shadow-sm flex flex-col md:flex-row gap-6 md:items-center justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
            <Calendar size={16} />
          </div>
          <h4 className="font-semibold text-text-primary text-sm">Monthly EMI</h4>
        </div>
        <div className="flex items-baseline gap-1 mt-2">
          <span className="text-xl font-bold text-text-primary">₹</span>
          <AnimatedCounter value={emiDetails.monthly_emi || 0} duration={1.5} />
        </div>
      </div>

      <div className="hidden md:block w-px h-16 bg-border-subtle"></div>

      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
            <Percent size={16} />
          </div>
          <h4 className="font-semibold text-text-primary text-sm">Total Interest</h4>
        </div>
        <div className="flex items-baseline gap-1 mt-2">
          <span className="text-xl font-bold text-text-primary">₹</span>
          <AnimatedCounter value={emiDetails.total_interest || 0} duration={1.5} />
        </div>
      </div>

      <div className="hidden md:block w-px h-16 bg-border-subtle"></div>

      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
            <IndianRupee size={16} />
          </div>
          <h4 className="font-semibold text-text-primary text-sm">Total Payment</h4>
        </div>
        <div className="flex items-baseline gap-1 mt-2">
          <span className="text-xl font-bold text-text-primary">₹</span>
          <AnimatedCounter value={emiDetails.total_payment || 0} duration={1.5} />
        </div>
      </div>
    </div>
  );
};

export default EMICard;
