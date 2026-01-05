import React from 'react';
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { usePayment } from "../../contexts/PaymentContext";

const PricingPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { redirectToPayment, isPaid } = usePayment();

  const handleTierClick = (tierName: string) => {
    if (tierName === "Basic") {
      navigate('/app');
      return;
    }

    if (!currentUser) {
      // Redirect to app with a flag to show auth modal or just let them sign in
      navigate('/app?auth=true');
      return;
    }

    if (tierName === "Pro") {
      redirectToPayment();
    } else if (tierName === "Enterprise") {
      // For now, enterprise also goes to payment or a contact form
      // Let's just use the same payment for now or redirect to app
      navigate('/app');
    }
  };

  const tiers = [
    {
      name: "Basic",
      price: "$0",
      description: "Perfect for getting started with credit repair.",
      features: [
        "1 Credit Report Analysis",
        "Basic Dispute Templates",
        "Email Support",
        "Score Tracking"
      ],
      buttonText: "Get Started",
      highlight: false
    },
    {
      name: "Pro",
      price: "$10",
      period: "/month",
      description: "Our most popular plan for serious credit repair.",
      features: [
        "Unlimited AI Analysis",
        "AI-Generated Dispute Letters",
        "Priority Support",
        "Advanced Score Insights",
        "Bureau Syncing"
      ],
      buttonText: "Start Pro Trial",
      highlight: true
    },
    {
      name: "Enterprise",
      price: "$29",
      period: "/month",
      description: "For power users and credit professionals.",
      features: [
        "Everything in Pro",
        "Multi-User Support",
        "White-label Reports",
        "API Access",
        "Dedicated Account Manager"
      ],
      buttonText: "Contact Sales",
      highlight: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Simple, Transparent Pricing</h1>
            <p className="text-xl text-muted-foreground">
              Choose the plan that's right for your credit journey. No hidden fees, cancel anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-3xl p-8 border ${
                  tier.highlight
                    ? "border-primary shadow-glow bg-primary/5"
                    : "border-border bg-card"
                }`}
              >
                {tier.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    MOST POPULAR
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    {tier.period && <span className="text-muted-foreground">{tier.period}</span>}
                  </div>
                  <p className="text-muted-foreground mt-4 text-sm">
                    {tier.description}
                  </p>
                </div>

                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <Check className="w-5 h-5 text-primary shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    tier.highlight
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                      : ""
                  }`}
                  variant={tier.highlight ? "default" : "outline"}
                  onClick={() => handleTierClick(tier.name)}
                  disabled={tier.name === "Pro" && isPaid}
                >
                  {tier.name === "Pro" && isPaid ? "Current Plan" : tier.buttonText}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;
