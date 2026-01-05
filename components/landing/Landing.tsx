import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import DashboardPreview from "./DashboardPreview";
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
            <HeroSection />
            <FeaturesSection />
            <DashboardPreview />
            
            {/* Blog Preview Section */}
            <section className="py-24 bg-slate-50">
              <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-12">
                  <div>
                    <h2 className="text-3xl font-bold mb-4">Latest from our Blog</h2>
                    <p className="text-muted-foreground">Expert advice on credit repair and financial health.</p>
                  </div>
                  <button 
                    onClick={() => navigate('/blog')}
                    className="text-primary font-semibold hover:underline"
                  >
                    View all posts →
                  </button>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                  {blogPosts.slice(0, 3).map((post) => (
                    <div 
                      key={post.id}
                      onClick={() => navigate('/blog')}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-border"
                    >
                      <div className="h-48 bg-slate-200 relative">
                        <img 
                          src={post.image || `https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800`} 
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold">
                          {post.category}
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="font-bold text-xl mb-2 line-clamp-2">{post.title}</h3>
                        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">{post.excerpt}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{post.author}</span>
                          <span>•</span>
                          <span>{post.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <CTASection />
          </main>
          <Footer />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default Landing;
