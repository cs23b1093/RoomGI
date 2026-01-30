import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Property } from '../hooks';
import api from '../lib/axios';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const navigate = useNavigate();
  const [viewingCount, setViewingCount] = useState(property.viewingCount || 0);

  // Poll for viewing count updates every 10 seconds
  useEffect(() => {
    const pollViewingCount = async () => {
      try {
        const response = await api.get(`/api/properties/${property.id}/viewing-count`);
        setViewingCount(response.data.viewingCount);
      } catch (error) {
        console.error('Failed to fetch viewing count:', error);
      }
    };

    const interval = setInterval(pollViewingCount, 10000);
    return () => clearInterval(interval);
  }, [property.id]);

  const handleViewDetails = () => {
    navigate(`/property/${property.id}`);
  };

  const getScoreColor = (score: number | undefined, type: 'deposit' | 'reality') => {
    if (!score) return 'text-gray-400';
    
    if (type === 'deposit') {
      if (score >= 80) return 'text-green-600';
      if (score >= 60) return 'text-yellow-600';
      return 'text-red-600';
    } else {
      if (score >= 4) return 'text-green-600';
      if (score >= 3) return 'text-yellow-600';
      return 'text-red-600';
    }
  };

  const getWarningLevel = (flagCount: number | undefined) => {
    if (!flagCount || flagCount === 0) return null;
    if (flagCount >= 5) return { level: 'danger', color: 'text-red-600', text: 'High Risk' };
    if (flagCount >= 2) return { level: 'warning', color: 'text-yellow-600', text: 'Caution' };
    return null;
  };

  const warning = getWarningLevel(property.flagCount);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200">
      <div className="p-6">
        {/* Header with location and verification */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900 truncate flex-1">
            {property.location}
          </h3>
          <div className="flex items-center gap-2 ml-2">
            {property.verified && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                ✓ Verified
              </span>
            )}
            {warning && (
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 ${warning.color}`}>
                ⚠ {warning.text}
              </span>
            )}
          </div>
        </div>

        {/* Rent and Property Type */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-2xl font-bold text-gray-900">
            ₹{property.rent.toLocaleString()}
            <span className="text-sm font-normal text-gray-500">/month</span>
          </div>
          <div className="text-sm text-gray-600 capitalize">
            {property.propertyType}
          </div>
        </div>

        {/* Beds Information */}
        <div className="flex items-center gap-4 mb-4">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{property.bedsAvailable}</span> available / 
            <span className="font-medium"> {property.totalBeds}</span> total beds
          </div>
        </div>

        {/* Scores */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className={`text-lg font-semibold ${getScoreColor(property.depositScore, 'deposit')}`}>
              {property.depositScore ? `${property.depositScore}%` : 'N/A'}
            </div>
            <div className="text-xs text-gray-500">Deposit Score</div>
          </div>
          <div className="text-center">
            <div className={`text-lg font-semibold ${getScoreColor(property.realityScore, 'reality')}`}>
              {property.realityScore ? `${property.realityScore}/5` : 'N/A'}
            </div>
            <div className="text-xs text-gray-500">Reality Score</div>
          </div>
        </div>

        {/* Reviews and Viewing Count */}
        <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
          <span>
            {property.reviewCount || 0} review{(property.reviewCount || 0) !== 1 ? 's' : ''}
          </span>
          {viewingCount > 0 && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>{viewingCount} viewing now</span>
            </div>
          )}
        </div>

        {/* View Details Button */}
        <button
          onClick={handleViewDetails}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
        >
          View Details
        </button>
      </div>
    </div>
  );
};