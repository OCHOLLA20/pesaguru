import React from 'react';

/**
 * Card Component
 * 
 * A versatile card component with customizable styling options
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.shadow='md'] - Shadow size (none, sm, md, lg, xl)
 * @param {string} [props.radius='md'] - Border radius (none, sm, md, lg, xl, full)
 * @param {string} [props.padding='md'] - Padding size (none, sm, md, lg, xl)
 * @param {boolean} [props.hover=false] - Whether to add hover effect
 * @param {boolean} [props.clickable=false] - Whether card is clickable
 * @param {Function} [props.onClick] - Click handler function
 * @param {boolean} [props.border=false] - Whether to add border
 */
const Card = ({
  children,
  className = '',
  shadow = 'md',
  radius = 'md',
  padding = 'md',
  hover = false,
  clickable = false,
  onClick,
  border = false,
  ...rest
}) => {
  // Shadow classes
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };

  // Border radius classes
  const radiusClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full'
  };

  // Padding classes
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  };

  // Hover effect classes
  const hoverClasses = hover ? 'transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg' : '';

  // Clickable classes
  const clickableClasses = clickable ? 'cursor-pointer' : '';

  // Border classes
  const borderClasses = border ? 'border border-gray-200' : '';

  // Combine all classes
  const cardClasses = `
    bg-white
    ${shadowClasses[shadow] || shadowClasses.md}
    ${radiusClasses[radius] || radiusClasses.md}
    ${paddingClasses[padding] || paddingClasses.md}
    ${hoverClasses}
    ${clickableClasses}
    ${borderClasses}
    ${className}
  `.trim();

  return (
    <div className={cardClasses} onClick={clickable ? onClick : undefined} {...rest}>
      {children}
    </div>
  );
};

/**
 * Card.Header Component
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Header content
 * @param {string} [props.className] - Additional CSS classes
 */
Card.Header = ({ children, className = '', ...rest }) => {
  const headerClasses = `mb-4 pb-2 border-b border-gray-200 ${className}`.trim();
  
  return (
    <div className={headerClasses} {...rest}>
      {children}
    </div>
  );
};

/**
 * Card.Title Component
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Title content
 * @param {string} [props.className] - Additional CSS classes
 */
Card.Title = ({ children, className = '', ...rest }) => {
  const titleClasses = `text-xl font-semibold text-gray-800 ${className}`.trim();
  
  return (
    <h3 className={titleClasses} {...rest}>
      {children}
    </h3>
  );
};

/**
 * Card.Content Component
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content
 * @param {string} [props.className] - Additional CSS classes
 */
Card.Content = ({ children, className = '', ...rest }) => {
  return (
    <div className={className} {...rest}>
      {children}
    </div>
  );
};

/**
 * Card.Footer Component
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Footer content
 * @param {string} [props.className] - Additional CSS classes
 */
Card.Footer = ({ children, className = '', ...rest }) => {
  const footerClasses = `mt-4 pt-2 border-t border-gray-200 ${className}`.trim();
  
  return (
    <div className={footerClasses} {...rest}>
      {children}
    </div>
  );
};

export default Card;