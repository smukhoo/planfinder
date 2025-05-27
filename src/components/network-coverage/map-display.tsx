// src/components/network-coverage/map-display.tsx
"use client";

import { useState, useEffect, useRef } from 'react'; // Added useState
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
}

export function MapDisplay({ mapCenter, mapZoom, markerPosition }: MapDisplayProps) {
  const mapRef = useRef<LeafletMap | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Component is now mounted on the client

    // Cleanup function:
    // This will be called when the component unmounts, or before the effect re-runs in Strict Mode.
    return () => {
      if (mapRef.current) {
        mapRef.current.remove(); // Explicitly destroy the Leaflet map instance
        mapRef.current = null;   // Clear the reference
      }
    };
  }, []); // Empty dependency array ensures this effect runs once on mount and cleans up on unmount

  if (!isMounted) {
    // If not mounted, don't render the map. 
    // The parent's dynamic import loading state will handle the initial placeholder.
    return null; 
  }

  return (
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
      whenCreated={(mapInstance: LeafletMap) => {
        // If a map instance already exists in the ref (e.g., from a previous Strict Mode render),
        // remove it before assigning the new one.
        if (mapRef.current) {
            mapRef.current.remove();
        }
        mapRef.current = mapInstance;
      }}
      className="rounded-lg shadow-md z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markerPosition && (
        <Marker position={markerPosition}>
          <Popup>
            Selected Location. <br /> Coverage data display is illustrative.
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
