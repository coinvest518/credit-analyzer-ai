import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, LogOut, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser, signOutUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const initials = currentUser
    ? (currentUser.displayName
        ? currentUser.displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
        : (currentUser.email ?? 'U')[0].toUpperCase())
    : '';

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border"
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">ReportDisputer</span>
        </div>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <button onClick={() => navigate('/blog')} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Blog
          </button>
          <button onClick={() => navigate('/pricing')} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </button>
          <button onClick={() => navigate('/app')} className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            App
          </button>
        </div>

        {/* Desktop auth area */}
        <div className="hidden md:flex items-center gap-3">
          {currentUser ? (
            <>
              {/* Avatar */}
              <button
                onClick={() => navigate('/app')}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                title="Go to app"
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/30"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                    {initials}
                  </div>
                )}
                <span className="text-sm font-medium text-foreground max-w-[120px] truncate">
                  {currentUser.displayName || currentUser.email}
                </span>
              </button>

              <Button
                variant="ghost"
                size="sm"
                onClick={signOutUser}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex" onClick={() => navigate('/app')}>
                Log In
              </Button>
              <Button size="sm" onClick={() => navigate('/app')} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Get Started
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-lg px-4 py-4 flex flex-col gap-3">
          <button onClick={() => { navigate('/'); setMenuOpen(false); }} className="text-left text-sm font-medium text-muted-foreground hover:text-foreground py-2">
            Home
          </button>
          <button onClick={() => { navigate('/blog'); setMenuOpen(false); }} className="text-left text-sm font-medium text-muted-foreground hover:text-foreground py-2">
            Blog
          </button>
          <button onClick={() => { navigate('/pricing'); setMenuOpen(false); }} className="text-left text-sm font-medium text-muted-foreground hover:text-foreground py-2">
            Pricing
          </button>
          <button onClick={() => { navigate('/app'); setMenuOpen(false); }} className="text-left text-sm font-medium text-primary hover:text-primary/80 py-2">
            App
          </button>

          <div className="border-t border-border pt-3">
            {currentUser ? (
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => { navigate('/app'); setMenuOpen(false); }}
                  className="flex items-center gap-3"
                >
                  {currentUser.photoURL ? (
                    <img src={currentUser.photoURL} alt="Profile" className="w-9 h-9 rounded-full ring-2 ring-primary/30" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                      {initials}
                    </div>
                  )}
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-medium text-foreground truncate max-w-[200px]">
                      {currentUser.displayName || 'Account'}
                    </span>
                    <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {currentUser.email}
                    </span>
                  </div>
                </button>
                <Button variant="outline" size="sm" onClick={() => { signOutUser(); setMenuOpen(false); }} className="w-full">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm" className="w-full" onClick={() => { navigate('/app'); setMenuOpen(false); }}>
                  Log In
                </Button>
                <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => { navigate('/app'); setMenuOpen(false); }}>
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.nav>
  );
};

export default Navbar;
