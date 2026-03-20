
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-4" role="status" aria-live="polite">
      <div className="relative w-24 h-24 flex items-center justify-center">
        {/* Glow Background */}
        <div className="absolute inset-0 bg-fuchsia-600/20 rounded-full blur-2xl animate-pulse"></div>
        
        {/* Outer Ring - Zodiac/Runes style */}
        <div className="absolute inset-0 animate-[spin_12s_linear_infinite]">
            <svg viewBox="0 0 100 100" className="w-full h-full text-fuchsia-500/50">
                <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <path d="M50 2 L50 10 M98 50 L90 50 M50 98 L50 90 M2 50 L10 50" stroke="currentColor" strokeWidth="2" />
            </svg>
        </div>

        {/* Middle Ring - Counter Rotating */}
        <div className="absolute inset-2 animate-[spin_8s_linear_infinite_reverse]">
            <svg viewBox="0 0 100 100" className="w-full h-full text-indigo-400/60">
                <rect x="18" y="18" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1" transform="rotate(45 50 50)" />
                <rect x="18" y="18" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1" />
            </svg>
        </div>

        {/* Inner Magic Circle - Hexagram */}
        <div className="absolute inset-6 animate-[spin_4s_linear_infinite]">
            <svg viewBox="0 0 100 100" className="w-full h-full text-cyan-300">
                <polygon points="50,5 90,75 10,75" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <polygon points="50,95 90,25 10,25" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="50" cy="50" r="5" fill="white" className="animate-pulse" />
            </svg>
        </div>
        
        {/* Core glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-fuchsia-500/10 to-cyan-500/10 rounded-full animate-pulse"></div>
      </div>
      
      <p className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-200 via-pink-200 to-cyan-200 text-sm tracking-[0.2em] animate-pulse font-light">
        星々が運命を紡いでいます...
      </p>
    </div>
  );
};

export default LoadingSpinner;
