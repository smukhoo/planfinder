// src/components/network-coverage/map-display.tsx
"use client";

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { LatLngExpression, Map as LeafletMap } from 'leaflet';

// Fix for default Leaflet icon path issues with bundlers like Webpack/Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapDisplayProps {
  mapCenter: LatLngExpression;
  mapZoom: number;
  markerPosition: LatLngExpression | null;
  isLoadingLocation?: boolean; // Optional prop to show loading state on map if needed
  // In a real app, you'd pass coverage data here to draw overlays
}

export function MapDisplay({ mapCenter, mapZoom, markerPosition }: MapDisplayProps) {
  const mapRef = useRef<LeafletMap | null>(null);

  // Effect to update map view if center or zoom props change from parent
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(mapCenter, mapZoom);
    }
  }, [mapCenter, mapZoom]);

  // Effect for map instance cleanup on component unmount
  useEffect(() => {
    const currentMap = mapRef.current; // Capture the current map instance
    return () => {
      // Only attempt to remove if it's the same instance this effect was for
      if (currentMap && mapRef.current === currentMap) {
        currentMap.remove();
        mapRef.current = null; // Help garbage collection
      }
    };
  }, []); // Empty dependency array to run only on mount and unmount

  return (
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
      whenCreated={(mapInstance: LeafletMap) => {
        mapRef.current = mapInstance;
      }}
      className="rounded-lg shadow-md z-0" // Ensure map is behind UI elements if overlapping
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markerPosition && (
        <Marker position={markerPosition}>
          <Popup>Your current/searched location.</Popup>
        </Marker>
      )}
      {/* Future: Add GeoJSON layers or other overlay components here based on selected filters */}
    </MapContainer>
  );
}
