
"use client";

import type { TelecomPlanFilter } from '@/services/telecom-plans';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Trash2 } from 'lucide-react';

export interface PriceBracket {
    label: string;
    value?: string; 
    min?: number;
    max?: number;
}

interface FilterBarProps {
  filters: TelecomPlanFilter;
  onFilterChange: (filters: TelecomPlanFilter) => void;
  allOperators: string[];
  allDataOptions: string[];
  allValidityOptions: number[];
  priceBrackets: PriceBracket[];
}

export function FilterBar({
  filters,
  onFilterChange,
  allOperators,
  allDataOptions,
  allValidityOptions,
  priceBrackets,
}: FilterBarProps) {

  const handleOperatorChange = (value: string) => {
    onFilterChange({ ...filters, operator: value === 'all' ? undefined : value });
  };

  const handlePriceChange = (value: string) => {
    const selectedBracket = priceBrackets.find(bracket => 
      (bracket.value === value && value !== undefined) || // For "Any Price" if its value is not undefined
      (bracket.min?.toString() === value.split('-')[0] && bracket.max?.toString() === value.split('-')[1]) || // For ranges
      (bracket.label.toLowerCase().includes("under") && value.includes(bracket.max?.toString() || '')) ||
      (bracket.label.toLowerCase().includes("above") && value.includes(bracket.min?.toString() || ''))
    );

    if (selectedBracket) {
      if (selectedBracket.value === undefined && selectedBracket.label === "Any Price") { // Specifically "Any Price"
        onFilterChange({ ...filters, minPrice: undefined, maxPrice: undefined });
      } else {
        onFilterChange({ ...filters, minPrice: selectedBracket.min, maxPrice: selectedBracket.max });
      }
    }
  };


  const handleDataChange = (value: string) => {
    onFilterChange({ ...filters, dataPerDay: value === 'any' ? undefined : value });
  };

  const handleValidityChange = (value: string) => {
    onFilterChange({ ...filters, validity: value === 'any' ? undefined : parseInt(value, 10) || undefined });
  };
  
  const resetFilters = () => {
    const defaultFilters: TelecomPlanFilter = { operator: undefined, minPrice: undefined, maxPrice: undefined, dataPerDay: undefined, validity: undefined };
    onFilterChange(defaultFilters);
  };

  const getPriceBracketValue = (min?: number, max?: number): string => {
    if (min === undefined && max === undefined) return "any"; // Default to "Any Price"
    const found = priceBrackets.find(b => b.min === min && b.max === max);
    if (found && found.value) return found.value;
    if (found) return `${found.min || '0'}-${found.max || 'Infinity'}`; // Fallback if value is not set
    return "custom"; // Fallback for custom ranges not in brackets
  };


  return (
    <div className="space-y-6 bg-card rounded-lg p-4 shadow">
      <div className="space-y-2">
        <Label htmlFor="operator-filter">Operator</Label>
        <Select 
          value={filters.operator || 'all'} 
          onValueChange={handleOperatorChange}
        >
          <SelectTrigger id="operator-filter">
            <SelectValue placeholder="Select Operator" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Operators</SelectItem>
            {allOperators.map(op => (
              <SelectItem key={op} value={op}>{op}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="price-filter">Price Range</Label>
        <Select 
            value={getPriceBracketValue(filters.minPrice, filters.maxPrice)}
            onValueChange={handlePriceChange}
        >
          <SelectTrigger id="price-filter">
            <SelectValue placeholder="Select Price Range" />
          </SelectTrigger>
          <SelectContent>
            {priceBrackets.map(bracket => (
              <SelectItem 
                key={bracket.label} 
                value={bracket.value !== undefined ? bracket.value : `${bracket.min || '0'}-${bracket.max || 'Infinity'}`}
              >
                {bracket.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="data-filter">Data (Per Day / Bulk)</Label>
        <Select 
          value={filters.dataPerDay || 'any'} 
          onValueChange={handleDataChange}
        >
          <SelectTrigger id="data-filter">
            <SelectValue placeholder="Select Data Amount" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any Data</SelectItem>
            {allDataOptions.map(data => (
              <SelectItem key={data} value={data}>{data}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="validity-filter">Validity (Days)</Label>
        <Select 
            value={filters.validity?.toString() || 'any'} 
            onValueChange={handleValidityChange}
        >
          <SelectTrigger id="validity-filter">
            <SelectValue placeholder="Select Validity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any Validity</SelectItem>
            {allValidityOptions.map(days => (
              <SelectItem key={days} value={days.toString()}>{days} Days</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
        
      <Button onClick={resetFilters} variant="destructive" className="w-full text-sm">
        <Trash2 className="mr-2 h-4 w-4" /> Reset All Filters
      </Button>
    </div>
  );
}

