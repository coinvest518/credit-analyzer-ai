import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  impact: "high" | "medium" | "low";
  description: string;
  delay?: number;
}

const impactStyles = {
  high: { backgroundColor: "hsl(0, 84%, 90%)", color: "hsl(0, 84%, 30%)" },
  medium: { backgroundColor: "hsl(38, 92%, 90%)", color: "hsl(38, 92%, 30%)" },
  low: { backgroundColor: "hsl(142, 76%, 90%)", color: "hsl(142, 76%, 20%)" },
};

const impactLabels = {
  high: "High impact",
  medium: "Medium impact",
  low: "Low impact",
};

const StatsCard = ({ title, value, impact, description, delay = 0 }: StatsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer border"
      style={{
        backgroundColor: "white",
        borderColor: "hsl(120, 10%, 90%)"
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm mb-2" style={{ color: "hsl(160, 10%, 45%)" }}>{title}</p>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold" style={{ color: "hsl(160, 30%, 10%)" }}>{value}</span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={impactStyles[impact]}>
              {impactLabels[impact]}
            </span>
          </div>
          <p className="text-xs mt-2" style={{ color: "hsl(160, 10%, 45%)" }}>{description}</p>
        </div>
        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-all" style={{ color: "hsl(160, 10%, 45%)" }} />
      </div>
    </motion.div>
  );
};

export default StatsCard;
