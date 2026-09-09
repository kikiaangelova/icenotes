import React from 'react';

interface IceNotesMarkProps {
  className?: string;
}

/**
 * IceNotes brand mark — an abstract blade trace on ice.
 * Two crossing edge arcs inside a soft square. Deliberately geometric
 * and grown-up: no cartoon boot, no illustration.
 */
export const IceNotesMark: React.FC<IceNotesMarkProps> = ({ className }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M6 24c6.5 0 9-3.2 9-8s2.5-8 9-8"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
    <path
      d="M6 8c4.2 0 6.2 2.2 7 5"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      opacity="0.45"
    />
    <circle cx="24" cy="24" r="2.2" fill="currentColor" />
  </svg>
);
