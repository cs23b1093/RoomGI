import React from 'react';
import { FilterBar } from '../components/FilterBar';
import { PropertyCard } from '../components/PropertyCard';
import { useProperties, type LifestyleFilters } from '../hooks';

export const PropertiesPage: React.FC = () => {
  const { properties, loading, error, refetch } = useProperties();

  const handleFiltersChange = (filters: LifestyleFilters) => {
    refetch(filters);
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="text-red-600 text-lg font-medium mb-2">Error Loading Properties</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => refetch()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Perfect Property</h1>
        <p className="text-gray-600">
          Discover rental properties with honest reviews and deposit transparency
        </p>
      </div>

      {/* Filter Bar */}
      <FilterBar onFiltersChange={handleFiltersChange} loading={loading} />

      {/* Results Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {loading ? 'Searching...' : `${properties.length} Properties Found`}
        </h2>
        {!loading && properties.length > 0 && (
          <div className="text-sm text-gray-500">
            Sorted by newest first
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      )}

      {/* Properties Grid */}
      {!loading && properties.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && properties.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏠</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Properties Found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your filters or search criteria to find more properties.
          </p>
          <button
            onClick={() => handleFiltersChange({})}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};