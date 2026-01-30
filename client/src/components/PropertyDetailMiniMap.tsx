import React from 'react';
import { Marker, Circle } from 'react-leaflet';
import { MapContainer } from './MapContainer';
import L from 'leaflet';

// Custom location marker icon
const locationIcon = L.divIcon({
  html: `
    <div style="
      background-color: #3b82f6;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 10px;
      font-weight: bold;
    ">📍</div>
  `,
  className: 'custom-location-marker',
  iconSize: [26, 26],
  iconAnchor: [13, 13]
});

interface PropertyDetailMiniMapProps {
  latitude: number;
  longitude: number;
  location: string;
  className?: string;
}

export const PropertyDetailMiniMap: React.FC<PropertyDetailMiniMapProps> = ({
  latitude,
  longitude,
  location,
  className = "h-64 w-full rounded-lg"
}) => {
  const position: [number, number] = [latitude, longitude];

  return (
    <div className="relative">
      <MapContainer
        center={position}
        zoom={15}
        className={className}
      >
        {/* Property location marker */}
        <Marker position={position} icon={locationIcon} />
        
        {/* 1km radius circle for context */}
        <Circle
          center={position}
          radius={1000} // 1km in meters
          pathOptions={{
            color: '#3b82f6',
            fillColor: '#3b82f6',
            fillOpacity: 0.1,
            weight: 2,
            opacity: 0.6
          }}
        />
      </MapContainer>
      
      {/* Location label overlay */}
      <div className="absolute bottom-2 left-2 bg-white bg-opacity-90 rounded-md px-2 py-1 text-xs font-medium text-gray-900 shadow-sm">
        📍 {location}
      </div>
      
      {/* Radius indicator */}
      <div className="absolute top-2 right-2 bg-blue-600 bg-opacity-90 text-white rounded-md px-2 py-1 text-xs font-medium shadow-sm">
        1km radius
      </div>
    </div>
  );
};