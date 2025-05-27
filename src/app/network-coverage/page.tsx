// src/app/network-coverage/page.tsx
"use client";

import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MapPin, Search, ShieldAlert, Wifi, Smartphone, Settings2, Loader2, LocateFixed } from 'lucide-react';
import type { LatLngExpression } from 'leaflet';

const OPERATORS = [
  { id: 'jio', name: 'Jio', color: 'hsl(var(--chart-1))' },
  { id: 'airtel', name: 'Airtel', color: 'hsl(var(--chart-2))' },
  { id: 'vi', name: 'Vi', color: 'hsl(var(--chart-3))' },
  { id: 'bsnl', name: 'BSNL', color: 'hsl(var(--chart-4))' },
];

const TECHNOLOGIES = [
  { id: '5g', name: '5G', icon: <Wifi className="h-4 w-4" /> },
  { id: '4g', name: '4G/LTE', icon: <Smartphone className="h-4 w-4" /> },
  { id: '3g', name: '3G', icon: <Settings2 className="h-4 w-4" /> }, // Using Settings2 as a placeholder
];

const DynamicMapDisplay = dynamic(() =>
  import('@/components/network-coverage/map-display').then((mod) => mod.MapDisplay),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center bg-muted/50 rounded-lg">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="ml-3 text-muted-foreground">Initializing map...</p>
      </div>
    ),
  }
);

