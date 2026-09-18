import { motion } from 'framer-motion';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import { CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

const FinancialHealthGauge = ({ health }) => {
  if (!health) return null;
  
  const { score, grade, strengths = [], weaknesses = [], recommendations = [] } = health;
  
  const getColor = () => {
    if (grade === 'Excellent' || grade === 'Good') return '#10B981'; // emerald-500
    if (grade === 'Fair') return '#F59E0B'; // amber-500
    return '#EF4444'; // red-500
  };

  const chartData = [{ name: 'Score', value: score, fill: getColor() }];

  return (
    <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-border-subtle shadow-sm mt-8">
      <h3 className="text-xl font-bold text-text-primary mb-6">Financial Health Analysis</h3>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Gauge */}
        <div className="flex flex-col items-center justify-center shrink-0">
          <div className="relative w-48 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart 
                cx="50%" cy="50%" 
                innerRadius="80%" outerRadius="100%" 
                barSize={12} 
                data={chartData} 
                startAngle={210} endAngle={-30}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar 
                  minAngle={15} 
                  background={{ fill: '#E2E8F0' }} // border-subtle
                  clockWise 
                  dataKey="value" 
                  cornerRadius={10}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-4">
              <div className="flex items-baseline font-extrabold text-4xl text-text-primary">
                <AnimatedCounter value={score} duration={1.5} />
              </div>
              <span className="text-sm font-semibold text-text-secondary">/ 100</span>
            </div>
          </div>
          
          <div className="mt-2 text-center">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
              grade === 'Excellent' || grade === 'Good' ? 'bg-emerald-100 text-emerald-700' :
              grade === 'Fair' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
            }`}>
              {grade}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                Strengths
              </h4>
              {strengths.length > 0 ? (
                <ul className="space-y-2">
                  {strengths.map((s, i) => (
                    <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-text-secondary italic">No clear strengths identified.</p>
              )}
            </div>

            <div>
              <h4 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-500" />
                Areas to Improve
              </h4>
              {weaknesses.length > 0 ? (
                <ul className="space-y-2">
                  {weaknesses.map((w, i) => (
                    <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      {w}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-text-secondary italic">No significant weaknesses.</p>
              )}
            </div>
          </div>

          {recommendations.length > 0 && (
            <div className="pt-4 border-t border-border-subtle">
              <h4 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
                <Lightbulb size={16} className="text-primary" />
                Recommendations
              </h4>
              <ul className="space-y-2">
                {recommendations.map((r, i) => (
                  <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialHealthGauge;
