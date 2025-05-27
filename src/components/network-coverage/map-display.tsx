
// src/components/network-coverage/map-display.tsx
"use client";

// Removed useState and useEffect imports as we are simplifying
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { LatLngExpression } from 'leaflet';

// Fix for default Leaflet icon path issues with bundlers like Webpack/Next.js
// This should be done once, e.g. in a top-level component or layout,
// but keeping it here for now if this component is the primary map entry point.
if (typeof window !== 'undefined') { // Ensure this runs only on the client
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

interface MapDisplayProps {
  mapCenter: LatLngExpression;
  mapZoom: number;
  markerPosition: LatLngExpression | null;
}

export function MapDisplay({ mapCenter, mapZoom, markerPosition }: MapDisplayProps) {
  // Rely entirely on react-leaflet's MapContainer for lifecycle management.
  // No manual refs, whenCreated, or useEffect cleanup for the map instance here.

  return (
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
      className="rounded-lg shadow-md z-0"
      // The placeholder prop can be useful for visual feedback while Leaflet initializes
      // placeholder={
      //   <div className="h-full w-full bg-muted flex items-center justify-center">
      //     <p className="text-muted-foreground">Initializing map...</p>
      //   </div>
      // }
    >
      {/* 
        Using a fragment ensures TileLayer and Marker are direct children if needed,
        though MapContainer should provide context correctly.
        More importantly, ensure any conditional rendering doesn't rapidly
        mount/unmount MapContainer or its key children without proper keying if needed.
      */}
      <>
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
      </>
    </MapContainer>
  );
}
