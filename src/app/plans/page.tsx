"use client";

import { useState, useEffect, useCallback } from 'react';
import { getTelecomPlans, TelecomPlan, TelecomPlanFilter } from '@/services/telecom-plans';
import { PlanList } from '@/components/plans/plan-list';
import { FilterBar } from '@/components/plans/filter-bar';
import { Button } from '@/components/ui/button';
import { ArrowRight, Info } from 'lucide-react';
import { PlanComparisonModal } from '@/components/plans/plan-comparison-modal';
import { useSearchParams } from 'next/navigation';

const MAX_COMPARE_PLANS = 4;

export default function PlanDiscoveryPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialOperator = searchParams.get('operator') || undefined;

  const [plans, setPlans] = useState<TelecomPlan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<TelecomPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TelecomPlanFilter>({
    operator: initialOperator,
    minPrice: undefined,
    maxPrice: undefined,
    dataPerDay: undefined,
    validity: undefined,
  });

  const [allOperators, setAllOperators] = useState<string[]>([]);
  const [allDataOptions, setAllDataOptions] = useState<string[]>([]);
  const [allValidityOptions, setAllValidityOptions] = useState<number[]>([]);
  const [maxPricePossible, setMaxPricePossible] = useState<number>(1000); // Default max price

  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const fetchAndProcessPlans = useCallback(async () => {
    setLoading(true);
    try {
      // In a real app, getTelecomPlans might take initial filters based on query if available
      const fetchedPlans = await getTelecomPlans({}); // Fetch all initially to derive filter options
      setPlans(fetchedPlans);

      // Derive filter options from fetched plans
      const operators = [...new Set(fetchedPlans.map(p => p.operator))];
      const dataOptions = [...new Set(fetchedPlans.map(p => p.data.endsWith('/day') ? p.data : 'Other'))].sort(); // Basic sort
      const validityOptions = [...new Set(fetchedPlans.map(p => p.validity))].sort((a, b) => a - b);
      const maxPrice = Math.max(...fetchedPlans.map(p => p.price), 1000);

      setAllOperators(operators);
      setAllDataOptions(dataOptions);
      setAllValidityOptions(validityOptions);
      setMaxPricePossible(maxPrice);
      
      // Apply initial filters from query params
      let currentFilters = { ...filters };
      if (initialOperator) {
        currentFilters.operator = initialOperator;
      }
      // Potentially parse 'initialQuery' here for more complex initial filtering
      // For now, we're just setting the operator

      setFilters(currentFilters); 
      applyFilters(fetchedPlans, currentFilters);

    } catch (error) {
      console.error("Failed to fetch plans:", error);
      // TODO: Add user-facing error message
    } finally {
      setLoading(false);
    }
  }, [initialOperator]); // filters removed from dependency to prevent re-fetch on filter change

  useEffect(() => {
    fetchAndProcessPlans();
  }, [fetchAndProcessPlans]);


  const applyFilters = (plansToFilter: TelecomPlan[], currentFilters: TelecomPlanFilter) => {
    let tempFilteredPlans = [...plansToFilter];

    if (currentFilters.operator) {
      tempFilteredPlans = tempFilteredPlans.filter(plan => plan.operator === currentFilters.operator);
    }
    if (currentFilters.minPrice !== undefined) {
      tempFilteredPlans = tempFilteredPlans.filter(plan => plan.price >= currentFilters.minPrice!);
    }
    if (currentFilters.maxPrice !== undefined) {
      tempFilteredPlans = tempFilteredPlans.filter(plan => plan.price <= currentFilters.maxPrice!);
    }
    if (currentFilters.dataPerDay) {
       // More flexible data matching
      tempFilteredPlans = tempFilteredPlans.filter(plan => {
        if (currentFilters.dataPerDay === 'Other') {
          return !plan.data.endsWith('/day');
        }
        return plan.data.includes(currentFilters.dataPerDay!);
      });
    }
    if (currentFilters.validity !== undefined) {
      tempFilteredPlans = tempFilteredPlans.filter(plan => plan.validity === currentFilters.validity);
    }
    setFilteredPlans(tempFilteredPlans);
  };


  const handleFilterChange = (newFilters: TelecomPlanFilter) => {
    setFilters(newFilters);
    applyFilters(plans, newFilters);
  };

  const handleCompareToggle = (planId: string, isSelected: boolean) => {
    setSelectedForCompare(prev => {
      if (isSelected) {
        if (prev.length < MAX_COMPARE_PLANS) {
          return [...prev, planId];
        }
        // TODO: Show toast notification for max compare limit
        alert(`You can compare up to ${MAX_COMPARE_PLANS} plans.`);
        return prev;
      } else {
        return prev.filter(id => id !== planId);
      }
    });
  };

  const plansToCompare = plans.filter(plan => selectedForCompare.includes(plan.rechargeUrl));

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-2">
        Find Your Perfect Mobile Plan
      </h1>
      <p className="text-muted-foreground mb-8 text-lg">
        Filter and compare prepaid plans from top operators.
      </p>

      <FilterBar
        initialFilters={filters}
        onFilterChange={handleFilterChange}
        allOperators={allOperators}
        allDataOptions={allDataOptions}
        allValidityOptions={allValidityOptions}
        maxPricePossible={maxPricePossible}
      />
      
      {selectedForCompare.length > 0 && (
        <div className="mb-6 p-4 bg-primary/10 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
                <p className="font-semibold text-primary-foreground">
                    {selectedForCompare.length} plan{selectedForCompare.length > 1 ? 's' : ''} selected for comparison.
                </p>
                <p className="text-sm text-primary-foreground/80">
                    You can select up to {MAX_COMPARE_PLANS} plans.
                </p>
            </div>
          <Button 
            onClick={() => setIsCompareModalOpen(true)} 
            disabled={selectedForCompare.length < 2}
            className="bg-accent text-accent-foreground hover:bg-accent/90 group"
          >
            Compare Selected ({selectedForCompare.length})
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      )}

      <PlanList
        plans={filteredPlans}
        loading={loading}
        selectedForCompare={selectedForCompare}
        onCompareToggle={handleCompareToggle}
      />

      <div className="mt-12 p-4 bg-secondary/20 rounded-lg text-center">
        <p className="text-sm text-muted-foreground flex items-center justify-center">
          <Info className="h-4 w-4 mr-2 text-secondary-foreground" />
          Please note: You will be redirected to the operator's official website to complete your recharge. ConnectPlan AI helps you find and compare plans.
        </p>
      </div>
      
      <PlanComparisonModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        plansToCompare={plansToCompare}
      />
    </div>
  );
}
