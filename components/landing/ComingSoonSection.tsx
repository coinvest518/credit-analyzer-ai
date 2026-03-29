import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Bot, Send, BellRing, BarChart3, Mail, Zap, CheckCircle } from "lucide-react";

const upcomingFeatures = [
  {
    icon: Bot,
    title: "AI Dispute Agent",
    description: "Fully automated AI agent that manages the entire dispute process end-to-end — no manual steps.",
    eta: "Q3 2025",
  },
  {
    icon: Mail,
    title: "Automated Certified Mailing",
    description: "AI generates and physically mails your dispute letters via certified mail directly to the bureaus.",
    eta: "Q3 2025",
  },
  {
    icon: BarChart3,
    title: "Score Tracking Dashboard",
    description: "Live credit score tracking across all 3 bureaus with progress charts and milestone alerts.",
    eta: "Q4 2025",
  },
  {
    icon: Send,
    title: "Bureau Response Tracker",
    description: "Automatically track bureau responses, 30-day deadlines, and next steps for each dispute.",
    eta: "Q4 2025",
  },
];

const ComingSoonSection = () => {
  const [email, setEmail] = useState("");
  const [notified, setNotified] = useState(false);

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    setNotified(true);
  };

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">
            <Zap className="w-3 h-3" />
            Coming Soon
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            The Future of{" "}
            <span className="text-gradient">AI Credit Repair</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            We're building AI automation that handles the entire credit repair process for you — from scanning to mailing to tracking responses.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {upcomingFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-2xl p-5 relative overflow-hidden"
              >
                {/* Blurred "coming soon" overlay hint */}
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] font-bold text-primary/60 bg-primary/10 px-2 py-0.5 rounded-full">
                    {feature.eta}
                  </span>
                </div>

                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-sm font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Email notify */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center"
        >
          <BellRing className="w-8 h-8 text-primary mx-auto mb-3" />
          <h3 className="text-xl font-bold text-foreground mb-2">Get Notified When It Launches</h3>
          <p className="text-muted-foreground text-sm mb-5">
            Be first in line when AI automation goes live. Early access members get 30 days free.
          </p>
          {notified ? (
            <div className="flex flex-col items-center gap-2">
              <CheckCircle className="w-8 h-8 text-primary" />
              <p className="text-foreground font-semibold">You're on the list!</p>
              <p className="text-muted-foreground text-sm">We'll email you the moment it's ready.</p>
            </div>
          ) : (
            <form onSubmit={handleNotify} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary"
              />
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1 shrink-0">
                Notify Me
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default ComingSoonSection;
