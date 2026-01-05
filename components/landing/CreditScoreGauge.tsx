import { motion } from "framer-motion";

interface CreditScoreGaugeProps {
  score: number;
  change?: number;
}

const CreditScoreGauge = ({ score, change = 6 }: CreditScoreGaugeProps) => {
  const percentage = ((score - 300) / (850 - 300)) * 100;
  const rotation = (percentage / 100) * 180 - 90;

  return (
    <div className="relative flex flex-col items-center">
      {/* Gauge Arc */}
      <div className="relative w-72 h-36">
        {/* SVG Gauge */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 200 100"
          style={{ transform: "rotate(0deg)" }}
        >
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="hsl(0, 84%, 60%)" />
              <stop offset="50%" stopColor="hsl(38, 92%, 50%)" />
              <stop offset="100%" stopColor="hsl(84, 81%, 44%)" />
            </linearGradient>
          </defs>
          {/* Background arc */}
          <path
            d="M 10 100 A 90 90 0 0 1 190 100"
            fill="none"
            stroke="hsl(120, 10%, 93%)"
            strokeWidth="18"
            strokeLinecap="round"
          />
          {/* Colored gradient arc */}
          <path
            d="M 10 100 A 90 90 0 0 1 190 100"
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth="18"
            strokeLinecap="round"
            strokeDasharray="282.7"
            strokeDashoffset={282.7 - (percentage / 100) * 282.7}
            style={{ transition: "stroke-dashoffset 1.5s ease-out 0.5s" }}
          />
        </svg>

        {/* Score indicator needle */}
        <motion.div
          className="absolute bottom-0 left-1/2 origin-bottom"
          initial={{ rotate: -90 }}
          animate={{ rotate: rotation }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
          style={{ transformOrigin: "bottom center" }}
        >
          <div className="w-1.5 h-28 rounded-full -translate-x-1/2" style={{ backgroundColor: "hsl(160, 30%, 10%)" }} />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full" style={{ backgroundColor: "hsl(160, 30%, 10%)" }} />
        </motion.div>

        {/* Score labels */}
        <span className="absolute bottom-0 -left-2 text-xs font-medium" style={{ color: "hsl(160, 10%, 45%)" }}>300</span>
        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium" style={{ color: "hsl(160, 10%, 45%)" }}>580</span>
        <span className="absolute bottom-0 -right-2 text-xs font-medium" style={{ color: "hsl(160, 10%, 45%)" }}>850</span>
      </div>

      {/* Change indicator */}
      {change > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="absolute top-4 right-8 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1"
          style={{ backgroundColor: "hsl(84, 81%, 44%)", color: "white" }}
        >
          <span>▲</span>
          <span>{change} pts</span>
        </motion.div>
      )}

      {/* Score display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-4 text-center"
      >
        <div className="text-6xl font-bold" style={{ color: "hsl(160, 30%, 10%)" }}>{score}</div>
        <p className="text-sm mt-1" style={{ color: "hsl(160, 10%, 45%)" }}>Your Credit Score</p>
      </motion.div>
    </div>
  );
};

export default CreditScoreGauge;
