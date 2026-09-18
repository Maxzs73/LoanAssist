import { useMemo, useEffect } from 'react';
import useAuthStore from '../store/authStore';
import { useApplicationHistory } from '../store/historyStore';
import AnimatedCounter from '../components/shared/AnimatedCounter';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { FileText, CreditCard, Activity, TrendingUp, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const fadeInStagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const fadeUpVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const StatCard = ({ icon: Icon, label, value, subtext, badge }) => (
  <motion.div variants={fadeUpVariant} className="bg-surface p-6 rounded-2xl border border-border-subtle shadow-sm flex flex-col h-full">
    <div className="flex items-start justify-between mb-4">
      <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center text-text-secondary border border-border-subtle">
        <Icon size={20} />
      </div>
      {badge && (
        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${badge.colorClass}`}>
          {badge.text}
        </span>
      )}
    </div>
    <div className="mt-auto">
      <div className="text-3xl font-extrabold text-text-primary mb-1">
        {typeof value === 'number' ? <AnimatedCounter value={value} duration={1} /> : value}
      </div>
      <div className="text-sm font-semibold text-text-secondary">{label}</div>
      {subtext && <div className="text-xs text-text-secondary mt-2">{subtext}</div>}
    </div>
  </motion.div>
);

const DashboardPage = () => {
  const { user } = useAuthStore();
  const { history, fetchHistory, isLoading } = useApplicationHistory();

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const displayName = user?.first_name || user?.username || 'User';
  
  // Format current date e.g., "Monday, October 23, 2023"
  const currentDate = new Intl.DateTimeFormat('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  }).format(new Date());

  // Derived stats from local history
  const loanApps = history.filter(h => h.type === 'loan').length;
  const cardApps = history.filter(h => h.type === 'card').length;
  
  const approvedCount = history.filter(h => h.result === 'Approved').length;
  const rejectedCount = history.filter(h => h.result === 'Rejected').length;
  const pendingCount = history.filter(h => h.result === 'Pending').length;

  const latestScore = history.length > 0 ? (history[0].score || 0) : 0;
  
  const getScoreBadge = (score) => {
    if (score >= 80) return { text: 'Excellent', colorClass: 'bg-emerald-100 text-emerald-700' };
    if (score >= 60) return { text: 'Good', colorClass: 'bg-blue-100 text-blue-700' };
    if (score >= 40) return { text: 'Fair', colorClass: 'bg-amber-100 text-amber-700' };
    return { text: 'Poor', colorClass: 'bg-red-100 text-red-700' };
  };

  // Chart Data
  const chartData = [
    { name: 'Approved', value: approvedCount, color: '#10B981' }, // emerald-500
    { name: 'Rejected', value: rejectedCount, color: '#EF4444' }, // red-500
    { name: 'Pending', value: pendingCount, color: '#F59E0B' },   // amber-500
  ].filter(d => d.value > 0);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Welcome back, {displayName} 👋</h1>
        <p className="text-text-secondary mt-1">{currentDate} — Here's your financial overview.</p>
      </div>

      {/* Stats Grid */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={fadeInStagger}
        initial="hidden"
        animate="show"
      >
        <StatCard 
          icon={FileText} 
          label="Loan Applications" 
          value={loanApps} 
          subtext="Total evaluations"
        />
        <StatCard 
          icon={CreditCard} 
          label="Card Applications" 
          value={cardApps} 
          subtext="Total evaluations"
        />
        <StatCard 
          icon={Activity} 
          label="Latest Health Score" 
          value={history.length > 0 ? latestScore : '-'} 
          badge={history.length > 0 ? getScoreBadge(latestScore) : null}
          subtext="Based on last application"
        />
        <StatCard 
          icon={TrendingUp} 
          label="Overall Status" 
          value={`${approvedCount}`} 
          subtext={`${approvedCount} Approved / ${rejectedCount} Rejected`}
          badge={{ text: 'Live', colorClass: 'bg-primary/10 text-primary' }}
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <motion.div variants={fadeUpVariant} initial="hidden" animate="show" className="lg:col-span-1 bg-surface p-6 rounded-2xl border border-border-subtle shadow-sm flex flex-col">
          <h2 className="text-lg font-bold text-text-primary mb-6">Approval Ratio</h2>
          
          <div className="flex-1 flex items-center justify-center min-h-[250px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontWeight: 600 }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-4 border border-border-subtle text-text-secondary">
                  <Activity size={24} />
                </div>
                <p className="text-sm font-medium text-text-primary mb-1">No applications yet</p>
                <p className="text-xs text-text-secondary mb-4 max-w-[200px] mx-auto">Check your eligibility to get started and see your stats here.</p>
                <Link to="/dashboard/loan" className="text-xs font-semibold text-primary hover:text-primary-dark">
                  Start an evaluation &rarr;
                </Link>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={fadeUpVariant} initial="hidden" animate="show" className="lg:col-span-2 bg-surface p-6 rounded-2xl border border-border-subtle shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-text-primary">Recent Activity</h2>
            {history.length > 0 && (
              <span className="text-xs font-semibold text-text-secondary bg-background px-2.5 py-1 rounded-lg border border-border-subtle">
                Showing last 5
              </span>
            )}
          </div>

          <div className="flex-1">
            {history.length > 0 ? (
              <div className="space-y-4">
                {history.slice(0, 5).map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-4 rounded-xl border border-border-subtle hover:bg-background transition-colors cursor-default group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        {app.type === 'loan' ? <FileText size={18} /> : <CreditCard size={18} />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-text-primary">
                          {app.type === 'loan' ? 'Loan Eligibility Check' : 'Credit Card Match'}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {new Date(app.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1.5">
                        {app.result === 'Approved' && <CheckCircle2 size={14} className="text-emerald-500" />}
                        {app.result === 'Rejected' && <XCircle size={14} className="text-red-500" />}
                        {app.result === 'Pending' && <Clock size={14} className="text-amber-500" />}
                        <span className={`text-xs font-bold ${
                          app.result === 'Approved' ? 'text-emerald-600' :
                          app.result === 'Rejected' ? 'text-red-600' : 'text-amber-600'
                        }`}>
                          {app.result}
                        </span>
                      </div>
                      {app.confidence && (
                        <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider">
                          {app.confidence}% Confidence
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-4 border border-border-subtle text-text-secondary">
                  <Clock size={24} />
                </div>
                <p className="text-sm font-medium text-text-primary mb-1">No recent activity</p>
                <p className="text-xs text-text-secondary mb-4 max-w-[250px] mx-auto">Your recent eligibility checks and card matches will appear here.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
