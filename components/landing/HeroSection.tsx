import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, TrendingUp } from "lucide-react";
import CreditScoreGauge from "./CreditScoreGauge";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen bg-hero-gradient overflow-hidden pt-24">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2"
            >
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Credit Repair</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Fix Your Credit Score with{" "}
              <span className="text-gradient">AI Precision</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              DisputeAI automatically identifies errors on your credit report and generates personalized dispute letters. 
              Watch your score climb while our AI does the heavy lifting.
            </p>

            {/* Feature bullets */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Shield className="w-4 h-4 text-primary" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span>Average +45 pts</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Zap className="w-4 h-4 text-primary" />
                <span>Results in 30 Days</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="gap-2 shadow-glow bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => navigate('/app')}>
                Start Free Analysis
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
                See How It Works
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-6 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">50K+</div>
                <div className="text-xs text-muted-foreground">Users Helped</div>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">4.9★</div>
                <div className="text-xs text-muted-foreground">User Rating</div>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">$2M+</div>
                <div className="text-xs text-muted-foreground">Debt Removed</div>
              </div>
            </div>
          </motion.div>

          {/* Right side - Credit Score visualization */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <div className="bg-card rounded-3xl p-8 shadow-card-hover border border-border">
              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-foreground">Hello, Alex 👋</h2>
                <p className="text-muted-foreground">Here is your credit score</p>
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

              {/* Credit Score Gauge */}
              <CreditScoreGauge score={803} change={6} />

              {/* Update button */}
              <Button 
                className="w-full mt-8 bg-primary hover:bg-primary/90 text-primary-foreground" 
                size="lg"
                onClick={() => navigate('/app')}
              >
                Update your credit score
              </Button>
            </div>

            {/* Floating decoration */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-xl animate-pulse-slow" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
