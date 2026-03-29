import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Marcus T.",
    location: "Atlanta, GA",
    initials: "MT",
    color: "bg-blue-500",
    rating: 5,
    text: "I had 4 negative accounts removed in about 60 days. The AI found FCRA violations I never would have caught on my own. My score went from 541 to 619.",
    tag: "Score +78 pts",
  },
  {
    name: "Sarah K.",
    location: "Houston, TX",
    initials: "SK",
    color: "bg-purple-500",
    rating: 5,
    text: "The dispute letters were professional and legally specific. Way better than the generic templates I found online. Equifax removed two collections within 30 days.",
    tag: "2 Collections Removed",
  },
  {
    name: "James R.",
    location: "Chicago, IL",
    initials: "JR",
    color: "bg-green-600",
    rating: 5,
    text: "I finally understand my credit report. The step-by-step guidance was exactly what I needed. Sent letters to all three bureaus and already got one positive response.",
    tag: "3 Bureaus Disputed",
  },
  {
    name: "Danielle M.",
    location: "Phoenix, AZ",
    initials: "DM",
    color: "bg-rose-500",
    rating: 5,
    text: "Used IDIQ for the $1 trial like they recommended, uploaded the PDF, and the AI found 6 items to dispute. Super simple. Can't believe this isn't more well known.",
    tag: "6 Items Found",
  },
  {
    name: "Kevin P.",
    location: "Miami, FL",
    initials: "KP",
    color: "bg-amber-500",
    rating: 5,
    text: "Tried a credit repair company before that charged $100/month and got nothing done. This tool cost me $9.99 and I generated better letters in 10 minutes.",
    tag: "Saved $1,000+",
  },
  {
    name: "Tanya W.",
    location: "Detroit, MI",
    initials: "TW",
    color: "bg-teal-600",
    rating: 5,
    text: "The statute of limitations check alone was worth it. Had two debts that were past the legal limit and the AI caught them. Disputing those got them removed immediately.",
    tag: "SOL Violations Found",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">
            Real Results
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            People Are Getting{" "}
            <span className="text-gradient">Real Wins</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            See what users are saying after going through the dispute process with our AI tool.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4"
            >
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <div className="relative">
                <Quote className="w-6 h-6 text-primary/20 absolute -top-1 -left-1" />
                <p className="text-sm text-foreground/80 leading-relaxed pl-4">
                  "{t.text}"
                </p>
              </div>

              {/* Tag */}
              <span className="self-start text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">
                {t.tag}
              </span>

              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t border-border">
                <div className={`w-9 h-9 rounded-full ${t.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs text-muted-foreground mt-8"
        >
          Results vary. Credit repair outcomes depend on individual credit history and bureau responses.
        </motion.p>
      </div>
    </section>
  );
};

export default TestimonialsSection;
