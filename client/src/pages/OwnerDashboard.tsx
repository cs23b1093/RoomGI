import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast, ToastContainer } from '../components';
import { CoordinatePicker } from '../components/CoordinatePicker';
import type { Property } from '../hooks';
import api from '../lib/axios';

interface PropertyWithActions extends Property {
  updating?: boolean;
}

export const OwnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toasts, addToast, removeToast } = useToast();
  const [properties, setProperties] = useState<PropertyWithActions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [simulatingTraffic, setSimulatingTraffic] = useState(false);
  const [simulatingBookings, setSimulatingBookings] = useState(false);

  useEffect(() => {
    if (user?.role === 'owner') {
      fetchMyProperties();
    }
  }, [user]);

  const fetchMyProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/properties/my/properties');
      setProperties(response.data);
    } catch (err) {
      setError('Failed to load properties');
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateAvailability = async (propertyId: string, newAvailability: number) => {
    try {
      // Optimistic update
      setProperties(prev => prev.map(p => 
        p.id === propertyId 
          ? { ...p, bedsAvailable: newAvailability, updating: true }
          : p
      ));

      await api.patch(`/api/properties/${propertyId}/availability`, {
        bedsAvailable: newAvailability
      });

      // Remove updating flag
      setProperties(prev => prev.map(p => 
        p.id === propertyId 
          ? { ...p, updating: false }
          : p
      ));

      addToast('Availability updated successfully', 'success');
    } catch (err: any) {
      // Revert optimistic update
      fetchMyProperties();
      addToast(err.response?.data?.error || 'Failed to update availability', 'error');
    }
  };

  const generateMockActivity = async (propertyId: string) => {
    try {
      const response = await api.post(`/api/properties/${propertyId}/generate-activity`);
      console.log('Mock Activity Generated:', response.data);
      addToast(`Generated ${response.data.activities?.length || 'some'} mock activities`, 'success');
    } catch (err: any) {
      console.error('Generate activity error:', err);
      addToast(err.response?.data?.error || 'Failed to generate activity', 'error');
    }
  };

  const simulateBooking = async (propertyId: string, bedsToBook: number) => {
    try {
      const response = await api.post(`/api/properties/${propertyId}/mock-booking`, {
        bedsToBook
      });
      console.log('Booking Simulated:', response.data);
      
      // Update local state
      setProperties(prev => prev.map(p => 
        p.id === propertyId 
          ? { ...p, bedsAvailable: response.data.newAvailability }
          : p
      ));

      addToast(response.data.message, 'success');
    } catch (err: any) {
      console.error('Simulate booking error:', err);
      addToast(err.response?.data?.error || 'Failed to simulate booking', 'error');
    }
  };

  const simulateHighTraffic = async () => {
    try {
      setSimulatingTraffic(true);
      const response = await api.post('/api/properties/simulate/high-traffic');
      console.log('High Traffic Simulated:', response.data);
      addToast(response.data.message, 'success');
    } catch (err: any) {
      console.error('Simulate traffic error:', err);
      addToast(err.response?.data?.error || 'Failed to simulate traffic', 'error');
    } finally {
      setSimulatingTraffic(false);
    }
  };

  const simulateBookingSpike = async () => {
    try {
      setSimulatingBookings(true);
      const response = await api.post('/api/properties/simulate/booking-spike');
      console.log('Booking Spike Simulated:', response.data);
      addToast(response.data.message, 'success');
      
      // Refresh properties to show updated availability
      setTimeout(() => {
        fetchMyProperties();
      }, 3000);
    } catch (err: any) {
      console.error('Simulate booking spike error:', err);
      addToast(err.response?.data?.error || 'Failed to simulate booking spike', 'error');
    } finally {
      setSimulatingBookings(false);
    }
  };

  if (user?.role !== 'owner') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="text-red-600 text-lg font-medium mb-2">Access Denied</div>
          <p className="text-gray-600">This page is only accessible to property owners.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Owner Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your properties and track performance</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
        >
          Add Property
        </button>
      </div>

      {/* Mock Tools Section */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">🚀 Demo Tools (Hackathon)</h2>
        <p className="text-sm text-gray-600 mb-4">
          Use these tools to simulate real-time activity for demo purposes
        </p>
        <div className="flex gap-4">
          <button
            onClick={simulateHighTraffic}
            disabled={simulatingTraffic}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
          >
            {simulatingTraffic ? 'Simulating...' : 'Simulate High Traffic'}
          </button>
          <button
            onClick={simulateBookingSpike}
            disabled={simulatingBookings}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
          >
            {simulatingBookings ? 'Simulating...' : 'Simulate Booking Spike'}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Check browser console for detailed logs and responses
        </p>
      </div>

      {/* Properties List */}
      {error ? (
        <div className="text-center py-8">
          <div className="text-red-600 text-lg font-medium mb-2">{error}</div>
          <button
            onClick={fetchMyProperties}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
          >
            Try Again
          </button>
        </div>
      ) : properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onUpdateAvailability={updateAvailability}
              onGenerateActivity={generateMockActivity}
              onSimulateBooking={simulateBooking}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏠</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Properties Yet</h3>
          <p className="text-gray-600 mb-4">
            Start by adding your first property to the platform
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
          >
            Add Your First Property
          </button>
        </div>
      )}

      {/* Add Property Modal */}
      {showAddModal && (
        <AddPropertyModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchMyProperties();
          }}
        />
      )}
    </div>
  );
};

