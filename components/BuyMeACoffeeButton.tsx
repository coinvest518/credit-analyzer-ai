import React from 'react';

interface BuyMeACoffeeButtonProps {
  className?: string;
}

const BuyMeACoffeeButton: React.FC<BuyMeACoffeeButtonProps> = ({ className }) => {
  const username = 'coinvest';
  const url = `https://www.buymeacoffee.com/${username}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center bg-[#FF5F5F] text-white px-4 py-2 rounded-lg font-semibold transition-colors hover:bg-opacity-90 ${className}`}
    >
      <span className="mr-2">☕</span>
      Buy me a coffee
    </a>
  );
};

export default BuyMeACoffeeButton;
