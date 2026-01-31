import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LifestyleFilters } from '../hooks';

interface FilterBarProps {
  onFiltersChange?: (filters: LifestyleFilters) => void;
  onApplyFilters?: (filters: LifestyleFilters) => void;
  initialFilters?: LifestyleFilters;
  loading?: boolean;
  compact?: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({ 
  onFiltersChange, 
  onApplyFilters,
  initialFilters = {},
  loading,
  compact = false 
}) => {
  const [filters, setFilters] = useState<LifestyleFilters>(initialFilters);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setFilters(initialFilters);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleInputChange = (key: keyof LifestyleFilters, value: string | number | undefined) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // For non-compact mode, trigger onChange immediately
    if (!compact && onFiltersChange) {
      const cleanFilters = Object.entries(newFilters).reduce((acc, [key, value]) => {
        if (value !== '' && value !== undefined) {
          (acc as any)[key] = value;
        }
        return acc;
      }, {} as LifestyleFilters);
      onFiltersChange(cleanFilters);
    }
  };

  const handleApplyFilters = () => {
    // Remove empty values
    const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== '' && value !== undefined) {
        (acc as any)[key] = value;
      }
      return acc;
    }, {} as LifestyleFilters);

    if (onApplyFilters) {
      onApplyFilters(cleanFilters);
    } else if (onFiltersChange) {
      onFiltersChange(cleanFilters);
    }
  };

  const handleClearFilters = () => {
    const emptyFilters: LifestyleFilters = {
      location: '',
      maxRent: undefined,
      nightlife: undefined,
      transit: undefined,
      safety: undefined,
      quietness: undefined,
      food: undefined,
      studentFriendly: undefined
    };
    setFilters(emptyFilters);
    
    if (onApplyFilters) {
      onApplyFilters({});
    } else if (onFiltersChange) {
      onFiltersChange({});
    }
  };

  const lifestyleOptions = [
    { value: '', label: 'Any' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={compact ? "space-y-3" : "bg-white rounded-lg shadow-md mb-6 overflow-hidden"}
    >
      {/* Mobile Accordion Header */}
      {isMobile && !compact && (
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between text-left"
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-gray-900">Filters</span>
            {Object.values(filters).some(v => v && v !== '') && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
              >
                Active
              </motion.span>
            )}
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-gray-500"
          >
            ▼
          </motion.div>
        </motion.button>
      )}

      {/* Desktop Header */}
      {!isMobile && !compact && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Filter Properties</h2>
        </div>
      )}

      {/* Filter Content */}
      <AnimatePresence>
        {(!isMobile || isExpanded || compact) && (
          <motion.div
            initial={isMobile ? { height: 0, opacity: 0 } : { opacity: 1 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={compact ? "space-y-3" : "p-4 sm:p-6"}
          >
            <div className={compact 
              ? "space-y-3" 
              : isMobile 
                ? "space-y-4"
                : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
            }>
              {/* Location Search */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Search by location..."
                  value={filters.location || ''}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </motion.div>

              {/* Max Rent Slider */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Rent: ₹{filters.maxRent ? filters.maxRent.toLocaleString() : '50,000'}
                </label>
                <input
                  type="range"
                  min="5000"
                  max="100000"
                  step="5000"
                  value={filters.maxRent || 50000}
                  onChange={(e) => handleInputChange('maxRent', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>₹5K</span>
                  <span>₹100K</span>
                </div>
              </motion.div>

              {compact ? (
                // Compact mode: Show only key filters
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="grid grid-cols-2 gap-2"
                >
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Transit</label>
                    <select
                      value={filters.transit || ''}
                      onChange={(e) => handleInputChange('transit', e.target.value as 'low' | 'medium' | 'high' | undefined)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {lifestyleOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Safety</label>
                    <select
                      value={filters.safety || ''}
                      onChange={(e) => handleInputChange('safety', e.target.value as 'low' | 'medium' | 'high' | undefined)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {lifestyleOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </motion.div>
              ) : (
                // Full mode: Show all filters
                <>
                  {[
                    { key: 'nightlife', label: 'Nightlife', delay: 0.3 },
                    { key: 'transit', label: 'Transit', delay: 0.4 },
                    { key: 'safety', label: 'Safety', delay: 0.5 },
                    { key: 'quietness', label: 'Quietness', delay: 0.6 },
                    { key: 'food', label: 'Food Scene', delay: 0.7 },
                    { key: 'studentFriendly', label: 'Student Friendly', delay: 0.8 }
                  ].map(({ key, label, delay }) => (
                    <motion.div
                      key={key}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {label}
                      </label>
                      <select
                        value={filters[key as keyof LifestyleFilters] || ''}
                        onChange={(e) => handleInputChange(key as keyof LifestyleFilters, e.target.value as 'low' | 'medium' | 'high' | undefined)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {lifestyleOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </motion.div>
                  ))}
                </>
              )}
            </div>

            {/* Action Buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              {compact ? (
                <motion.button
                  onClick={handleApplyFilters}
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-3 rounded-md text-sm transition-colors duration-200"
                >
                  {loading ? 'Searching...' : 'Apply Filters'}
                </motion.button>
              ) : (
                <div className={`flex gap-3 ${isMobile ? 'flex-col' : ''}`}>
                  <motion.button
                    onClick={handleApplyFilters}
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                  >
                    {loading ? 'Searching...' : 'Apply Filters'}
                  </motion.button>
                  <motion.button
                    onClick={handleClearFilters}
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 font-medium rounded-md transition-colors duration-200"
                  >
                    Clear
                  </motion.button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};