export default function NetworkCoveragePage() {
  const [mapCenter, setMapCenter] = useState<LatLngExpression>([20.5937, 78.9629]); // Default to India
  const [mapZoom, setMapZoom] = useState<number>(5);
  const [markerPosition, setMarkerPosition] = useState<LatLngExpression | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [mapMessage, setMapMessage] = useState('Pan and zoom to explore coverage.');

  const [selectedOperators, setSelectedOperators] = useState<string[]>([]);
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const handleSearch = () => {
    if (!searchTerm) {
      setMapMessage('Please enter a location to search.');
      return;
    }
    // In a real app, use a geocoding service to get lat/lng from searchTerm
    // For now, just update the message and set a mock marker
    const mockLat = 28.6139; // Delhi
    const mockLng = 77.2090;
    setMapCenter([mockLat, mockLng]);
    setMarkerPosition([mockLat, mockLng]);
    setMapZoom(12);
    setMapMessage(`Showing results for "${searchTerm}". Filters: ${selectedOperators.join(', ') || 'All Operators'}, ${selectedTechnologies.join(', ') || 'All Technologies'}`);
  };

  const handleUseCurrentLocation = () => {
    setIsLoadingLocation(true);
    setMapMessage('Fetching your location...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setMapCenter([latitude, longitude]);
        setMarkerPosition([latitude, longitude]);
        setMapZoom(13);
        setMapMessage('Showing your current location.');
        setIsLoadingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        setMapMessage('Could not fetch your location. Please enable location services or search manually.');
        setIsLoadingLocation(false);
      }
    );
  };

  const handleOperatorChange = (operatorId: string, checked: boolean) => {
    setSelectedOperators(prev =>
      checked ? [...prev, operatorId] : prev.filter(id => id !== operatorId)
    );
  };

  const handleTechnologyChange = (techId: string, checked: boolean) => {
    setSelectedTechnologies(prev =>
      checked ? [...prev, techId] : prev.filter(id => id !== techId)
    );
  };

  const legendItems = useMemo(() => {
    if (selectedOperators.length === 0 && selectedTechnologies.length === 0) {
      return [];
    }
    if (selectedOperators.length === 0) {
      return TECHNOLOGIES.filter(tech => selectedTechnologies.includes(tech.id)).map(tech => ({
        name: `All Operators - ${tech.name}`,
        color: 'hsl(var(--muted-foreground))', // Generic color for all operators
        icon: tech.icon,
      }));
    }
    if (selectedTechnologies.length === 0) {
      return OPERATORS.filter(op => selectedOperators.includes(op.id)).map(op => ({
        name: `${op.name} - All Technologies`,
        color: op.color,
        icon: <Smartphone className="h-4 w-4" /> // Generic icon
      }));
    }

    return selectedOperators.flatMap(opId => {
      const operator = OPERATORS.find(op => op.id === opId);
      if (!operator) return [];
      return selectedTechnologies.map(techId => {
        const technology = TECHNOLOGIES.find(tech => tech.id === techId);
        // Simple color variation based on operator and tech index (mock)
        const colorShade = (OPERATORS.findIndex(op => op.id === opId) + TECHNOLOGIES.findIndex(t => t.id === techId)) % 5 + 1;

        return {
          name: `${operator.name} - ${technology?.name || techId}`,
          color: `hsl(var(--chart-${colorShade as 1|2|3|4|5}))`,
          icon: technology?.icon || <Wifi className="h-4 w-4" />,
        };
      });
    });
  }, [selectedOperators, selectedTechnologies]);

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <header className="mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-3">
          <MapPin className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Network Coverage Explorer
        </h1>
        <p className="mt-2 text-muted-foreground md:text-lg">
          Visually check mobile network coverage across India.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Filters and Search Panel */}
        <Card className="lg:col-span-1 shadow-xl h-fit sticky top-24">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <Settings2 className="mr-2 h-6 w-6 text-primary" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="location-search">Search Location</Label>
              <div className="flex gap-2">
                <Input
                  id="location-search"
                  type="text"
                  placeholder="Pincode, City, Address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-grow"
                />
                <Button onClick={handleSearch} aria-label="Search location">
                  <Search className="h-5 w-5" />
                </Button>
              </div>
              <Button
                variant="outline"
                onClick={handleUseCurrentLocation}
                disabled={isLoadingLocation}
                className="w-full mt-2"
              >
                {isLoadingLocation ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <LocateFixed className="mr-2 h-4 w-4" />
                )}
                Use My Current Location
              </Button>
            </div>

            <div className="space-y-3">
              <Label className="text-md font-semibold">Operators</Label>
              {OPERATORS.map(op => (
                <div key={op.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`op-${op.id}`}
                    checked={selectedOperators.includes(op.id)}
                    onCheckedChange={(checked) => handleOperatorChange(op.id, !!checked)}
                  />
                  <Label htmlFor={`op-${op.id}`} className="font-normal cursor-pointer flex items-center">
                     <span className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: op.color }} />
                    {op.name}
                  </Label>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <Label className="text-md font-semibold">Network Technology</Label>
              {TECHNOLOGIES.map(tech => (
                <div key={tech.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tech-${tech.id}`}
                    checked={selectedTechnologies.includes(tech.id)}
                    onCheckedChange={(checked) => handleTechnologyChange(tech.id, !!checked)}
                  />
                  <Label htmlFor={`tech-${tech.id}`} className="font-normal cursor-pointer flex items-center">
                    {React.cloneElement(tech.icon, { className: 'mr-2 h-4 w-4 text-muted-foreground' })}
                    {tech.name}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Map Area */}
        <div className="lg:col-span-2 space-y-4">
            <p className="text-sm text-center text-muted-foreground bg-card p-3 rounded-md shadow">
                {mapMessage}
            </p>
            <div className="h-[600px] w-full bg-muted rounded-lg shadow-inner overflow-hidden relative">
                <DynamicMapDisplay
                    mapCenter={mapCenter}
                    mapZoom={mapZoom}
                    markerPosition={markerPosition}
                    isLoadingLocation={isLoadingLocation}
                />
            </div>
            {legendItems.length > 0 && (
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-lg">Legend</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                        {legendItems.map(item => (
                        <div key={item.name} className="flex items-center">
                            <span className="h-4 w-4 rounded-full mr-2 shrink-0" style={{ backgroundColor: item.color }}></span>
                            {React.cloneElement(item.icon, { className: 'mr-1.5 h-4 w-4 shrink-0 text-muted-foreground' })}
                            <span>{item.name}</span>
                        </div>
                        ))}
                    </CardContent>
                </Card>
            )}
        </div>
      </div>

      <Alert variant="destructive" className="mt-12 bg-secondary/20 border-secondary/50 text-secondary-foreground">
        <ShieldAlert className="h-5 w-5 text-secondary-foreground" />
        <AlertTitle className="font-semibold">Disclaimer</AlertTitle>
        <AlertDescription className="text-sm text-secondary-foreground/80">
          Coverage maps provide approximate outdoor coverage. Actual network experience may vary due to factors like terrain, weather, buildings, network congestion, device type, and indoor locations. Data is illustrative and users are advised to verify with operators for critical needs.
        </AlertDescription>
      </Alert>
    </div>
  );
}
