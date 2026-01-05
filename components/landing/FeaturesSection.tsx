import { motion } from "framer-motion";
import { 
  FileText, 
  Brain, 
  Mail, 
  TrendingUp, 
  Shield, 
  Clock 
} from "lucide-react";
import FeatureCard from "./FeatureCard";

const features = [
  {
    icon: Brain,
    title: "AI Credit Analysis",
    description: "Our AI scans your credit report and identifies all errors, inaccuracies, and disputable items automatically.",
  },
  {
    icon: FileText,
    title: "Smart Dispute Letters",
    description: "Generate legally compliant, personalized dispute letters tailored to each negative item on your report.",
  },
  {
    icon: Mail,
    title: "Automated Sending",
    description: "We handle the mailing process for you, sending certified letters directly to credit bureaus.",
  },
  {
    icon: TrendingUp,
    title: "Score Tracking",
    description: "Monitor your credit score improvements in real-time with detailed analytics and progress reports.",
  },
  {
    icon: Shield,
    title: "Bank-Level Security",
    description: "Your data is encrypted with 256-bit SSL and we never store your sensitive information.",
  },
  {
    icon: Clock,
    title: "24/7 Monitoring",
    description: "Get instant alerts when changes occur on your credit report so you're always in the know.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Everything You Need to{" "}
            <span className="text-gradient">Repair Your Credit</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Our AI-powered platform handles the entire dispute process, from identifying errors to tracking your progress.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
