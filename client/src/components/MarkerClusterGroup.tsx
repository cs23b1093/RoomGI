import React, { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster';

interface MarkerClusterGroupProps {}

export const MarkerClusterGroup: React.FC<MarkerClusterGroupProps> = () => {
  const map = useMap();
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);

  useEffect(() => {
    // Create cluster group
    clusterGroupRef.current = L.markerClusterGroup({
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount();
        let size = 'small';
        let color = '#3b82f6'; // blue
        
        if (count >= 10) {
          size = 'large';
          color = '#ef4444'; // red
        } else if (count >= 5) {
          size = 'medium';
          color = '#f59e0b'; // yellow
        }
        
        return L.divIcon({
          html: `
            <div style="
              background-color: ${color};
              color: white;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              font-size: ${size === 'large' ? '14px' : size === 'medium' ? '12px' : '10px'};
              width: ${size === 'large' ? '50px' : size === 'medium' ? '40px' : '30px'};
              height: ${size === 'large' ? '50px' : size === 'medium' ? '40px' : '30px'};
            ">${count}</div>
          `,
          className: 'custom-cluster-marker',
          iconSize: [
            size === 'large' ? 50 : size === 'medium' ? 40 : 30,
            size === 'large' ? 50 : size === 'medium' ? 40 : 30
          ]
        });
      }
    });

    // Add to map
    map.addLayer(clusterGroupRef.current);

    return () => {
      if (clusterGroupRef.current) {
        map.removeLayer(clusterGroupRef.current);
      }
    };
  }, [map]);

  // This component doesn't render anything directly
  // The markers are added to the cluster group via the PropertyMarker component
  return null;
};