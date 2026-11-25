import React from 'react';

interface ButtonSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export const ButtonSpinner: React.FC<ButtonSpinnerProps> = ({
  size = 'md',
  className = '',
  label
}) => {
  const sizeClasses = {
    sm: 'w-3.5 h-3.5 border-2',
    md: 'w-4 h-4 border-2',
    lg: 'w-5 h-5 border-[2.5px]'
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span
        className={`${sizeClasses[size]} border-current border-t-transparent rounded-full animate-spin inline-block`}
        role="status"
        aria-label="loading"
      />
      {label && <span>{label}</span>}
    </div>
  );
};
