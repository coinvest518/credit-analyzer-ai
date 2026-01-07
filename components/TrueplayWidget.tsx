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
    if ((window as any).fncWidget && typeof (window as any).fncWidget.init === 'function') {
      (window as any).fncWidget.init();
    } else {
      console.warn('Enable3 widget not loaded yet');
    }
  };

  return (
    <>
      {/* iframe required by Enable3 widget */}
      <iframe 
        id="fnc-widget" 
        frameBorder={0} 
        allow="clipboard-write;web-share"
        title="Enable3 Widget"
        style={{ display: 'none' }}
      />

      {/* Floating button to open widget */}
      <button
        onClick={openWidget}
        aria-label="Open Play to Earn widget"
        className="fixed right-6 bottom-6 z-50 bg-gradient-to-r from-pink-500 to-yellow-400 text-white px-5 py-3 rounded-full shadow-xl hover:scale-105 transform transition"
      >
        🎮 Play & Earn
      </button>
    </>
  );
};

export default TrueplayWidget;
