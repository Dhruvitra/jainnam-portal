import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  count = 1
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full';
      case 'card':
        return 'rounded-2xl h-44';
      case 'rectangular':
        return 'rounded-xl h-24';
      case 'text':
      default:
        return 'rounded-md h-4';
    }
  };

  const skeletons = Array.from({ length: count });

  return (
    <>
      {skeletons.map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-[#EAE6DE]/60 ${getVariantStyles()} ${className}`}
        />
      ))}
    </>
  );
};
