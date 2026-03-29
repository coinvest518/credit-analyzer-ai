import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Upload, Brain, Send, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Get Your Credit Reports",
    description:
      "You need all 3 bureau reports — Experian, TransUnion, and Equifax. Get them free or with full monitoring.",
    details: [
      "Free from annualcreditreport.com (legally required once/year)",
      "$1 trial — all 3 reports + daily monitoring via IDIQ",
      "Download as PDF and upload directly to our tool",
    ],
    cta: null,
    accent: "bg-blue-50 border-blue-200",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    numberColor: "text-blue-200",
  },
  {
    number: "02",
    icon: Brain,
    title: "AI Scans & Identifies Violations",
    description:
      "Upload your PDF and our AI analyzes it against FCRA, FDCPA, and FCBA law — finding every disputable item.",
    details: [
      "Detects errors, outdated accounts, and wrong balances",
      "Identifies FCRA violations and statute of limitations issues",
      "Scores each item by dispute strength",
    ],
    cta: { label: "Try the Tool Free", href: "/app" },
    accent: "bg-primary/5 border-primary/20",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    numberColor: "text-primary/20",
  },
  {
    number: "03",
    icon: Send,
    title: "Dispute, Send & Track",
    description:
      "Generate professionally written dispute letters for each bureau and creditor. Then follow our guided process to send and track responses.",
    details: [
      "Personalized letters per bureau and per account",
      "Send via certified mail with our step-by-step guide",
      "Track response deadlines (bureaus have 30 days to respond)",
    ],
    cta: null,
    accent: "bg-green-50 border-green-200",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    numberColor: "text-green-200",
  },
];

const FeaturesSection = () => {
  const navigate = useNavigate();
  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Three Steps to a{" "}
            <span className="text-gradient">Cleaner Credit Report</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            No credit repair company needed. Our AI gives you the same letters and strategy — at a fraction of the cost.
          </p>
        </motion.div>

        <div className="space-y-8 max-w-4xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className={`relative rounded-2xl border p-6 sm:p-8 ${step.accent}`}
              >
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Step number + icon */}
                  <div className="flex-shrink-0 flex sm:flex-col items-center sm:items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl ${step.iconBg} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${step.iconColor}`} />
                    </div>
                    <span className={`text-5xl font-black ${step.numberColor} hidden sm:block`}>
                      {step.number}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-4xl font-black ${step.numberColor} sm:hidden`}>{step.number}</span>
                      <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">{step.description}</p>
                    <ul className="space-y-2">
                      {step.details.map((detail) => (
                        <li key={detail} className="flex items-start gap-2 text-sm text-foreground/80">
                          <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${step.iconBg} border ${step.accent}`} />
                          {detail}
                        </li>
                      ))}
                    </ul>
                    {step.cta && (
                      <Button
                        className="mt-5 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                        onClick={() => navigate(step.cta!.href)}
                      >
                        {step.cta.label}
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
