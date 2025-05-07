"use client";

import type { TelecomPlanFilter } from '@/services/telecom-plans';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Trash2, Search } from 'lucide-react';
import { useState, useEffect } from 'react';

interface FilterBarProps {
  initialFilters: TelecomPlanFilter;
  onFilterChange: (filters: TelecomPlanFilter) => void;
  allOperators: string[];
  allDataOptions: string[];
  allValidityOptions: number[];
  maxPricePossible: number;
}

const priceBrackets = [
  { label: "Any", value: undefined },
  { label: "Under ₹200", max: 200 },
  { label: "₹200 - ₹400", min: 200, max: 400 },
  { label: "₹400 - ₹700", min: 400, max: 700 },
  { label: "Above ₹700", min: 700 },
];


export function FilterBar({
  initialFilters,
  onFilterChange,
  allOperators,
  allDataOptions,
  allValidityOptions,
  maxPricePossible,
}: FilterBarProps) {
  const [filters, setFilters] = useState<TelecomPlanFilter>(initialFilters);
  const [priceRange, setPriceRange] = useState<[number, number]>([initialFilters.minPrice || 0, initialFilters.maxPrice || maxPricePossible]);

  useEffect(() => {
    setFilters(initialFilters);
    setPriceRange([initialFilters.minPrice || 0, initialFilters.maxPrice || maxPricePossible]);
  }, [initialFilters, maxPricePossible]);

  const handleInputChange = (field: keyof TelecomPlanFilter, value: string | number | undefined) => {
    const newFilters = { ...filters, [field]: value === 'all' || value === '' ? undefined : value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceRangeChange = (value: [number, number]) => {
    setPriceRange(value);
    const newFilters = { ...filters, minPrice: value[0], maxPrice: value[1] };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const handlePriceBracketChange = (selectedBracketValue: string | undefined) => {
    if (selectedBracketValue === undefined) { // "Any" selected
        const newFilters = { ...filters, minPrice: undefined, maxPrice: undefined };
        setFilters(newFilters);
        setPriceRange([0, maxPricePossible]);
        onFilterChange(newFilters);
        return;
    }
    const selectedBracket = priceBrackets.find(b => (b.min?.toString() ?? '0') + '-' + (b.max?.toString() ?? maxPricePossible.toString()) === selectedBracketValue);

    if (selectedBracket) {
        const newMinPrice = selectedBracket.min;
        const newMaxPrice = selectedBracket.max;
        const newFilters = { ...filters, minPrice: newMinPrice, maxPrice: newMaxPrice };
        setFilters(newFilters);
        setPriceRange([newMinPrice ?? 0, newMaxPrice ?? maxPricePossible]);
        onFilterChange(newFilters);
    }
  };


  const resetFilters = () => {
    const defaultFilters = { operator: undefined, minPrice: undefined, maxPrice: undefined, dataPerDay: undefined, validity: undefined };
    setFilters(defaultFilters);
    setPriceRange([0, maxPricePossible]);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="mb-8 p-6 bg-card rounded-xl shadow-lg space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 items-end">
        {/* Operator Filter */}
        <div>
          <Label htmlFor="operator" className="text-sm font-medium">Operator</Label>
          <Select
            value={filters.operator || 'all'}
            onValueChange={(value) => handleInputChange('operator', value)}
          >
            <SelectTrigger id="operator" className="mt-1">
              <SelectValue placeholder="Select Operator" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Operators</SelectItem>
              {allOperators.map((op) => (
                <SelectItem key={op} value={op}>{op}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Bracket Filter */}
        <div>
            <Label htmlFor="priceBracket" className="text-sm font-medium">Price Range</Label>
            <Select
                value={(filters.minPrice?.toString() ?? '0') + '-' + (filters.maxPrice?.toString() ?? maxPricePossible.toString())}
                onValueChange={handlePriceBracketChange}
            >
                <SelectTrigger id="priceBracket" className="mt-1">
                    <SelectValue placeholder="Select Price Range" />
                </SelectTrigger>
                <SelectContent>
                    {priceBrackets.map((bracket) => (
                        <SelectItem key={bracket.label} value={bracket.value === undefined ? undefined : (bracket.min?.toString() ?? '0') + '-' + (bracket.max?.toString() ?? maxPricePossible.toString())}>
                            {bracket.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>


        {/* Data per Day Filter */}
        <div>
          <Label htmlFor="dataPerDay" className="text-sm font-medium">Data per Day</Label>
          <Select
            value={filters.dataPerDay || 'all'}
            onValueChange={(value) => handleInputChange('dataPerDay', value)}
          >
            <SelectTrigger id="dataPerDay" className="mt-1">
              <SelectValue placeholder="Select Data" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Data</SelectItem>
              {allDataOptions.map((data) => (
                <SelectItem key={data} value={data}>{data}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Validity Filter */}
        <div>
          <Label htmlFor="validity" className="text-sm font-medium">Validity (Days)</Label>
          <Select
            value={filters.validity?.toString() || 'all'}
            onValueChange={(value) => handleInputChange('validity', value === 'all' ? undefined : Number(value))}
          >
            <SelectTrigger id="validity" className="mt-1">
              <SelectValue placeholder="Select Validity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Validity</SelectItem>
              {allValidityOptions.map((days) => (
                <SelectItem key={days} value={days.toString()}>{days} Days</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Reset Button */}
        <div className="lg:col-span-1 flex justify-end">
            <Button onClick={resetFilters} variant="outline" className="w-full lg:w-auto">
                <Trash2 className="mr-2 h-4 w-4" /> Reset Filters
            </Button>
        </div>
      </div>
      
      {/* Price Range Slider (Optional: show only if "Any" price bracket is selected or specific logic) */}
      {(filters.minPrice === undefined && filters.maxPrice === undefined) && (
        <div className="pt-4">
          <Label className="text-sm font-medium">Adjust Price (₹{priceRange[0]} - ₹{priceRange[1]})</Label>
          <Slider
            min={0}
            max={maxPricePossible}
            step={10}
            value={priceRange}
            onValueChange={handlePriceRangeChange}
            className="mt-2"
            aria-label="Price range slider"
          />
        </div>
      )}

    </div>
  );
}
