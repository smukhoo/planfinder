
// src/app/network-coverage/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPinned, Search, ShieldAlert, Wifi, Smartphone, Settings2 } from 'lucide-react';

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
  const [mapMessage, setMapMessage] = useState('Select operators, technologies, and search for a location to see illustrative coverage information. Map functionality is a placeholder.');
  const [currentLocationLoading, setCurrentLocationLoading] = useState(false);

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
    let message = 'Illustrative: ';
    if (searchTerm) {
      message += `Searching for "${searchTerm}"`;
    } else {
      message += `Displaying general coverage`;
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
    message += `. Actual map integration needed.`;
    setMapMessage(message);
    console.log('Search term:', searchTerm);
    console.log('Selected Operators:', selectedOperators);
    console.log('Selected Technologies:', selectedTechnologies);
  };
  
  // Update message when filters change without an explicit search submission
  useEffect(() => {
    if (!searchTerm) { // Only update if no active search term to avoid overwriting search-specific messages
      let baseMessage = "Select operators, technologies, and optionally search for a location.";
      if (selectedOperators.length > 0 || selectedTechnologies.length > 0) {
        baseMessage = `Illustrative: Viewing coverage for`;
        if (selectedOperators.length > 0) {
          baseMessage += ` ${selectedOperators.map(opId => OPERATORS.find(o => o.id === opId)?.name).join(', ')}`;
        }
        if (selectedTechnologies.length > 0) {
          baseMessage += ` using ${selectedTechnologies.map(techId => TECHNOLOGIES.find(t => t.id === techId)?.name).join(', ')}`;
        }
        baseMessage += `. Map functionality is a placeholder.`;
      }
      setMapMessage(baseMessage);
    }
  }, [selectedOperators, selectedTechnologies, searchTerm]);


  const handleUseCurrentLocation = () => {
    setCurrentLocationLoading(true);
    setMapMessage("Attempting to get current location...");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // In a real app, you'd use these coords. For now, mock a search term.
          setSearchTerm(`Coords: ${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
          setMapMessage(`Illustrative: Current location identified. Search for "${searchTerm}" or apply filters. Actual map integration needed.`);
          setCurrentLocationLoading(false);
           // Automatically trigger search with new "coordinates"
          handleSearch(); 
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
            Apply Filters & View Map
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
              className="w-full h-[400px] md:h-[500px] bg-muted rounded-md flex flex-col items-center justify-center border border-dashed border-border p-4"
              aria-label="Network coverage map placeholder"
            >
              <MapPinned className="h-16 w-16 mx-auto mb-4 opacity-50 text-primary" />
              <p className="font-semibold text-lg text-foreground">Interactive Map Area</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-md text-center">{mapMessage}</p>
              
              {(selectedOperators.length > 0 || selectedTechnologies.length > 0) && (
                <div className="mt-4 text-xs border-t border-border/50 pt-3 w-full max-w-sm text-left space-y-1 bg-background/50 p-3 rounded-md">
                  <p className="font-medium text-foreground mb-1">Illustrative Coverage Layers Applied:</p>
                  {selectedOperators.map(opId => {
                    const operator = OPERATORS.find(o => o.id === opId);
                    return (
                      <div key={opId}>
                        <span className="font-semibold text-primary">{operator?.name}: </span>
                        <span className="text-muted-foreground">
                            {selectedTechnologies.length > 0 
                                ? selectedTechnologies.map(techId => TECHNOLOGIES.find(t => t.id === techId)?.name).join(', ')
                                : "All selected technologies"
                            }
                        </span>
                      </div>
                    );
                  })}
                  {selectedOperators.length === 0 && selectedTechnologies.length > 0 && (
                     <div>
                        <span className="font-semibold text-primary">All Selected Operators: </span>
                        <span className="text-muted-foreground">
                            {selectedTechnologies.map(techId => TECHNOLOGIES.find(t => t.id === techId)?.name).join(', ')}
                        </span>
                      </div>
                  )}
                </div>
              )}
              <p className="text-xs text-muted-foreground/70 mt-4">A developer will integrate a mapping library and data sources here.</p>
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
                                <span>{operator?.name} - {technology?.name}</span>
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
              When integrated, data would be sourced from official telecom operator maps or third-party providers and is subject to change. Users are advised to verify with operators for critical needs. ConnectPlan AI is not responsible for the accuracy of the external map data.
            </p>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}

