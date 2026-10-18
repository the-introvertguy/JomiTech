import React from 'react';

interface CadastralLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const CadastralLogo: React.FC<CadastralLogoProps> = ({
  className = '',
  size = 32,
  showText = false,
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 font-bold tracking-tight select-none ${className}`}>
      {/* Original Cadastral Boundary + Plot Geometry Mark */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform hover:scale-105"
        aria-hidden="true"
      >
        {/* Outer Cadastral Mouza Polygon */}
        <path
          d="M6 14L22 4L42 12L40 38L20 44L6 34V14Z"
          fill="#1b4332"
          stroke="#40916c"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Internal Cadastral Boundary Lines (দাগ সীমানা) */}
        <path
          d="M22 4V24M22 24L40 38M22 24L6 34M22 24L42 12"
          stroke="#52b788"
          strokeWidth="1.5"
          strokeDasharray="2 2"
        />
        {/* Verification Core / Anchor Point */}
        <circle cx="22" cy="24" r="5" fill="#52b788" />
        <circle cx="22" cy="24" r="2.5" fill="#ffffff" />
        {/* Sub-plot Partition Pin */}
        <path
          d="M22 16L27 21L33 13"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className="text-xl font-extrabold tracking-tight text-pine-900 dark:text-pine-100">
            জমি<span className="text-pine-600 dark:text-pine-400">টেক</span>
          </span>
          <span className="text-[10px] uppercase font-semibold tracking-wider text-pine-700/70 dark:text-pine-300/70">
            JomiTech Civic
          </span>
        </div>
      )}
    </div>
  );
};
