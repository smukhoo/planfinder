
// src/app/network-coverage/page.tsx
"use client";

import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPinned, Search, ShieldAlert, Wifi, Smartphone, Tower } from 'lucide-react';

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

export default function NetworkCoveragePage() {
  const [selectedOperators, setSelectedOperators] = useState<string[]>([]);
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [mapMessage, setMapMessage] = useState('Select operators and technologies to see coverage. Map functionality is illustrative.');

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real map, this would trigger a geocoding and map pan/zoom
    if (searchTerm) {
        setMapMessage(`Illustrative: Searching for "${searchTerm}" with selected filters. Actual map integration needed.`);
    } else {
        setMapMessage('Select operators and technologies to see coverage. Map functionality is illustrative.');
    }
    console.log('Search term:', searchTerm);
    console.log('Selected Operators:', selectedOperators);
    console.log('Selected Technologies:', selectedTechnologies);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 flex flex-col lg:flex-row gap-8">
      {/* Sidebar for Filters and Search */}
      <Card className="w-full lg:w-1/3 lg:max-w-sm shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Tower className="mr-2 h-6 w-6 text-primary" />
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
              <Button type="button" variant="outline" className="w-full mt-2 text-sm" onClick={() => { /* TODO: Implement current location */ alert("Current location feature not implemented yet."); }}>
                Use My Current Location
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
            <span className="text-xs">(This is a UI placeholder; actual map integration is required.)</span>
          </p>
        </header>

        {/* Map Placeholder */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Coverage Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="w-full h-[400px] md:h-[500px] bg-muted rounded-md flex items-center justify-center border border-dashed border-border"
              aria-label="Network coverage map placeholder"
            >
              <div className="text-center text-muted-foreground p-4">
                <MapPinned className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="font-semibold">Interactive Map Area</p>
                <p className="text-sm mt-1">{mapMessage}</p>
                <p className="text-xs mt-2">A developer will need to integrate a mapping library (e.g., Leaflet, Mapbox, Google Maps) and data sources here.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legend Placeholder */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Legend</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="text-muted-foreground">This section will display the legend for map colors and symbols once the map is integrated.</p>
            {selectedOperators.length > 0 && selectedTechnologies.length > 0 ? (
                selectedOperators.map(opId => {
                    const operator = OPERATORS.find(o => o.id === opId);
                    return selectedTechnologies.map(techId => {
                        const technology = TECHNOLOGIES.find(t => t.id === techId);
                        return (
                            <div key={`${opId}-${techId}`} className="flex items-center">
                                <span className="w-4 h-4 rounded-sm mr-2 border" style={{backgroundColor: `hsl(${Math.random()*360}, 70%, 70%)` /* Random color for demo */}}></span>
                                <span>{operator?.name} - {technology?.name}</span>
                            </div>
                        )
                    })
                })
            ) : (
                <p className="text-xs text-muted-foreground">Select an operator and technology to see example legend items.</p>
            )}
          </CardContent>
        </Card>
        
        <Alert className="bg-secondary/20">
          <ShieldAlert className="h-5 w-5 text-secondary-foreground" />
          <AlertTitle className="font-semibold text-secondary-foreground">Important Disclaimer</AlertTitle>
          <AlertDescription className="text-sm space-y-1 text-secondary-foreground/80">
            <p>
              Coverage maps provide approximate outdoor coverage. Actual network experience may vary due to factors like terrain, weather, buildings, network congestion, device type, and indoor locations.
            </p>
            <p>
              When integrated, data would be sourced from official telecom operator maps or third-party providers and is subject to change. Users are advised to verify with operators for critical needs. ConnectPlan AI is not responsible for the accuracy of the external map data.
            </p>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
