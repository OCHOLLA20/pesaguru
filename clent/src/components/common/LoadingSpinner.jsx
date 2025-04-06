import React from 'react';
import PropTypes from 'prop-types';

/**
 * LoadingSpinner - A reusable component to indicate loading states
 * 
 * @param {string} label - Optional text to display below the spinner
 * @param {string} size - Size of the spinner: 'small', 'medium', or 'large'
 * @param {boolean} fullScreen - Whether the spinner should be centered in the full screen
 * @param {string} className - Additional CSS classes to apply
 */
const LoadingSpinner = ({ label, size = 'medium', fullScreen = false, className = '' }) => {
  // Size mappings for different spinner sizes
  const sizeClasses = {
    small: 'w-4 h-4 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4'
  };

  // Base spinner classes
  const spinnerClasses = `
    inline-block rounded-full border-transparent
    border-t-blue-600 border-r-blue-600
    animate-spin ${sizeClasses[size]}
  `;

  // Container classes based on fullScreen prop
  const containerClasses = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-white/80 z-50'
    : 'flex flex-col items-center justify-center';

  return (
    <div className={`${containerClasses} ${className}`} role="status" aria-live="polite">
      <div className={spinnerClasses}></div>
      
      {label && (
        <p className="mt-2 text-sm text-gray-600 font-medium">
          {label}
        </p>
      )}
      
      <span className="sr-only">Loading...</span>
    </div>
  );
};

LoadingSpinner.propTypes = {
  label: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  fullScreen: PropTypes.bool,
  className: PropTypes.string
};

export default LoadingSpinner;