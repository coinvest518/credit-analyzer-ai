import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import AffiliateSection from "./AffiliateSection";
import FeaturesSection from "./FeaturesSection";
import TestimonialsSection from "./TestimonialsSection";
import BookingSection from "./BookingSection";
import ComingSoonSection from "./ComingSoonSection";
import CTASection from "./CTASection";
import Footer from "./Footer";
import { BlogList } from "../BlogList";
import { blogPosts } from "../../blogData";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const queryClient = new QueryClient();

const Landing = () => {
  const navigate = useNavigate();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="landing-page min-h-screen bg-background">
          <Navbar />
          <main>
            {/* 1. Hero */}
            <HeroSection />

            {/* 2. Step 1 — Get your reports + affiliate resources */}
            <AffiliateSection />

            {/* 3. How It Works — 3-step process */}
            <FeaturesSection />

            {/* 4. Testimonials */}
            <TestimonialsSection />

            {/* 5. Blog preview */}
            <section className="py-20 bg-slate-50">
              <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-10">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Latest from the Blog</h2>
                    <p className="text-muted-foreground text-sm">Credit tips, dispute guides, and financial education.</p>
                  </div>
                  <button
                    onClick={() => navigate('/blog')}
                    className="text-primary font-semibold hover:underline text-sm"
                  >
                    View all →
                  </button>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  {blogPosts.slice(0, 3).map((post) => (
                    <div
                      key={post.id}
                      onClick={() => navigate('/blog')}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-border"
                    >
                      <div className="h-40 bg-slate-200 relative">
                        <img
                          src={post.image || `https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800`}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-0.5 rounded-full text-xs font-bold">
                          {post.category}
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-base mb-1 line-clamp-2">{post.title}</h3>
                        <p className="text-muted-foreground text-xs line-clamp-2 mb-3">{post.excerpt}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{post.author}</span>
                          <span>·</span>
                          <span>{post.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 6. Book a consultation */}
            <BookingSection />

            {/* 7. Coming Soon — AI automation */}
            <ComingSoonSection />

            {/* 8. Final CTA */}
            <CTASection />
          </main>
          <Footer />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default Landing;