// Property Card Component
interface PropertyCardProps {
  property: PropertyWithActions;
  onUpdateAvailability: (propertyId: string, newAvailability: number) => void;
  onGenerateActivity: (propertyId: string) => void;
  onSimulateBooking: (propertyId: string, bedsToBook: number) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onUpdateAvailability,
  onGenerateActivity,
  onSimulateBooking
}) => {
  const [bookingBeds, setBookingBeds] = useState(1);

  const handleDecrease = () => {
    if (property.bedsAvailable > 0) {
      onUpdateAvailability(property.id, property.bedsAvailable - 1);
    }
  };

  const handleIncrease = () => {
    if (property.bedsAvailable < property.totalBeds) {
      onUpdateAvailability(property.id, property.bedsAvailable + 1);
    }
  };

  const handleSimulateBooking = () => {
    if (bookingBeds <= property.bedsAvailable) {
      onSimulateBooking(property.id, bookingBeds);
    }
  };

  const getAvailabilityColor = () => {
    const ratio = property.bedsAvailable / property.totalBeds;
    if (ratio <= 0.2) return 'text-red-600 bg-red-50';
    if (ratio <= 0.5) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {property.location}
          </h3>
          <p className="text-sm text-gray-600 capitalize">{property.propertyType}</p>
        </div>
        {property.verified && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            ✓ Verified
          </span>
        )}
      </div>

      {/* Rent */}
      <div className="text-2xl font-bold text-gray-900 mb-4">
        ₹{property.rent.toLocaleString()}
        <span className="text-sm font-normal text-gray-500">/month</span>
      </div>

      {/* Availability */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Availability</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor()}`}>
            {property.bedsAvailable}/{property.totalBeds} available
          </span>
        </div>
        
        {/* Quick Edit Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDecrease}
            disabled={property.bedsAvailable === 0 || property.updating}
            className="w-8 h-8 bg-red-100 hover:bg-red-200 disabled:bg-gray-100 disabled:text-gray-400 text-red-600 rounded-full flex items-center justify-center font-bold transition-colors duration-200"
          >
            -
          </button>
          <span className="text-lg font-semibold text-gray-900 min-w-[3rem] text-center">
            {property.updating ? '...' : property.bedsAvailable}
          </span>
          <button
            onClick={handleIncrease}
            disabled={property.bedsAvailable === property.totalBeds || property.updating}
            className="w-8 h-8 bg-green-100 hover:bg-green-200 disabled:bg-gray-100 disabled:text-gray-400 text-green-600 rounded-full flex items-center justify-center font-bold transition-colors duration-200"
          >
            +
          </button>
        </div>
      </div>

      {/* Demo Actions */}
      <div className="space-y-2">
        <button
          onClick={() => onGenerateActivity(property.id)}
          className="w-full bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium py-2 px-3 rounded-md text-sm transition-colors duration-200"
        >
          Generate Mock Activity
        </button>
        
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-1">
            <input
              type="number"
              min="1"
              max={property.bedsAvailable}
              value={bookingBeds}
              onChange={(e) => setBookingBeds(Number(e.target.value))}
              className="w-12 px-2 py-1 border border-gray-300 rounded text-center text-sm"
            />
            <button
              onClick={handleSimulateBooking}
              disabled={bookingBeds > property.bedsAvailable || property.bedsAvailable === 0}
              className="flex-1 bg-orange-100 hover:bg-orange-200 disabled:bg-gray-100 disabled:text-gray-400 text-orange-700 font-medium py-2 px-3 rounded-md text-sm transition-colors duration-200"
            >
              Simulate Booking
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-blue-600">
              {property.reviewCount || 0}
            </div>
            <div className="text-xs text-gray-500">Reviews</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-green-600">
              {property.depositScore || 0}%
            </div>
            <div className="text-xs text-gray-500">Deposit Score</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add Property Modal Component with CoordinatePicker
interface AddPropertyModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AddPropertyModal: React.FC<AddPropertyModalProps> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    location: '',
    rent: '',
    propertyType: 'apartment',
    totalBeds: '1',
    latitude: '',
    longitude: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.location || !formData.rent || !formData.totalBeds) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const payload = {
        location: formData.location,
        rent: Number(formData.rent),
        propertyType: formData.propertyType,
        totalBeds: Number(formData.totalBeds),
        bedsAvailable: Number(formData.totalBeds),
        ...(formData.latitude && formData.longitude && {
          latitude: Number(formData.latitude),
          longitude: Number(formData.longitude)
        })
      };

      await api.post('/api/properties', payload);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create property');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCoordinateChange = (lat: string, lng: string) => {
    setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Add New Property</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., Koramangala, Bangalore"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Rent */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Rent (₹) *
                </label>
                <input
                  type="number"
                  value={formData.rent}
                  onChange={(e) => setFormData(prev => ({ ...prev, rent: e.target.value }))}
                  placeholder="25000"
                  min="1000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Type *
                </label>
                <select
                  value={formData.propertyType}
                  onChange={(e) => setFormData(prev => ({ ...prev, propertyType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="condo">Condo</option>
                  <option value="studio">Studio</option>
                </select>
              </div>

              {/* Total Beds */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Beds *
                </label>
                <input
                  type="number"
                  value={formData.totalBeds}
                  onChange={(e) => setFormData(prev => ({ ...prev, totalBeds: e.target.value }))}
                  min="1"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Coordinate Picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location on Map (Optional)
              </label>
              <CoordinatePicker
                latitude={formData.latitude}
                longitude={formData.longitude}
                onCoordinateChange={handleCoordinateChange}
                className="h-64 w-full rounded-lg border border-gray-300"
              />
            </div>

            {/* Hidden coordinate inputs for form submission */}
            <input type="hidden" value={formData.latitude} />
            <input type="hidden" value={formData.longitude} />

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 font-medium rounded-md transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
              >
                {submitting ? 'Creating...' : 'Create Property'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};