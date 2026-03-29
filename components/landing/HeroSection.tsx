import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CreditScoreGauge from "./CreditScoreGauge";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen bg-hero-gradient overflow-hidden pt-24 flex items-center">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left — copy */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-7"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2"
            >
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">FCRA & FDCPA Powered Disputes</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Dispute Errors.{" "}
              <span className="text-gradient">Repair Your Credit.</span>{" "}
              With AI.
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              Upload your credit report and our AI instantly identifies FCRA violations, errors, and disputable items — then generates professional dispute letters ready to send to all three bureaus.
            </p>

            <ul className="space-y-3">
              {[
                "Scans all 3 bureau reports for violations & errors",
                "Generates legally grounded dispute letters",
                "Step-by-step guidance — send, track & follow up",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-foreground">
                  <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button
                size="lg"
                className="gap-2 shadow-glow bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => navigate('/app')}
              >
                Start Free Analysis
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              >
                See How It Works
              </Button>
            </div>

            <p className="text-xs text-muted-foreground pt-1">
              No credit card required · Upload your PDF · Results in minutes
            </p>
          </motion.div>

          {/* Right — animated credit score gauge */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <div className="bg-card rounded-3xl p-8 shadow-card-hover border border-border">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-foreground">See Your Score Climb 👋</h2>
                <p className="text-muted-foreground text-sm">After disputing errors with AI-generated letters</p>
              </div>

              {/* Bureau tabs */}
              <div className="flex justify-center gap-2 mb-8">
                {["TransUnion", "Equifax", "Experian"].map((bureau, i) => (
                  <button
                    key={bureau}
                    className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                    style={{
                      backgroundColor: i === 0 ? "hsl(84, 81%, 44%)" : "hsl(120, 10%, 93%)",
                      color: i === 0 ? "white" : "hsl(160, 10%, 45%)"
                    }}
                  >
                    {bureau}
                  </button>
                ))}
              </div>

              <CreditScoreGauge score={803} change={6} />

              <Button
                className="w-full mt-8 bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                size="lg"
                onClick={() => navigate('/app')}
              >
                Analyze My Report
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-xl animate-pulse" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
