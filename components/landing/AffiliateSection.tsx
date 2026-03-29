import { motion } from "framer-motion";
import { ExternalLink, Star, Lock, BarChart2, Home, CreditCard, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

const reportResources = [
  {
    badge: "FREE — Federally Mandated",
    badgeColor: "bg-green-100 text-green-700 border-green-200",
    name: "AnnualCreditReport.com",
    description:
      "The only federally authorized source for free credit reports. Get all 3 bureaus once per year — no strings attached.",
    highlights: ["Experian, TransUnion & Equifax", "100% free, no trial needed", "Required by federal law"],
    cta: "Get Free Reports",
    href: "https://www.annualcreditreport.com",
    icon: Lock,
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
    border: "border-green-200",
  },
  {
    badge: "$1 Trial — Best Value",
    badgeColor: "bg-primary/10 text-primary border-primary/20",
    name: "IdentityIQ — $1 Trial",
    description:
      "All 3 bureau reports + daily credit monitoring, identity theft protection, and score alerts. Start for just $1.",
    highlights: ["All 3 bureau reports (PDF ready)", "Daily score monitoring & alerts", "Identity theft protection included"],
    cta: "Start $1 Trial ($26.86/mo after)",
    href: "https://www.identityiq.com/securepreferred.aspx?offercode=4312970R",
    icon: BarChart2,
    iconBg: "bg-primary/5",
    iconColor: "text-primary",
    border: "border-primary/20",
    featured: true,
  },
];

const buildResources = [
  {
    name: "AVA Finance",
    subtitle: "Credit Builder",
    description: "Build credit by making small monthly payments. Great for thin files or rebuilding after disputes are resolved.",
    cta: "Learn More",
    href: "https://meetava.sjv.io/anDyvY",
    icon: CreditCard,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    badge: "Credit Building",
  },
  {
    name: "Rent Reporters",
    subtitle: "Rent-to-Credit",
    description: "Get credit for rent you're already paying. Reports on-time rent payments to the bureaus to boost your score.",
    cta: "Learn More",
    href: "https://prf.hn/click/camref:1101l3G9fN",
    icon: Home,
    iconBg: "bg-teal-50",
    iconColor: "text-teal-600",
    badge: "Rent Reporting",
  },
  {
    name: "Credit Repair Cloud",
    subtitle: "For Professionals",
    description: "Software for credit consultants and coaches. Manage clients, track disputes, and grow a credit repair business.",
    cta: "Learn More",
    href: "https://get.creditrepaircloud.com/naq3utx717o0",
    icon: Wrench,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    badge: "Pro Tool",
  },
];

const AffiliateSection = () => {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">

        {/* Get your reports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-10"
        >
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">
            Step 1 — Before You Start
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Get Your{" "}
            <span className="text-gradient">Real Credit Reports</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            You need all 3 bureau reports before you can dispute anything. Here are the only two sources worth using.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
          {reportResources.map((resource, index) => {
            const Icon = resource.icon;
            return (
              <motion.div
                key={resource.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className={`relative rounded-2xl border ${resource.border} bg-white p-6 shadow-sm hover:shadow-md transition-shadow`}
              >
                {resource.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Recommended
                  </div>
                )}
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-11 h-11 rounded-xl ${resource.iconBg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${resource.iconColor}`} />
                  </div>
                  <div>
                    <span className={`text-xs font-semibold border rounded-full px-2 py-0.5 ${resource.badgeColor}`}>
                      {resource.badge}
                    </span>
                    <h3 className="text-lg font-bold text-foreground mt-1">{resource.name}</h3>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mb-4">{resource.description}</p>
                <ul className="space-y-2 mb-5">
                  {resource.highlights.map((hl) => (
                    <li key={hl} className="flex items-center gap-2 text-sm text-foreground/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      {hl}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full gap-2"
                  variant={resource.featured ? "default" : "outline"}
                  onClick={() => window.open(resource.href, '_blank')}
                >
                  {resource.cta}
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </motion.div>
            );
          })}
        </div>

        {/* Credit building + pro tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-10"
        >
          <h3 className="text-2xl font-bold text-foreground mb-2">
            Also Recommended
          </h3>
          <p className="text-muted-foreground">
            Tools to help you build credit, report rent, and scale if you're helping others.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {buildResources.map((r, index) => {
            const Icon = r.icon;
            return (
              <motion.div
                key={r.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl border border-border p-5 hover:shadow-md transition-shadow flex flex-col gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg ${r.iconBg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${r.iconColor}`} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.subtitle}</p>
                  </div>
                </div>
                <p className="text-sm text-foreground/70 flex-1">{r.description}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-1 mt-1"
                  onClick={() => window.open(r.href, '_blank')}
                >
                  {r.cta}
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs text-muted-foreground mt-8 max-w-xl mx-auto"
        >
          Some links above are affiliate links. We may earn a commission at no extra cost to you.
          We only recommend services we believe in.
        </motion.p>
      </div>
    </section>
  );
};

export default AffiliateSection;
