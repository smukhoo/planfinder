
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

export function MapDisplay({ mapCenter, mapZoom, markerPosition, isLoadingLocation }: MapDisplayProps) {
  const mapRef = useRef<LeafletMapInstanceType | null>(null);
  
  // Style object defined outside or memoized to prevent re-creation on every render
  const mapStyle = { height: '100%', width: '100%' };

  useEffect(() => {
    // Capture the current map instance from the ref for this effect's scope.
    // This is the instance associated with this particular effect's setup.
    const currentMapInstance = mapRef.current;

    return () => {
      // This cleanup function runs when the component unmounts or before the effect re-runs (due to Strict Mode).
      if (currentMapInstance) {
        // console.log("Cleaning up Leaflet map instance:", currentMapInstance);
        currentMapInstance.remove(); // Remove the specific instance this effect was tied to.
      }
      // If mapRef.current still points to the instance we just removed, nullify it.
      // This prevents issues if a new map instance was quickly created and assigned to mapRef.current
      // by a subsequent whenCreated call before this cleanup ran for the old instance.
      if (mapRef.current === currentMapInstance) {
        mapRef.current = null;
      }
    };
  }, []); // Empty dependency array ensures this runs on mount and cleans up on unmount.

  return (
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      scrollWheelZoom={true}
      style={mapStyle}
      className="rounded-lg shadow-md z-0"
      whenCreated={(map: LeafletMapInstanceType) => {
        // This callback is invoked when the Leaflet map instance is created.
        // console.log("Map instance created by whenCreated:", map);

        // If mapRef.current already holds a (potentially stale) map instance
        // and it's different from the newly created one, remove the stale one.
        // This can happen with HMR or very rapid re-renders.
        if (mapRef.current && mapRef.current !== map) {
          // console.log("Removing stale map instance from ref in whenCreated:", mapRef.current);
          mapRef.current.remove();
        }
        mapRef.current = map; // Store the reference to the newly created map instance.
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

