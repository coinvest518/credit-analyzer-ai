import React, { useEffect, useState } from 'react';

const TrueplayWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load Enable3 widget script
    const script = document.createElement('script');
    script.src = 'https://cdn.enable3.io/global/widget.js?id=10494&autorun=false';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const openWidget = () => {
    const widget = (window as any).fncWidget;
    if (widget && typeof widget.init === 'function') {
      setIsOpen(true);
      // Small delay to ensure modal is visible before opening widget
      setTimeout(() => widget.init(), 100);
    } else {
      console.warn('Enable3 widget not loaded yet');
    }
  };

  const closeWidget = () => {
    setIsOpen(false);
    // Hide the iframe
    const iframe = document.getElementById('fnc-widget') as HTMLIFrameElement;
    if (iframe) {
      iframe.style.display = 'none';
    }
  };

  return (
    <>
      {/* Modal overlay and container */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeWidget}
        >
          <div 
            className="relative w-full max-w-5xl h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeWidget}
              className="absolute top-4 right-4 z-[10000] bg-red-500 hover:bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-colors"
              aria-label="Close widget"
            >
              ✕
            </button>
            
            {/* Widget iframe container */}
            <div className="w-full h-full" id="fnc-widget-container">
              <iframe 
                id="fnc-widget" 
                frameBorder={0} 
                allow="clipboard-write;web-share"
                title="Enable3 Widget"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Floating CTA button */}
      <button
        onClick={openWidget}
        aria-label="Open Play to Earn widget"
        className="fixed right-6 bottom-6 z-50 bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-400 text-white font-semibold px-6 py-3.5 rounded-full shadow-2xl hover:shadow-pink-500/50 hover:scale-110 transform transition-all duration-300 animate-pulse"
      >
        <span className="flex items-center gap-2">
          🎮 Play & Earn Rewards
        </span>
      </button>
    </>
  );
};

export default TrueplayWidget;
