
"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
// Removed: import { useRef } from 'react'; - No longer needed here
// Removed: import type { Map as LeafletMap } from 'leaflet'; - mapRef removed

// Define Operator and Technology types for props
interface Operator { id: string; name: string; }
interface Technology { id: string; name: string; }

interface MapDisplayProps {
  mapCenter: LatLngExpression;
  mapZoom: number;
  markerPosition: LatLngExpression | null;
  searchTerm: string;
  selectedOperators: string[];
  selectedTechnologies: string[];
  operators: Operator[];
  technologies: Technology[];
}

export default function MapDisplay({
  mapCenter,
  mapZoom,
  markerPosition,
  searchTerm,
  selectedOperators,
  selectedTechnologies,
  operators,
  technologies,
}: MapDisplayProps) {
  // Removed: const mapRef = useRef<LeafletMap | null>(null);

  return (
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
      // Removed: whenCreated={(mapInstance) => { mapRef.current = mapInstance; }}
      className="rounded-md border border-border"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markerPosition && (
        <Marker position={markerPosition}>
          <Popup>
            {searchTerm || 'Current Location'}
          </Popup>
        </Marker>
      )}
      <div className="absolute top-2 left-2 p-2 bg-background/80 rounded shadow-md text-xs z-[1000]">
        <p className="font-semibold">Displaying mock coverage for:</p>
        {selectedOperators.length > 0 ? (
            <p>Operators: {selectedOperators.map(opId => operators.find(o => o.id === opId)?.name).join(', ')}</p>
        ) : <p>No operators selected</p>}
        {selectedTechnologies.length > 0 ? (
            <p>Technologies: {selectedTechnologies.map(techId => technologies.find(t => t.id === techId)?.name).join(', ')}</p>
        ) : <p>No technologies selected</p>}
        {!selectedOperators.length && !selectedTechnologies.length && <p>Select filters to see mock info.</p>}
      </div>
    </MapContainer>
  );
}
