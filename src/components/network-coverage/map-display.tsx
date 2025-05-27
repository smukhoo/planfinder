// src/components/network-coverage/map-display.tsx
"use client";

import { useEffect, useState } from 'react'; // Added useState
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
  const [map, setMap] = useState<LeafletMap | null>(null);

  useEffect(() => {
    // This effect runs when the `map` state changes.
    // The cleanup function will be called when the component unmounts
    // or before the effect runs again if `map` were to change to a new instance (which it shouldn't after initial set).
    if (map) {
      return () => {
        map.remove();
      };
    }
  }, [map]); // Depend on the map instance state

  return (
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
      whenCreated={setMap} // Use setMap directly as the callback for whenCreated
      className="rounded-lg shadow-md z-0"
    >
      {map && ( // Conditionally render children only when the map instance is available
        <>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {markerPosition && (
            <Marker position={markerPosition}>
              <Popup>
                Selected Location. <br /> Coverage data here is illustrative.
              </Popup>
            </Marker>
          )}
        </>
      )}
    </MapContainer>
  );
}
