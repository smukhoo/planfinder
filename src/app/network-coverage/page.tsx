
// src/app/network-coverage/page.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPinned, Search, ShieldAlert, Wifi, Smartphone, Settings2, Loader2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import type { LatLngExpression, Map as LeafletMap } from 'leaflet'; // Import LeafletMap type

const OPERATORS = [
  { id: 'jio', name: 'Jio' },
  { id: 'airtel', name: 'Airtel' },
  { id: 'vi', name: 'Vi (Vodafone Idea)' },
  { id: 'bsnl', name: 'BSNL' },
];

const TECHNOLOGIES = [
  { id: '5g', name: '5G' },
  { id: '4g', name: '4G/LTE' },
  { id: '3g', name: '3G' },
];

const DEFAULT_MAP_CENTER: LatLngExpression = [20.5937, 78.9629]; // Approx center of India
const DEFAULT_MAP_ZOOM = 5;

// Helper component to update map view
function ChangeMapView({ center, zoom }: { center: LatLngExpression, zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}


export default function NetworkCoveragePage() {
  const [selectedOperators, setSelectedOperators] = useState<string[]>([]);
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [mapMessage, setMapMessage] = useState('Select operators, technologies, and search for a location. Map functionality is basic.');
  const [currentLocationLoading, setCurrentLocationLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState<LatLngExpression>(DEFAULT_MAP_CENTER);
  const [mapZoom, setMapZoom] = useState<number>(DEFAULT_MAP_ZOOM);
  const [markerPosition, setMarkerPosition] = useState<LatLngExpression | null>(null);

  const mapRef = useRef<LeafletMap | null>(null);

  const handleOperatorToggle = (operatorId: string) => {
    setSelectedOperators(prev =>
      prev.includes(operatorId)
        ? prev.filter(id => id !== operatorId)
        : [...prev, operatorId]
    );
  };

  const handleTechnologyToggle = (techId: string) => {
    setSelectedTechnologies(prev =>
      prev.includes(techId)
        ? prev.filter(id => id !== techId)
        : [...prev, techId]
    );
  };

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    let message = 'Map: ';
    if (searchTerm) {
      message += `Displaying map for "${searchTerm}"`;
      // In a real app, you'd geocode searchTerm to coordinates and update mapCenter & markerPosition
      // For now, we'll just update the message and potentially reset marker if search is general
      setMarkerPosition(null); // Clear marker for general searches
    } else {
      message += `Displaying general map of India`;
      setMapCenter(DEFAULT_MAP_CENTER);
      setMapZoom(DEFAULT_MAP_ZOOM);
      setMarkerPosition(null);
    }
    if (selectedOperators.length > 0 || selectedTechnologies.length > 0) {
      message += ` with filters: `;
      if (selectedOperators.length > 0) {
        message += `Operators (${selectedOperators.map(opId => OPERATORS.find(o => o.id === opId)?.name).join(', ')}) `;
      }
      if (selectedTechnologies.length > 0) {
        message += `Technologies (${selectedTechnologies.map(techId => TECHNOLOGIES.find(t => t.id === techId)?.name).join(', ')})`;
      }
    }
    message += `. Actual coverage overlays not yet implemented.`;
    setMapMessage(message);
    // TODO: Implement actual geocoding and map view update based on searchTerm
  };
  
  useEffect(() => {
    // Update message when filters change without an explicit search submission
    let baseMessage = "Map: Viewing general map.";
    if (selectedOperators.length > 0 || selectedTechnologies.length > 0) {
      baseMessage = `Map: Viewing for`;
      if (selectedOperators.length > 0) {
        baseMessage += ` ${selectedOperators.map(opId => OPERATORS.find(o => o.id === opId)?.name).join(', ')}`;
      }
      if (selectedTechnologies.length > 0) {
        baseMessage += ` using ${selectedTechnologies.map(techId => TECHNOLOGIES.find(t => t.id === techId)?.name).join(', ')}`;
      }
    }
    baseMessage += `. Actual coverage overlays not yet implemented.`;
    setMapMessage(baseMessage);
  }, [selectedOperators, selectedTechnologies]);


  const handleUseCurrentLocation = () => {
    setCurrentLocationLoading(true);
    setMapMessage("Attempting to get current location...");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newCenter: LatLngExpression = [latitude, longitude];
          setMapCenter(newCenter);
          setMapZoom(13); // Zoom in closer for current location
          setMarkerPosition(newCenter);
          setSearchTerm(`My Location (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`);
          setMapMessage(`Map centered on your current location. Apply filters to see illustrative coverage info.`);
          setCurrentLocationLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setMapMessage("Could not get current location. Please enter manually or check permissions.");
          setCurrentLocationLoading(false);
        }
      );
    } else {
      setMapMessage("Geolocation is not supported by your browser.");
      setCurrentLocationLoading(false);
    }
  };


  return (
    <div className="container mx-auto px-4 py-8 md:px-6 flex flex-col lg:flex-row gap-8">
      {/* Sidebar for Filters and Search */}
      <Card className="w-full lg:w-1/3 lg:max-w-sm shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Settings2 className="mr-2 h-6 w-6 text-primary" />
            Coverage Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <Label htmlFor="location-search" className="font-semibold">Search Location</Label>
              <div className="flex space-x-2 mt-1">
                <Input
                  id="location-search"
                  type="text"
                  placeholder="Pincode, City, Address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-grow"
                />
                <Button type="submit" size="icon" aria-label="Search location" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Search className="h-5 w-5" />
                </Button>
              </div>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full mt-2 text-sm" 
                onClick={handleUseCurrentLocation}
                disabled={currentLocationLoading}
              >
                {currentLocationLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {currentLocationLoading ? "Locating..." : "Use My Current Location"}
              </Button>
            </div>
          </form>

          <div>
            <Label className="font-semibold block mb-2">Select Operators</Label>
            <div className="space-y-2">
              {OPERATORS.map(op => (
                <div key={op.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`op-${op.id}`}
                    checked={selectedOperators.includes(op.id)}
                    onCheckedChange={() => handleOperatorToggle(op.id)}
                  />
                  <Label htmlFor={`op-${op.id}`} className="font-normal cursor-pointer">{op.name}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="font-semibold block mb-2">Select Network Technologies</Label>
            <div className="space-y-2">
              {TECHNOLOGIES.map(tech => (
                <div key={tech.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tech-${tech.id}`}
                    checked={selectedTechnologies.includes(tech.id)}
                    onCheckedChange={() => handleTechnologyToggle(tech.id)}
                  />
                  <Label htmlFor={`tech-${tech.id}`} className="font-normal cursor-pointer">{tech.name}</Label>
                </div>
              ))}
            </div>
          </div>
           <Button onClick={() => handleSearch()} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-4">
            Apply Filters & Update Info
          </Button>
        </CardContent>
      </Card>

      {/* Main Content Area for Map and Legend */}
      <div className="flex-1 space-y-8">
        <header className="text-center lg:text-left">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-3">
            <MapPinned className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Mobile Network Coverage Explorer
          </h1>
          <p className="mt-2 text-muted-foreground md:text-md">
            Visually explore network coverage. Select operators and technologies, then search for a location.
            <br />
            <span className="text-xs">(Basic map integrated. Actual coverage overlays are illustrative and require data integration.)</span>
          </p>
        </header>

        {/* Map Area */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Coverage Map</CardTitle>
             <p className="text-sm text-muted-foreground pt-1">{mapMessage}</p>
          </CardHeader>
          <CardContent>
            <div 
              className="w-full h-[400px] md:h-[500px] bg-muted rounded-md border border-border"
              aria-label="Network coverage map"
            >
              <MapContainer 
                center={mapCenter} 
                zoom={mapZoom} 
                scrollWheelZoom={true} 
                style={{ height: "100%", width: "100%" }}
                whenCreated={(mapInstance) => { mapRef.current = mapInstance; }}
              >
                <ChangeMapView center={mapCenter} zoom={mapZoom} />
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
                {/* Placeholder for future coverage layers */}
              </MapContainer>
            </div>
          </CardContent>
        </Card>

        {/* Legend Placeholder */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Legend (Illustrative)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {selectedOperators.length > 0 && selectedTechnologies.length > 0 ? (
                selectedOperators.map(opId => {
                    const operator = OPERATORS.find(o => o.id === opId);
                    return selectedTechnologies.map(techId => {
                        const technology = TECHNOLOGIES.find(t => t.id === techId);
                        // Simple hash function for a pseudo-random but consistent color per combo
                        const colorVal = (opId.charCodeAt(0) + techId.charCodeAt(0)) % 360; 
                        return (
                            <div key={`${opId}-${techId}`} className="flex items-center">
                                <span className="w-4 h-4 rounded-sm mr-2 border" style={{backgroundColor: `hsl(${colorVal}, 70%, 70%)`}}></span>
                                <span>{operator?.name} - {technology?.name} (Illustrative color)</span>
                            </div>
                        )
                    })
                }).flat() // Flatten the array of arrays
            ) : (
                <p className="text-xs text-muted-foreground">Select operator(s) and technology(s) to see example legend items.</p>
            )}
             { (selectedOperators.length > 0 || selectedTechnologies.length > 0) && selectedOperators.length * selectedTechnologies.length === 0 && (
                <p className="text-xs text-muted-foreground">Please select at least one operator AND one technology to populate the legend.</p>
            )}
          </CardContent>
        </Card>
        
        <Alert className="bg-secondary/20 border-secondary/30">
          <ShieldAlert className="h-5 w-5 text-secondary-foreground" />
          <AlertTitle className="font-semibold text-secondary-foreground">Important Disclaimer</AlertTitle>
          <AlertDescription className="text-sm space-y-1 text-secondary-foreground/80">
            <p>
              Coverage maps provide approximate outdoor coverage. Actual network experience may vary due to factors like terrain, weather, buildings, network congestion, device type, and indoor locations.
            </p>
            <p>
              This map uses OpenStreetMap for base tiles. Actual coverage data for telecom operators is not yet overlaid and requires separate integration. Information presented is for illustrative purposes. Users are advised to verify with operators for critical needs.
            </p>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
