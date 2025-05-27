
"use client";

import { useRef, useEffect } from 'react'; // Added useEffect and useRef
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { LatLngExpression, Map as LeafletMap } from 'leaflet'; // Import LeafletMap type

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
  const mapRef = useRef<LeafletMap | null>(null);

  // Effect to clean up the map instance when the component unmounts
  // or before it re-initializes due to HMR or StrictMode. comment
  useEffect(() => {
    const mapInstance = mapRef.current;
    return () => {
      if (mapInstance) {
        // Check if the container is still in the DOM and map instance hasn't been removed
        if (mapInstance.getContainer() && (mapInstance as any)._leaflet_id !== undefined) {
            mapInstance.remove();
        }
        mapRef.current = null;
      }
    };
  }, []); // Empty dependency array: runs once on mount, cleanup on unmount.

  return (
    <MapContainer
      id="network-map-container" // Keep static ID
      center={mapCenter}
      zoom={mapZoom}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
      className="rounded-md border border-border"
      whenCreated={(mapInstance: LeafletMap) => { // Get the map instance
        mapRef.current = mapInstance;
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markerPosition && (
        <Marker position={markerPosition}>
          <Popup>
            {searchTerm || 'Current Location'}
            {selectedOperators.length > 0 && (
              <><br />Op: {selectedOperators.map(opId => operators.find(o => o.id === opId)?.name).join(', ')}</>
            )}
            {selectedTechnologies.length > 0 && (
              <><br />Tech: {selectedTechnologies.map(techId => technologies.find(t => t.id === techId)?.name).join(', ')}</>
            )}
          </Popup>
        </Marker>
      )}
      {/* Overlay text directly inside MapContainer as a child, shows selected filters */}
      <div className="absolute top-2 left-2 p-2 bg-background/80 rounded shadow-md text-xs z-[1000]">
        <p className="font-semibold">Illustrative coverage for:</p>
        {selectedOperators.length > 0 ? (
            <p>Operators: {selectedOperators.map(opId => operators.find(o => o.id === opId)?.name).join(', ')}</p>
        ) : <p>No operators selected</p>}
        {selectedTechnologies.length > 0 ? (
            <p>Technologies: {selectedTechnologies.map(techId => technologies.find(t => t.id === techId)?.name).join(', ')}</p>
        ) : <p>No technologies selected</p>}
        {(!selectedOperators.length && !selectedTechnologies.length) && <p>Select filters to see info.</p>}
      </div>
    </MapContainer>
  );
}

