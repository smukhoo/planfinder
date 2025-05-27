// src/components/network-coverage/map-display.tsx
"use client";

import type { LatLngExpression } from 'leaflet';
import { Loader2 } from 'lucide-react'; // Keep for loading state from parent

// Define mapStyle outside the component to prevent re-creation on every render
const mapPlaceholderStyle: React.CSSProperties = {
  height: '100%',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'hsl(var(--muted))', // Use theme color
  border: '2px dashed hsl(var(--border))', // Use theme color
  borderRadius: 'var(--radius)',
  color: 'hsl(var(--muted-foreground))',
  flexDirection: 'column',
  textAlign: 'center',
  padding: '20px',
};

interface MapDisplayProps {
  // Props are kept for potential future re-integration, but not all are used by the placeholder
  mapCenter: LatLngExpression;
  mapZoom: number;
  markerPosition: LatLngExpression | null;
  isLoadingLocation: boolean; // This can still be used to show a loading state on the placeholder
}

export function MapDisplay({ isLoadingLocation, markerPosition, mapCenter, mapZoom }: MapDisplayProps) {
  // The Leaflet icon fix and map instance management (useRef, useEffect for cleanup) are removed
  // as we are no longer rendering an actual Leaflet map.

  if (isLoadingLocation) {
    return (
      <div style={mapPlaceholderStyle}>
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
        <p>Fetching location for map...</p>
      </div>
    );
  }

  return (
    <div style={mapPlaceholderStyle}>
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map mb-3 text-primary opacity-70">
        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" x2="9" y1="3" y2="18"/><line x1="15" x2="15" y1="6" y2="21"/>
      </svg>
      <h3 className="text-lg font-semibold mb-1 text-foreground">Interactive Map Placeholder</h3>
      <p className="text-sm">
        The interactive map will be displayed here.
      </p>
      {markerPosition && (
        <p className="text-xs mt-2">Marker at: {JSON.stringify(markerPosition)}</p>
      )}
       <p className="text-xs mt-1">Center: {JSON.stringify(mapCenter)}, Zoom: {mapZoom}</p>
    </div>
  );
}
