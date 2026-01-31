import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  variant = 'rectangular' 
}) => {
  const baseClasses = 'bg-gray-200 animate-pulse';
  
  const variantClasses = {
    text: 'h-4 rounded',
    rectangular: 'rounded-md',
    circular: 'rounded-full'
  };

  return (
    <motion.div
      initial={{ opacity: 0.6 }}
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    />
  );
};

export const PropertyCardSkeleton: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-lg shadow-md p-6 space-y-4"
  >
    <Skeleton className="h-48 w-full" />
    <div className="space-y-2">
      <Skeleton className="h-6 w-3/4" variant="text" />
      <Skeleton className="h-4 w-1/2" variant="text" />
    </div>
    <div className="flex justify-between items-center">
      <Skeleton className="h-8 w-24" variant="text" />
      <Skeleton className="h-6 w-16" variant="text" />
    </div>
    <div className="grid grid-cols-3 gap-2">
      <Skeleton className="h-4 w-full" variant="text" />
      <Skeleton className="h-4 w-full" variant="text" />
      <Skeleton className="h-4 w-full" variant="text" />
    </div>
  </motion.div>
);

export const PropertyDetailSkeleton: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <Skeleton className="h-8 w-64" variant="text" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-64 w-full" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-48" variant="text" />
            <Skeleton className="h-4 w-full" variant="text" />
            <Skeleton className="h-4 w-3/4" variant="text" />
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <Skeleton className="h-6 w-32" variant="text" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-full" variant="text" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    </motion.div>
  </div>
);