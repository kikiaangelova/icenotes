import React from 'react';

interface SkateBootIconProps {
  className?: string;
}

/**
 * Custom figure skating boot icon — eye-catching, Gen Z friendly.
 * Stylized boot with a curved blade and a tiny star spark.
 */
export const SkateBootIcon: React.FC<SkateBootIconProps> = ({ className }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Boot body */}
    <path
      d="M9 5.5c0-.55.45-1 1-1h4.2c.5 0 .9.36.99.85l1.5 8.4c.07.4.4.7.8.75l4.6.6c1.9.25 3.31 1.88 3.31 3.8v2.6c0 .55-.45 1-1 1H9c-.55 0-1-.45-1-1V5.5Z"
      fill="currentColor"
      fillOpacity="0.95"
    />
    {/* Laces */}
    <path
      d="M11 8h3M11 10.5h3.3M11 13h3.6M11 15.5h3.9"
      stroke="hsl(var(--background))"
      strokeWidth="0.9"
      strokeLinecap="round"
      opacity="0.85"
    />
    {/* Blade */}
    <path
      d="M6 24h21c.55 0 1 .45 1 1 0 1.93-1.57 3.5-3.5 3.5h-15C7.57 28.5 6 26.93 6 25c0-.55.45-1 1-1Z"
      fill="currentColor"
    />
    {/* Blade highlight */}
    <path
      d="M7.5 25.4h19"
      stroke="hsl(var(--background))"
      strokeWidth="0.6"
      strokeLinecap="round"
      opacity="0.6"
    />
    {/* Spark */}
    <path
      d="M25 6.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6.6-1.4Z"
      fill="currentColor"
      opacity="0.9"
    />
  </svg>
);
