import React from 'react';

interface SkateIconProps {
  className?: string;
  size?: number;
  strokeWidth?: number;
}

export const SkateIcon: React.FC<SkateIconProps> = ({ 
  className = '', 
  size = 24, 
  strokeWidth = 2 
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Figure skating boot - tall boot shape */}
      <path d="M8 3c-1 0-2 1-2 2v9c0 1 .5 2 2 2h7c1.5 0 2.5-1 2.5-2v-3c0-1-.5-2-1.5-2h-2" />
      {/* Boot top cuff */}
      <path d="M6 5h5" />
      {/* Laces */}
      <line x1="8" y1="7" x2="10" y2="7" />
      <line x1="8" y1="9" x2="10" y2="9" />
      <line x1="8" y1="11" x2="10" y2="11" />
      {/* Blade with toe pick */}
      <path d="M4 20h16" />
      <path d="M6 16v2c0 1 .5 2 2 2" />
      <path d="M17 16v2c0 1-.5 2-1 2" />
      {/* Toe pick */}
      <path d="M4 20l1-2" />
    </svg>
  );
};
