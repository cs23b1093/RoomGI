import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FilterBar } from '../components/FilterBar';
import { PropertyCard, PropertyCardSkeleton } from '../components';
import { useProperties, type LifestyleFilters } from '../hooks';

export const PropertiesPage: React.FC = () => {
  const { properties, loading, error, refetch } = useProperties();

  const handleFiltersChange = (filters: LifestyleFilters) => {
    refetch(filters);
  };

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="text-center">
          <motion.div 
            className="text-red-600 text-lg font-medium mb-2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            Error Loading Properties
          </motion.div>
          <p className="text-gray-600 mb-4">{error}</p>
          <motion.button
            onClick={() => refetch()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
          >
            Try Again
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-6 sm:mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <motion.h1 
              className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Find Your Perfect Property
            </motion.h1>
            <motion.p 
              className="text-gray-600 text-sm sm:text-base"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Discover rental properties with honest reviews and deposit transparency
            </motion.p>
          </div>
          <motion.div 
            className="flex gap-2"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.a
              href="/properties/map"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-3 sm:px-4 rounded-md transition-colors duration-200 flex items-center gap-2 text-sm sm:text-base"
            >
              🗺️ <span className="hidden sm:inline">Map View</span>
            </motion.a>
          </motion.div>
        </div>
      </motion.div>

      {/* Filter Bar */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <FilterBar onFiltersChange={handleFiltersChange} loading={loading} />
      </motion.div>

      {/* Results Header */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-2"
      >
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
          {loading ? 'Searching...' : `${properties.length} Properties Found`}
        </h2>
        {!loading && properties.length > 0 && (
          <div className="text-xs sm:text-sm text-gray-500">
            Sorted by newest first
          </div>
        )}
      </motion.div>

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {[...Array(6)].map((_, index) => (
            <PropertyCardSkeleton key={index} />
          ))}
        </motion.div>
      )}

      {/* Properties Grid */}
      <AnimatePresence mode="wait">
        {!loading && properties.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            {properties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!loading && properties.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <motion.div 
            className="text-gray-400 text-4xl sm:text-6xl mb-4"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            🏠
          </motion.div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Properties Found</h3>
          <p className="text-gray-600 mb-4 text-sm sm:text-base px-4">
            Try adjusting your filters or search criteria to find more properties.
          </p>
          <motion.button
            onClick={() => handleFiltersChange({})}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
          >
            Clear All Filters
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};