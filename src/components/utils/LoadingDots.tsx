import React from 'react';

/**
 * LoadingDots component that displays an animated set of dots to indicate loading state.
 * 
 * Styling:
 * - Each dot is animated with a bounce effect and a slight delay to create a sequential animation.
 */
const LoadingDots: React.FC = () => {
  return (
    <div className="ml-2 flex space-x-1">
      {[0, 1, 2].map((dot) => (
        <div
          key={dot}
          className="w-2 h-2 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: `${dot * 0.2}s` }}
        ></div>
      ))}
    </div>
  );
};

export default LoadingDots;