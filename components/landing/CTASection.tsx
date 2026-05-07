import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const CTASection = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  return (
    <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5">
              Ready to Start{" "}
              <span className="text-gradient">Disputing?</span>
            </h2>
            <p className="text-lg text-slate-300 mb-10 max-w-xl mx-auto">
              Upload your credit report and let the AI find everything worth disputing. Takes less than 5 minutes.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 text-base px-8"
              onClick={() => navigate(currentUser ? '/app' : '/app?auth=true')}
            >
              Start Free Analysis
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 gap-2 text-base px-8"
              onClick={() => window.open('https://cal.com/bookme-daniel', '_blank')}
            >
              Book a Consultation
              <ExternalLink className="w-4 h-4" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-x-8 gap-y-2 mt-8 text-sm text-slate-400"
          >
            <span>✓ Free report analysis</span>
            <span>✓ No credit card required</span>
            <span>✓ Results in minutes</span>
            <span>✓ Pro plans from $9.99/mo</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-10 pt-8 border-t border-white/10 flex flex-wrap justify-center gap-6"
          >
            <a
              href="https://linktr.ee/omniai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white text-sm flex items-center gap-1 transition-colors"
            >
              All Links <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://buymeacoffee.com/coinvest"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white text-sm flex items-center gap-1 transition-colors"
            >
              Digital Store <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={() => navigate('/pricing')}
              className="text-slate-400 hover:text-white text-sm transition-colors"
            >
              View Pricing
            </button>
            <button
              onClick={() => navigate('/blog')}
              className="text-slate-400 hover:text-white text-sm transition-colors"
            >
              Blog
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
