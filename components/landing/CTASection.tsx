import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const benefits = [
  "Free credit report analysis",
  "AI-generated dispute letters",
  "Track your score improvements",
  "Cancel anytime, no commitment",
];

const CTASection = () => {
  const navigate = useNavigate();
  return (
    <section id="pricing" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full" 
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Ready to Take Control of{" "}
              <span className="text-primary">Your Credit?</span>
            </h2>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              Join over 50,000 users who have improved their credit scores with DisputeAI. 
              Start your free analysis today and see what items you can dispute.
            </p>
          </motion.div>

          {/* Benefits list */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 mb-10"
          >
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-background/10 rounded-full px-4 py-2"
              >
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{benefit}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 text-lg px-8 py-6 shadow-glow"
              onClick={() => navigate('/app')}
            >
              Get Your Free Analysis
              <ArrowRight className="w-5 h-5" />
            </Button>
            <div className="flex flex-col items-center gap-4 mt-4">
              <p className="text-sm text-slate-400">
                No credit card required • Takes 2 minutes
              </p>
              <button 
                onClick={() => navigate('/pricing')}
                className="text-sm text-slate-300 hover:text-white underline underline-offset-4"
              >
                View all pricing plans
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
