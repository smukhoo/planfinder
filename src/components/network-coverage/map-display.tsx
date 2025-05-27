// src/components/network-coverage/map-display.tsx
"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { LatLngExpression, Map as LeafletMapInstanceType } from 'leaflet'; // Renamed for clarity
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
}

export function MapDisplay({ mapCenter, mapZoom, markerPosition }: MapDisplayProps) {
  const mapRef = useRef<LeafletMapInstanceType | null>(null);
  
  // Style object defined outside or memoized to prevent re-creation on every render
  const mapStyle = { height: '100%', width: '100%' };

  useEffect(() => {
    // This effect's cleanup function is crucial for handling React Strict Mode's
    // mount -> unmount -> mount behavior in development.
    
    // Capture the current map instance from the ref.
    // This is the instance that this particular effect cycle is associated with.
    const currentMap = mapRef.current;

    return () => {
      // When the component unmounts (or Strict Mode simulates unmounting),
      // remove the captured map instance.
      if (currentMap) {
        // console.log("Cleaning up Leaflet map instance:", currentMap);
        currentMap.remove();
      }
      // If mapRef.current happens to still be this exact instance, nullify it.
      // This can help if whenCreated for a *new* instance hasn't fired yet.
      if (mapRef.current === currentMap) {
        mapRef.current = null;
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleanup on unmount.

  return (
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      scrollWheelZoom={true}
      style={mapStyle}
      className="rounded-lg shadow-md z-0"
      whenCreated={(map: LeafletMapInstanceType) => {
        // This callback from MapContainer gives us the created Leaflet map instance.
        // console.log("Map instance created by whenCreated:", map);
        
        // If a previous map instance was in the ref (e.g., from a HMR or a rapid remount
        // where cleanup didn't fully nullify), try to remove it first.
        if (mapRef.current && mapRef.current !== map) {
            // console.log("Removing stale map instance from ref:", mapRef.current);
            mapRef.current.remove();
        }
        mapRef.current = map; // Store the new map instance.
      }}
      // We avoid using a static 'id' prop here. MapContainer will create its own div,
      // which React will manage (create/destroy on mount/unmount). This helps prevent
      // Leaflet from trying to initialize on a DOM element it thinks still has a map.
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markerPosition && (
        <Marker position={markerPosition}>
          <Popup>
            Selected Location. <br /> (Coverage data here is illustrative)
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
