import React, { useState, useCallback } from 'react';
import { Marker, useMapEvents } from 'react-leaflet';
import { MapContainer } from './MapContainer';
import L from 'leaflet';

// Custom picker marker icon
const pickerIcon = L.divIcon({
  html: `
    <div style="
      background-color: #ef4444;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 12px;
      font-weight: bold;
      cursor: pointer;
    ">📍</div>
  `,
  className: 'custom-picker-marker',
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

interface CoordinatePickerProps {
  latitude?: string;
  longitude?: string;
  onCoordinateChange: (lat: string, lng: string) => void;
  className?: string;
}

// Map click handler component
const MapClickHandler: React.FC<{
  onLocationSelect: (lat: number, lng: number) => void;
}> = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
};

export const CoordinatePicker: React.FC<CoordinatePickerProps> = ({
  latitude,
  longitude,
  onCoordinateChange,
  className = "h-64 w-full rounded-lg"
}) => {
  // Bangalore center as default
  const [center] = useState<[number, number]>([12.9716, 77.5946]);
  
  const handleLocationSelect = useCallback((lat: number, lng: number) => {
    onCoordinateChange(lat.toFixed(6), lng.toFixed(6));
  }, [onCoordinateChange]);

  const selectedPosition = latitude && longitude 
    ? [parseFloat(latitude), parseFloat(longitude)] as [number, number]
    : null;

  return (
    <div className="relative">
      <MapContainer
        center={selectedPosition || center}
        zoom={13}
        className={className}
      >
        <MapClickHandler onLocationSelect={handleLocationSelect} />
        
        {selectedPosition && (
          <Marker position={selectedPosition} icon={pickerIcon} />
        )}
      </MapContainer>
      
      {/* Instructions overlay */}
      <div className="absolute top-2 left-2 bg-white bg-opacity-90 rounded-md px-3 py-2 text-sm text-gray-700 shadow-sm max-w-xs">
        {selectedPosition ? (
          <div>
            <div className="font-medium text-green-600">✓ Location Selected</div>
            <div className="text-xs text-gray-500 mt-1">
              {latitude}, {longitude}
            </div>
            <div className="text-xs text-gray-500">Click to change location</div>
          </div>
        ) : (
          <div>
            <div className="font-medium">📍 Select Location</div>
            <div className="text-xs text-gray-500 mt-1">Click anywhere on the map</div>
          </div>
        )}
      </div>
      
      {/* Clear button */}
      {selectedPosition && (
        <button
          onClick={() => onCoordinateChange('', '')}
          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-sm transition-colors duration-200"
          title="Clear location"
        >
          ✕
        </button>
      )}
      
      {/* Coordinate display */}
      {selectedPosition && (
        <div className="absolute bottom-2 left-2 bg-blue-600 bg-opacity-90 text-white rounded-md px-2 py-1 text-xs font-mono shadow-sm">
          {latitude}, {longitude}
        </div>
      )}
    </div>
  );
};