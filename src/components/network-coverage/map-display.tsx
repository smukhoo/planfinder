// src/components/network-coverage/map-display.tsx
"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet'; // L is needed for L.Icon.Default
import type { LatLngExpression, Map as LeafletMapInstanceType } from 'leaflet';
import { useEffect, useRef } from 'react';

// Fix for default Leaflet icon path issues
// This should run once on the client side.
if (typeof window !== 'undefined') {
  // Add a flag to ensure this runs only once, even with HMR or Strict Mode re-evaluations
  if (!(L.Icon.Default.prototype as any)._iconUrlsFixed) {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
    (L.Icon.Default.prototype as any)._iconUrlsFixed = true;
  }
}

interface MapDisplayProps {
  mapCenter: LatLngExpression;
  mapZoom: number;
  markerPosition: LatLngExpression | null;
  isLoadingLocation: boolean;
}

// Define mapStyle outside the component to prevent re-creation on every render
const mapStyle = { height: '100%', width: '100%' };

export function MapDisplay({ mapCenter, mapZoom, markerPosition, isLoadingLocation }: MapDisplayProps) {
  const mapRef = useRef<LeafletMapInstanceType | null>(null);
  
  useEffect(() => {
    // The cleanup function runs when the component unmounts or before the effect re-runs (due to Strict Mode).
    return () => {
      if (mapRef.current) {
        // console.log("Cleaning up Leaflet map instance from useEffect:", mapRef.current);
        mapRef.current.remove(); // Tell Leaflet to clean up the map instance
        mapRef.current = null;   // Clear our reference
      }
    };
  }, []); // Empty dependency array ensures this runs once on mount and cleans up on unmount.

  return (
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      scrollWheelZoom={true}
      style={mapStyle}
      className="rounded-lg shadow-md z-0"
      whenCreated={(mapInstance: LeafletMapInstanceType) => {
        // console.log("Map instance created by whenCreated:", mapInstance);
        mapRef.current = mapInstance; // Store the map instance in the ref
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markerPosition && (
        <Marker position={markerPosition}>
          <Popup>
            {isLoadingLocation ? "Fetching location..." : `Selected Location.`}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
