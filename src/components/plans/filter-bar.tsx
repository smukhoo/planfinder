
"use client";

import type { TelecomPlanFilter } from '@/services/telecom-plans';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export interface AdditionalFeatures {
  unlimitedCalls: boolean;
  sms: boolean;
  internationalRoaming: boolean;
}

interface FilterBarProps {
  initialFilters: TelecomPlanFilter;
  onFilterChange: (filters: TelecomPlanFilter) => void;
  allOperators: string[];
  allDataOptions: string[];
  allValidityOptions: number[];
  maxPricePossible: number;
  additionalFeatures: AdditionalFeatures;
  onAdditionalFeaturesChange: (features: AdditionalFeatures) => void;
}

const priceBrackets = [
  { label: "Any Price", value: undefined },
  { label: "Under ₹200", max: 199 },
  { label: "₹200 - ₹399", min: 200, max: 399 },
  { label: "₹400 - ₹699", min: 400, max: 699 },
  { label: "₹700 & Above", min: 700 },
];

export function FilterBar({
  initialFilters,
  onFilterChange,
  allOperators,
  allDataOptions,
  allValidityOptions,
  maxPricePossible,
  additionalFeatures,
  onAdditionalFeaturesChange,
}: FilterBarProps) {
  const [currentFilters, setCurrentFilters] = useState<TelecomPlanFilter>(initialFilters);
  const [currentPriceRange, setCurrentPriceRange] = useState<[number, number]>([initialFilters.minPrice || 0, initialFilters.maxPrice || maxPricePossible]);
  const [currentAdditionalFeatures, setCurrentAdditionalFeatures] = useState<AdditionalFeatures>(additionalFeatures);

  useEffect(() => {
    setCurrentFilters(initialFilters);
    setCurrentPriceRange([initialFilters.minPrice || 0, initialFilters.maxPrice || maxPricePossible]);
  }, [initialFilters, maxPricePossible]);

  useEffect(() => {
    setCurrentAdditionalFeatures(additionalFeatures);
  }, [additionalFeatures]);

  const handleInputChange = (field: keyof TelecomPlanFilter, value: string | number | undefined) => {
    const newFilters = { ...currentFilters, [field]: value === 'all' || value === '' ? undefined : value };
    setCurrentFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceRangeCommit = (value: [number, number]) => {
    const newFilters = { ...currentFilters, minPrice: value[0], maxPrice: value[1] };
    setCurrentFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const handlePriceBracketChange = (selectedBracketValue: string) => {
    const selectedBracket = priceBrackets.find(b => b.label === selectedBracketValue);
    let newMinPrice: number | undefined = undefined;
    let newMaxPrice: number | undefined = undefined;

    if (selectedBracket && selectedBracket.value !== undefined) {
        newMinPrice = selectedBracket.min;
        newMaxPrice = selectedBracket.max;
    }
    
    const newFilters = { ...currentFilters, minPrice: newMinPrice, maxPrice: newMaxPrice };
    setCurrentFilters(newFilters);
    setCurrentPriceRange([newMinPrice ?? 0, newMaxPrice ?? maxPricePossible]);
    onFilterChange(newFilters);
  };

  const handleAdditionalFeatureChange = (feature: keyof AdditionalFeatures, checked: boolean) => {
    const newFeatures = { ...currentAdditionalFeatures, [feature]: checked };
    setCurrentAdditionalFeatures(newFeatures);
    onAdditionalFeaturesChange(newFeatures);
  };

  const resetFilters = () => {
    const defaultFilters: TelecomPlanFilter = { operator: undefined, minPrice: undefined, maxPrice: undefined, dataPerDay: undefined, validity: undefined };
    const defaultAdditionalFeatures: AdditionalFeatures = { unlimitedCalls: false, sms: false, internationalRoaming: false };
    setCurrentFilters(defaultFilters);
    setCurrentPriceRange([0, maxPricePossible]);
    setCurrentAdditionalFeatures(defaultAdditionalFeatures);
    onFilterChange(defaultFilters);
    onAdditionalFeaturesChange(defaultAdditionalFeatures);
  };

  return (
    <div className="space-y-6 p-4 bg-card rounded-lg shadow-sm">
      <div>
        <Label htmlFor="operator" className="text-sm font-medium">Operator</Label>
        <Select
          value={currentFilters.operator || 'all'}
          onValueChange={(value) => handleInputChange('operator', value)}
        >
          <SelectTrigger id="operator" className="mt-1 w-full">
            <SelectValue placeholder="All Operators" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Operators</SelectItem>
            {allOperators.map((op) => (
              <SelectItem key={op} value={op}>{op}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="priceBracket" className="text-sm font-medium">Price</Label>
         <Select
            value={priceBrackets.find(b => b.min === currentFilters.minPrice && b.max === currentFilters.maxPrice)?.label || "Any Price"}
            onValueChange={handlePriceBracketChange}
        >
            <SelectTrigger id="priceBracket" className="mt-1 w-full">
                <SelectValue placeholder="Any Price" />
            </SelectTrigger>
            <SelectContent>
                {priceBrackets.map((bracket) => (
                    <SelectItem key={bracket.label} value={bracket.label}>
                        {bracket.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
        {(currentFilters.minPrice === undefined && currentFilters.maxPrice === undefined) && (
             <div className="mt-3">
                <Slider
                    min={0}
                    max={maxPricePossible}
                    step={10}
                    value={currentPriceRange}
                    onValueChange={setCurrentPriceRange} // Update slider visually
                    onValueCommit={handlePriceRangeCommit} // Apply filter on commit
                    className="mt-1"
                    aria-label="Price range slider"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>₹{currentPriceRange[0]}</span>
                    <span>₹{currentPriceRange[1]}</span>
                </div>
            </div>
        )}
      </div>

      <div>
        <Label htmlFor="dataPerDay" className="text-sm font-medium">Data (GB)</Label>
        <Select
          value={currentFilters.dataPerDay || 'all'}
          onValueChange={(value) => handleInputChange('dataPerDay', value)}
        >
          <SelectTrigger id="dataPerDay" className="mt-1 w-full">
            <SelectValue placeholder="Any Data" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Data</SelectItem>
            {allDataOptions.map((data) => (
              <SelectItem key={data} value={data}>{data}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="validity" className="text-sm font-medium">Validity (Days)</Label>
        <Select
          value={currentFilters.validity?.toString() || 'all'}
          onValueChange={(value) => handleInputChange('validity', value === 'all' ? undefined : Number(value))}
        >
          <SelectTrigger id="validity" className="mt-1 w-full">
            <SelectValue placeholder="Any Validity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Validity</SelectItem>
            {allValidityOptions.map((days) => (
              <SelectItem key={days} value={days.toString()}>{days} Days</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-medium">Additional Features</Label>
        <div className="mt-2 space-y-2">
          {Object.keys(additionalFeatures).map((key) => (
            <div key={key} className="flex items-center space-x-2">
              <Checkbox
                id={`feature-${key}`}
                checked={currentAdditionalFeatures[key as keyof AdditionalFeatures]}
                onCheckedChange={(checked) => handleAdditionalFeatureChange(key as keyof AdditionalFeatures, !!checked)}
              />
              <Label htmlFor={`feature-${key}`} className="font-normal text-sm">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} 
              </Label>
            </div>
          ))}
        </div>
      </div>
        
      <Button onClick={resetFilters} variant="outline" className="w-full mt-4">
        <Trash2 className="mr-2 h-4 w-4" /> Reset All Filters
      </Button>
    </div>
  );
}

    