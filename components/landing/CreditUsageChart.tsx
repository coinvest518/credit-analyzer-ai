import { motion } from "framer-motion";

interface CreditUsageChartProps {
  percentage: number;
  amount: number;
  total: number;
}

const CreditUsageChart = ({ percentage, amount, total }: CreditUsageChartProps) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl p-6 shadow-card border"
      style={{ backgroundColor: "white", borderColor: "hsl(120, 10%, 90%)" }}
    >
      <h3 className="text-lg font-semibold mb-4" style={{ color: "hsl(160, 30%, 10%)" }}>Credit card use</h3>
      
      <div className="flex items-center gap-6">
        {/* Donut Chart */}
        <div className="relative">
          <svg width="140" height="140" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="hsl(120, 10%, 93%)"
              strokeWidth="12"
            />
            {/* Progress circle */}
            <motion.circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="hsl(84, 81%, 44%)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              whileInView={{ strokeDashoffset }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold" style={{ color: "hsl(160, 30%, 10%)" }}>{percentage}%</span>
            <span className="text-xs" style={{ color: "hsl(160, 10%, 45%)" }}>
              ${amount.toLocaleString()} of ${total.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2 text-xs">
          <p style={{ color: "hsl(160, 10%, 45%)" }}>
            Keep your balances low! Check in regularly. You can see updates once a week.
          </p>
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(84, 81%, 44%)" }} />
              <span style={{ color: "hsl(160, 10%, 45%)" }}>0-9%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(142, 76%, 36%)" }} />
              <span style={{ color: "hsl(160, 10%, 45%)" }}>10-29%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(38, 92%, 50%)" }} />
              <span style={{ color: "hsl(160, 10%, 45%)" }}>30-49%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(0, 84%, 60%)" }} />
              <span style={{ color: "hsl(160, 10%, 45%)" }}>50%+</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CreditUsageChart;
