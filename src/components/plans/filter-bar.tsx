
"use client";

import type { TelecomPlanFilter } from '@/services/telecom-plans';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox'; // Keep for additional features
import { Trash2, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface AdditionalFeatures {
  unlimitedCalls: boolean;
  sms: boolean;
  internationalRoaming: boolean;
}

export interface PriceBracket {
    label: string;
    value?: string; // For 'Any Price'
    min?: number;
    max?: number;
}

interface FilterBarProps {
  filters: TelecomPlanFilter; // Changed from initialFilters
  onFilterChange: (filters: TelecomPlanFilter) => void;
  allOperators: string[];
  allDataOptions: string[];
  allValidityOptions: number[];
  priceBrackets: PriceBracket[];
  additionalFeatures: AdditionalFeatures;
  onAdditionalFeaturesChange: (features: AdditionalFeatures) => void;
}

export function FilterBar({
  filters, // Use current filters
  onFilterChange,
  allOperators,
  allDataOptions,
  allValidityOptions,
  priceBrackets,
  additionalFeatures,
  onAdditionalFeaturesChange,
}: FilterBarProps) {

  const handleChipSelect = (field: keyof TelecomPlanFilter, value: string | number | undefined) => {
    const newFilters = { ...filters, [field]: filters[field] === value ? undefined : value };
    onFilterChange(newFilters);
  };

  const handlePriceBracketSelect = (bracket: PriceBracket) => {
    const isCurrentlySelected = filters.minPrice === bracket.min && filters.maxPrice === bracket.max;
    const newFilters = { 
      ...filters, 
      minPrice: isCurrentlySelected ? undefined : bracket.min, 
      maxPrice: isCurrentlySelected ? undefined : bracket.max 
    };
    onFilterChange(newFilters);
  };

  const handleAdditionalFeatureToggle = (feature: keyof AdditionalFeatures) => {
    const newFeatures = { ...additionalFeatures, [feature]: !additionalFeatures[feature] };
    onAdditionalFeaturesChange(newFeatures);
  };
  
  const resetSpecificFilter = (filterKey: keyof TelecomPlanFilter) => {
    const newFilters = { ...filters, [filterKey]: undefined };
    if (filterKey === 'minPrice' || filterKey === 'maxPrice') {
        newFilters.minPrice = undefined;
        newFilters.maxPrice = undefined;
    }
    onFilterChange(newFilters);
  };


  const resetFilters = () => {
    const defaultFilters: TelecomPlanFilter = { operator: undefined, minPrice: undefined, maxPrice: undefined, dataPerDay: undefined, validity: undefined };
    const defaultAdditionalFeatures: AdditionalFeatures = { unlimitedCalls: false, sms: false, internationalRoaming: false };
    onFilterChange(defaultFilters);
    onAdditionalFeaturesChange(defaultAdditionalFeatures);
  };

  const FilterGroup: React.FC<{ title: string; children: React.ReactNode; onClear?: () => void; hasSelection?: boolean }> = 
    ({ title, children, onClear, hasSelection }) => (
    <div className="space-y-2 border-b border-border pb-4 mb-4">
      <div className="flex justify-between items-center">
        <Label className="text-md font-semibold text-foreground">{title}</Label>
        {onClear && hasSelection && (
            <Button variant="ghost" size="sm" onClick={onClear} className="h-auto p-1 text-xs text-muted-foreground hover:text-destructive">
                <XCircle className="mr-1 h-3 w-3"/> Clear
            </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {children}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 bg-card rounded-lg p-0 sm:p-4"> {/* Removed padding for sheet view */}
      <FilterGroup title="Operator" onClear={() => resetSpecificFilter('operator')} hasSelection={!!filters.operator}>
        <Button
            variant={!filters.operator ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleChipSelect('operator', undefined)}
            className={cn("text-xs h-auto py-1 px-2", !filters.operator && "bg-primary text-primary-foreground")}
        >
            All
        </Button>
        {allOperators.map((op) => (
          <Button
            key={op}
            variant={filters.operator === op ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleChipSelect('operator', op)}
            className={cn("text-xs h-auto py-1 px-2", filters.operator === op && "bg-primary text-primary-foreground")}
          >
            {op}
          </Button>
        ))}
      </FilterGroup>

      <FilterGroup title="Price" onClear={() => {resetSpecificFilter('minPrice'); resetSpecificFilter('maxPrice');}} hasSelection={filters.minPrice !== undefined || filters.maxPrice !== undefined}>
        {priceBrackets.map((bracket) => (
          <Button
            key={bracket.label}
            variant={(filters.minPrice === bracket.min && filters.maxPrice === bracket.max) || (bracket.value === undefined && filters.minPrice === undefined && filters.maxPrice === undefined) ? 'default' : 'outline'}
            size="sm"
            onClick={() => handlePriceBracketSelect(bracket)}
            className={cn("text-xs h-auto py-1 px-2", ((filters.minPrice === bracket.min && filters.maxPrice === bracket.max) || (bracket.value === undefined && filters.minPrice === undefined && filters.maxPrice === undefined)) && "bg-primary text-primary-foreground")}
          >
            {bracket.label}
          </Button>
        ))}
      </FilterGroup>

      <FilterGroup title="Data (Per Day / Bulk)" onClear={() => resetSpecificFilter('dataPerDay')} hasSelection={!!filters.dataPerDay}>
         <Button
            variant={!filters.dataPerDay ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleChipSelect('dataPerDay', undefined)}
            className={cn("text-xs h-auto py-1 px-2", !filters.dataPerDay && "bg-primary text-primary-foreground")}
        >
            Any
        </Button>
        {allDataOptions.map((data) => (
          <Button
            key={data}
            variant={filters.dataPerDay === data ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleChipSelect('dataPerDay', data)}
            className={cn("text-xs h-auto py-1 px-2", filters.dataPerDay === data && "bg-primary text-primary-foreground")}
          >
            {data}
          </Button>
        ))}
      </FilterGroup>

      <FilterGroup title="Validity (Days)" onClear={() => resetSpecificFilter('validity')} hasSelection={filters.validity !== undefined}>
        <Button
            variant={filters.validity === undefined ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleChipSelect('validity', undefined)}
            className={cn("text-xs h-auto py-1 px-2", filters.validity === undefined && "bg-primary text-primary-foreground")}
        >
            Any
        </Button>
        {allValidityOptions.map((days) => (
          <Button
            key={days}
            variant={filters.validity === days ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleChipSelect('validity', days)}
            className={cn("text-xs h-auto py-1 px-2", filters.validity === days && "bg-primary text-primary-foreground")}
          >
            {days} Days
          </Button>
        ))}
      </FilterGroup>
      
      <div className="space-y-2 border-b border-border pb-4 mb-4">
        <Label className="text-md font-semibold text-foreground">Additional Features</Label>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(additionalFeatures) as Array<keyof AdditionalFeatures>).map((key) => (
            <Button
              key={key}
              variant={additionalFeatures[key] ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleAdditionalFeatureToggle(key)}
              className={cn("text-xs h-auto py-1 px-2", additionalFeatures[key] && "bg-primary text-primary-foreground")}
            >
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </Button>
          ))}
        </div>
      </div>
        
      <Button onClick={resetFilters} variant="destructive" className="w-full mt-4 text-sm">
        <Trash2 className="mr-2 h-4 w-4" /> Reset All Filters
      </Button>
    </div>
  );
}
