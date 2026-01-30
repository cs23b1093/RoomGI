import React, { useState } from 'react';
import type { LifestyleFilters } from '../hooks';

interface FilterBarProps {
  onFiltersChange: (filters: LifestyleFilters) => void;
  loading?: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({ onFiltersChange, loading }) => {
  const [filters, setFilters] = useState<LifestyleFilters>({
    location: '',
    maxRent: undefined,
    nightlife: undefined,
    transit: undefined,
    safety: undefined,
    quietness: undefined,
    food: undefined,
    studentFriendly: undefined
  });

  const handleInputChange = (key: keyof LifestyleFilters, value: string | number | undefined) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    // Remove empty values
    const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== '' && value !== undefined) {
        acc[key as keyof LifestyleFilters] = value;
      }
      return acc;
    }, {} as LifestyleFilters);

    onFiltersChange(cleanFilters);
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
    onFiltersChange({});
  };

  const lifestyleOptions = [
    { value: '', label: 'Any' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Properties</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Location Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            placeholder="Search by location..."
            value={filters.location || ''}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Max Rent Slider */}
        <div>
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
        </div>

        {/* Nightlife */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nightlife
          </label>
          <select
            value={filters.nightlife || ''}
            onChange={(e) => handleInputChange('nightlife', e.target.value as 'low' | 'medium' | 'high' | undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {lifestyleOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Transit */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Transit
          </label>
          <select
            value={filters.transit || ''}
            onChange={(e) => handleInputChange('transit', e.target.value as 'low' | 'medium' | 'high' | undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {lifestyleOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Safety */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Safety
          </label>
          <select
            value={filters.safety || ''}
            onChange={(e) => handleInputChange('safety', e.target.value as 'low' | 'medium' | 'high' | undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {lifestyleOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Quietness */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quietness
          </label>
          <select
            value={filters.quietness || ''}
            onChange={(e) => handleInputChange('quietness', e.target.value as 'low' | 'medium' | 'high' | undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {lifestyleOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Food */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Food Scene
          </label>
          <select
            value={filters.food || ''}
            onChange={(e) => handleInputChange('food', e.target.value as 'low' | 'medium' | 'high' | undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {lifestyleOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Student Friendly */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Student Friendly
          </label>
          <select
            value={filters.studentFriendly || ''}
            onChange={(e) => handleInputChange('studentFriendly', e.target.value as 'low' | 'medium' | 'high' | undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {lifestyleOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleApplyFilters}
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
        >
          {loading ? 'Searching...' : 'Apply Filters'}
        </button>
        <button
          onClick={handleClearFilters}
          disabled={loading}
          className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 font-medium rounded-md transition-colors duration-200"
        >
          Clear
        </button>
      </div>
    </div>
  );
};