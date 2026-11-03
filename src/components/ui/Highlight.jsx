import React from 'react';

/**
 * Brand headline accent: teal→blue gradient text with a hand-drawn orange underline.
 * Usage: <Highlight>fully accelerated</Highlight>
 */
export default function Highlight({ children, className = '', underline = true, tone = 'default' }) {
  return (
    <span className={`relative inline-block whitespace-nowrap ${className}`}>
      <span className={`relative z-10 ${tone === 'light' ? 'text-gradient-light' : 'text-gradient'}`}>{children}</span>
      {underline && (
        <svg
          aria-hidden="true"
          viewBox="0 0 300 18"
          preserveAspectRatio="none"
          className="absolute left-0 -bottom-[0.12em] w-full h-[0.32em] text-brand-orange"
        >
          <path
            d="M3 13 C 60 4, 140 3, 297 9"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            className="hl-draw"
          />
        </svg>
      )}
    </span>
  );
}
