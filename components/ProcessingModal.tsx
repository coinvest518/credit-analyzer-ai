import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Brain, FileSearch, Gavel, Sparkles, Database, Lock, AlertCircle } from 'lucide-react';

interface ProcessingModalProps {
  isOpen: boolean;
  currentTaskIndex: number;
  tasks: { name: string }[];
}

const EDUCATIONAL_SLIDES = [
  {
    icon: <ShieldCheck className="w-8 h-8 text-blue-400" />,
    title: "15 U.S.C. §1681g(a) - Right to Info",
    content: "Under the FCRA, you have the legal right to every piece of data in your file. We recommend pulling all three reports (Experian, Equifax, TransUnion). Don't rely on marketing apps.",
    color: "bg-blue-500/10 border-blue-500/20"
  },
  {
    icon: <FileSearch className="w-8 h-8 text-green-400" />,
    title: "15 U.S.C. §1681e(b) - Max Accuracy",
    content: "Bureaus must ensure 'maximum possible accuracy.' If an account balance or date doesn't match across all three bureaus, it is legally inaccurate and must be corrected or deleted.",
    color: "bg-green-500/10 border-green-500/20"
  },
  {
    icon: <Gavel className="w-8 h-8 text-amber-400" />,
    title: "15 U.S.C. §1681i(a)(1) - Dispute Right",
    content: "You have the right to dispute any item. We prepare documents for Certified Mail—this creates a court-ready paper trail that online disputes simply cannot provide.",
    color: "bg-amber-500/10 border-amber-500/20"
  },
  {
    icon: <Brain className="w-8 h-8 text-purple-400" />,
    title: "12 U.S.C. §5531 - CFPB Leverage",
    content: "Filing a CFPB complaint forces an executive-level review, bypassing automated systems. This triggers faster responses and significantly increases your settlement leverage.",
    color: "bg-purple-500/10 border-purple-500/20"
  },
  {
    icon: <AlertCircle className="w-8 h-8 text-red-400" />,
    title: "15 U.S.C. §1681n - Willful Violation",
    content: "If they 'verify' an error without evidence or ignore your dispute, they may be liable for $1,000+ per violation plus legal fees. We are documenting every step for your records.",
    color: "bg-red-500/10 border-red-500/20"
  },
  {
    icon: <Sparkles className="w-8 h-8 text-yellow-400" />,
    title: "Pro Tip: Paper Trails",
    content: "Online disputes are marketing traps that weaken your evidence. Always send disputes via Certified Mail with Return Receipt to ensure you have court-ready proof of delivery.",
    color: "bg-yellow-500/10 border-yellow-500/20"
  }
];

export const ProcessingModal: React.FC<ProcessingModalProps> = ({ isOpen, currentTaskIndex, tasks }) => {
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setSlideIndex((prev) => (prev + 1) % EDUCATIONAL_SLIDES.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl"
      >
        {/* Top Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 via-primary to-purple-500"
            animate={{ 
              width: `${((currentTaskIndex + 1) / (tasks.length || 1)) * 100}%` 
            }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-8">
            
            {/* Left Side: Tasks Status */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center space-x-2 text-gray-400 mb-6">
                <Database className="w-4 h-4" />
                <span className="text-xs font-mono uppercase tracking-widest">System Engine Running</span>
              </div>

              <div className="space-y-3">
                {tasks.map((task, idx) => (
                  <div key={idx} className="flex items-center space-x-3 text-sm">
                    <div className={`w-2 h-2 rounded-full ${
                      idx < currentTaskIndex ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' :
                      idx === currentTaskIndex ? 'bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--primary),0.6)]' :
                      'bg-gray-700'
                    }`} />
                    <span className={
                      idx < currentTaskIndex ? 'text-gray-400 line-through decoration-gray-600' :
                      idx === currentTaskIndex ? 'text-white font-medium' :
                      'text-gray-600'
                    }>
                      {task.name}
                    </span>
                  </div>
                ))}
                {currentTaskIndex === tasks.length - 1 && (
                  <div className="flex items-center space-x-3 text-xs text-primary animate-pulse pt-2">
                    <Sparkles className="w-3 h-3" />
                    <span>AI is formulating final results...</span>
                  </div>
                )}
              </div>

              <div className="pt-6 mt-6 border-t border-gray-800/50 flex items-center space-x-3">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                    <Lock className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 leading-tight uppercase font-medium">
                  SSL Encrypted<br />AES-256 Analysis
                </p>
              </div>
            </div>

            {/* Right Side: Educational Slides */}
            <div className="flex-1 min-h-[300px] flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-gray-950/50 border border-gray-800 relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slideIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="inline-flex p-3 rounded-xl mb-2 bg-primary/5 border border-primary/10">
                    {EDUCATIONAL_SLIDES[slideIndex].icon}
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {EDUCATIONAL_SLIDES[slideIndex].title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {EDUCATIONAL_SLIDES[slideIndex].content}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Slide Indicators */}
              <div className="absolute bottom-6 flex space-x-1">
                {EDUCATIONAL_SLIDES.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1 rounded-full transition-all duration-300 ${
                      i === slideIndex ? 'w-4 bg-primary' : 'w-1 bg-gray-800'
                    }`} 
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer info bubble */}
        <div className="bg-gray-950/80 px-8 py-3 flex items-center justify-between border-t border-gray-800">
           <div className="flex items-center space-x-2">
              <Sparkles className="w-3 h-3 text-yellow-500" />
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Total Accuracy Target: 100%</span>
           </div>
           <div className="flex items-center space-x-2">
              <span className="text-[10px] text-gray-400">Step {currentTaskIndex + 1} of {tasks.length}</span>
           </div>
        </div>
      </motion.div>
    </div>
  );
};
