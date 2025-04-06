import React, { useState } from 'react';

/**
 * ErrorAlert Component
 * 
 * A customizable alert component for displaying error messages
 * 
 * @param {Object} props - Component props
 * @param {string} props.message - The main error message to display
 * @param {string} [props.details] - Optional additional error details
 * @param {string} [props.variant='error'] - Alert variant (error, warning)
 * @param {boolean} [props.dismissible=true] - Whether the alert can be dismissed
 * @param {Function} [props.onDismiss] - Function to call when alert is dismissed
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ReactNode} [props.icon] - Custom icon to display
 * @param {boolean} [props.showIcon=true] - Whether to show the default icon
 */
const ErrorAlert = ({
  message,
  details,
  variant = 'error',
  dismissible = true,
  onDismiss,
  className = '',
  icon,
  showIcon = true,
  ...rest
}) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return null;
  }

  // Variant-specific classes
  const variantClasses = {
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  };

  // Default icons based on variant
  const defaultIcons = {
    error: (
      <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    )
  };

  // Close button handler
  const handleDismiss = () => {
    setDismissed(true);
    if (onDismiss) {
      onDismiss();
    }
  };

  return (
    <div 
      className={`border rounded-md p-4 flex ${variantClasses[variant] || variantClasses.error} ${className}`}
      role="alert"
      {...rest}
    >
      {showIcon && (
        <div className="flex-shrink-0 mr-3">
          {icon || defaultIcons[variant]}
        </div>
      )}
      
      <div className="flex-1">
        <h3 className="text-sm font-medium">{message}</h3>
        {details && (
          <div className="mt-2 text-sm opacity-80">
            {details}
          </div>
        )}
      </div>
      
      {dismissible && (
        <div className="ml-auto pl-3">
          <button
            type="button"
            className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              variant === 'error' 
                ? 'text-red-500 hover:bg-red-100 focus:ring-red-600' 
                : 'text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600'
            }`}
            onClick={handleDismiss}
            aria-label="Dismiss"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default ErrorAlert;