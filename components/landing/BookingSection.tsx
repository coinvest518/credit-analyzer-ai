import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CalendarDays, MessageSquare, ArrowRight, CheckCircle } from "lucide-react";

const BookingSection = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/send-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const { error: msg } = await res.json().catch(() => ({ error: 'Failed to send' }));
        throw new Error(msg || 'Failed to send');
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="booking" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-primary bg-primary/20 px-3 py-1 rounded-full mb-4">
            Work With Me Directly
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Book a 1-on-1{" "}
            <span className="text-gradient">Credit Consultation</span>
          </h2>
          <p className="text-slate-300 text-lg">
            Not sure where to start? Book a live session and I'll walk you through your credit report, explain your options, and help you build a dispute strategy.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">

          {/* Left — booking CTA */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col gap-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <CalendarDays className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Live Consultation</h3>
                <p className="text-slate-400 text-sm">Via video call · 30-60 min</p>
              </div>
            </div>

            <ul className="space-y-3">
              {[
                "Full credit report review together",
                "Identify your best dispute opportunities",
                "Custom dispute strategy for your situation",
                "Q&A — ask anything about the process",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <Button
              size="lg"
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground w-full mt-2"
              onClick={() => window.open('https://cal.com/bookme-daniel', '_blank')}
            >
              Book a Session on Cal.com
              <ArrowRight className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-3 pt-2 border-t border-white/10">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
                D
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Daniel</p>
                <p className="text-xs text-slate-400">Credit Strategist · AI Tools Builder</p>
              </div>
            </div>
          </motion.div>

          {/* Right — contact form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-white">Send a Message</h3>
            </div>

            {submitted ? (
              <div className="flex flex-col items-center justify-center h-48 gap-4">
                <CheckCircle className="w-12 h-12 text-primary" />
                <p className="text-white font-semibold text-lg">Message sent!</p>
                <p className="text-slate-400 text-sm text-center">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Phone (optional)</label>
                    <input
                      type="tel"
                      placeholder="(555) 000-0000"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="you@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">What do you need help with?</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Brief description of your credit situation..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary resize-none"
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-400">{error}</p>
                )}
                <Button type="submit" disabled={submitting} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2 disabled:opacity-60">
                  {submitting ? 'Sending…' : 'Send Message'}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BookingSection;
