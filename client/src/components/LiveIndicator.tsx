import React from 'react';
import { motion } from 'framer-motion';

interface LiveIndicatorProps {
  count?: number;
  label?: string;
  className?: string;
  variant?: 'viewers' | 'activity' | 'booking';
}

export const LiveIndicator: React.FC<LiveIndicatorProps> = ({
  count = 0,
  label = 'Live',
  className = '',
  variant = 'viewers'
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'viewers':
        return {
          bg: count > 5 ? 'bg-red-100' : count > 2 ? 'bg-yellow-100' : 'bg-green-100',
          text: count > 5 ? 'text-red-600' : count > 2 ? 'text-yellow-600' : 'text-green-600',
          pulse: count > 5 ? 'bg-red-500' : count > 2 ? 'bg-yellow-500' : 'bg-green-500'
        };
      case 'activity':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-600',
          pulse: 'bg-blue-500'
        };
      case 'booking':
        return {
          bg: 'bg-orange-100',
          text: 'text-orange-600',
          pulse: 'bg-orange-500'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-600',
          pulse: 'bg-gray-500'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${styles.bg} ${styles.text} ${className}`}
    >
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [1, 0.7, 1]
        }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className={`w-2 h-2 ${styles.pulse} rounded-full`}
      />
      <span>
        {variant === 'viewers' && count > 0 && `${count} `}
        {label}
        {variant === 'viewers' && count > 0 && ' viewing'}
      </span>
    </motion.div>
  );
};