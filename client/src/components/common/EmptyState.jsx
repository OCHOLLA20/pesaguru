import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * EmptyState component to display when there's no data to show
 * @param {Object} props - Component props
 * @param {string} props.title - Title text
 * @param {string} props.description - Description text
 * @param {React.ReactNode} props.icon - Icon to display
 * @param {React.ReactNode} props.action - Action button or link
 */
const EmptyState = ({ 
  title, 
  description, 
  icon, 
  action,
  className = ''
}) => {
  const { t } = useTranslation();
  
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      {icon && (
        <div className="mb-4 text-gray-400">
          {icon}
        </div>
      )}
      
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
        {title || t('common.emptyState.defaultTitle')}
      </h3>
      
      {description && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
      
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
