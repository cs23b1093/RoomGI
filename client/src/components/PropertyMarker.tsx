import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import type { Property } from '../hooks';

// Custom property marker icon
const createPropertyIcon = (available: boolean) => {
  const color = available ? '#10b981' : '#ef4444'; // green if available, red if not
  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
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
      ">🏠</div>
    `,
    className: 'custom-property-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });
};

interface PropertyMarkerProps {
  property: Property;
  clusterGroup?: L.MarkerClusterGroup;
}

export const PropertyMarker: React.FC<PropertyMarkerProps> = ({ property, clusterGroup }) => {
  const map = useMap();
  const navigate = useNavigate();

  useEffect(() => {
    if (!property.latitude || !property.longitude) {
      return;
    }

    const hasAvailability = property.bedsAvailable > 0;
    
    // Create marker
    const marker = L.marker(
      [property.latitude, property.longitude],
      { icon: createPropertyIcon(hasAvailability) }
    );

    // Create popup content
    const popupContent = `
      <div class="bg-white rounded-lg p-4 min-w-[280px]">
        <div class="flex justify-between items-start mb-3">
          <div>
            <h3 class="font-semibold text-gray-900 text-sm truncate">
              ${property.location}
            </h3>
            <p class="text-xs text-gray-600 capitalize">${property.propertyType}</p>
          </div>
          ${property.verified ? '<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">✓</span>' : ''}
        </div>

        <div class="text-lg font-bold text-gray-900 mb-3">
          ₹${property.rent.toLocaleString()}
          <span class="text-xs font-normal text-gray-500">/month</span>
        </div>

        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-medium text-gray-700">Availability</span>
          <span class="px-2 py-1 rounded-full text-xs font-medium ${
            hasAvailability 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }">
            ${property.bedsAvailable}/${property.totalBeds} beds
          </span>
        </div>

        ${(property.transitScore || property.safetyScore || property.nightlifeScore) ? `
          <div class="grid grid-cols-3 gap-2 mb-3 text-center">
            ${property.transitScore ? `
              <div>
                <div class="text-xs text-gray-500">Transit</div>
                <div class="text-sm font-semibold text-blue-600">${property.transitScore}</div>
              </div>
            ` : ''}
            ${property.safetyScore ? `
              <div>
                <div class="text-xs text-gray-500">Safety</div>
                <div class="text-sm font-semibold text-green-600">${property.safetyScore}</div>
              </div>
            ` : ''}
            ${property.nightlifeScore ? `
              <div>
                <div class="text-xs text-gray-500">Nightlife</div>
                <div class="text-sm font-semibold text-purple-600">${property.nightlifeScore}</div>
              </div>
            ` : ''}
          </div>
        ` : ''}

        <button 
          onclick="window.location.href='/property/${property.id}'"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-md text-sm transition-colors duration-200"
        >
          View Details
        </button>
      </div>
    `;

    marker.bindPopup(popupContent, {
      className: 'property-popup',
      maxWidth: 300
    });

    // Add to cluster group or map
    if (clusterGroup) {
      clusterGroup.addLayer(marker);
    } else {
      marker.addTo(map);
    }

    return () => {
      if (clusterGroup) {
        clusterGroup.removeLayer(marker);
      } else {
        map.removeLayer(marker);
      }
    };
  }, [property, map, navigate, clusterGroup]);

  return null; // This component doesn't render anything directly
};