// src/components/network-coverage/map-display.tsx
"use client";

// Props are kept for potential future re-integration or if the parent component
// still passes them, but they are not used by this iframe-only version.
interface MapDisplayProps {
  mapCenter: any; // Type kept general as it's unused
  mapZoom: number;
  markerPosition: any | null; // Type kept general
  isLoadingLocation: boolean;
  // These props are not directly used by the iframe but might be useful for context
  searchTerm?: string;
  selectedOperators?: string[];
  selectedTechnologies?: string[];
}

const mapStyle: React.CSSProperties = {
  height: '100%',
  width: '100%',
  border: 'none', // Remove iframe border
  borderRadius: 'var(--radius)', // Inherit border radius from parent
};

export function MapDisplay({ }: MapDisplayProps) {
  // All Leaflet-specific logic, refs, and effects are removed.

  return (
    <iframe
      src="https://www.airtel.in/wirelesscoverage/"
      style={mapStyle}
      title="Airtel Wireless Coverage Map"
      allow="geolocation" // Allows the iframe to request geolocation if the embedded page supports it
      sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-geolocation" // Security sandbox, allow necessary features
    >
      Your browser does not support iframes. Please visit{' '}
      <a href="https://www.airtel.in/wirelesscoverage/" target="_blank" rel="noopener noreferrer">
        Airtel's Coverage Map
      </a>{' '}
      directly.
    </iframe>
  );
}
