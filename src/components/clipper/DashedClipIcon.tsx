import React from 'react';

interface DashedClipIconProps {
  className?: string;
}

/**
 * Dashed crop/clip icon matching the exact icon in the user's screenshot
 * (a rounded rectangle with a dashed outline representing a crop selection)
 */
export const DashedClipIcon: React.FC<DashedClipIconProps> = ({ className = 'w-4 h-4' }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Dashed rounded square matching newspaper crop viewfinder */}
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="3.5"
        strokeDasharray="2.8 2.2"
      />
    </svg>
  );
};
