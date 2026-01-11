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
      {/* Ice skate boot */}
      <path d="M5 16V8c0-1 .5-2 2-2h4c1.5 0 3 1 3 3v7" />
      <path d="M5 12h9" />
      <path d="M14 14c1 0 2.5.5 3 2" />
      {/* Blade */}
      <line x1="3" y1="19" x2="21" y2="19" />
      <path d="M5 16c0 1.5 1 3 3 3h9c2 0 3-1.5 3-3" />
    </svg>
  );
};
