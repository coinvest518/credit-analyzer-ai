import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      className="group rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border"
      style={{
        backgroundColor: "white",
        borderColor: "hsl(120, 10%, 90%)"
      }}
    >
      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary transition-colors"
        style={{
          backgroundColor: "hsl(84, 81%, 44%, 0.1)"
        }}
      >
        <Icon className="w-6 h-6" style={{ color: "hsl(84, 81%, 44%)" }} />
      </div>
      <h3 className="text-lg font-semibold mb-2" style={{ color: "hsl(160, 30%, 10%)" }}>{title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: "hsl(160, 10%, 45%)" }}>{description}</p>
    </motion.div>
  );
};

export default FeatureCard;
