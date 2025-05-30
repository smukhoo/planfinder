
"use client";

import { useState, useEffect, useCallback } from 'react';
import { getTelecomPlans, type TelecomPlan, type TelecomPlanFilter } from '@/services/telecom-plans';
import { PlanList } from '@/components/plans/plan-list';
import { FilterBar } from '@/components/plans/filter-bar'; // Removed AdditionalFeatures as it's not used here
import { Button } from '@/components/ui/button';
import { PlanComparisonTable } from '@/components/plans/plan-comparison-table';
import { useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, CompareArrows } from 'lucide-react';

const MAX_COMPARE_PLANS = 3;
type Language = 'english' | 'hindi' | 'tamil';

export default function PlanDiscoveryPage() {
  const searchParams = useSearchParams();
  const initialOperator = searchParams.get('operator') || undefined;

  const [allPlans, setAllPlans] = useState<TelecomPlan[]>([]);
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
  
  const priceBrackets = [
    { label: "Any Price", value: undefined, min: undefined, max: undefined },
    { label: "Under ₹200", min: 0, max: 199 },
    { label: "₹200 - ₹399", min: 200, max: 399 },
    { label: "₹400 - ₹699", min: 400, max: 699 },
    { label: "₹700 & Above", min: 700, max: undefined },
  ];

  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('english');

  const fetchAndProcessPlans = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedPlans = await getTelecomPlans({}); // Fetch all initially
      setAllPlans(fetchedPlans);

      const operators = [...new Set(fetchedPlans.map(p => p.operator))].sort();
      const dataOptionsSet = new Set<string>();
      fetchedPlans.forEach(p => {
        if (p.data?.toLowerCase().includes('/day')) {
          dataOptionsSet.add(p.data.split('/')[0].trim() + '/day');
        } else if (p.data && p.data.toLowerCase() !== "n/a" && p.data.trim() !== "") {
          dataOptionsSet.add('Other');
        }
      });
      const dataOptions = Array.from(dataOptionsSet).sort((a,b) => {
        if (a === 'Other') return 1;
        if (b === 'Other') return -1;
        const numA = parseFloat(a);
        const numB = parseFloat(b);
        if (isNaN(numA) && isNaN(numB)) return a.localeCompare(b);
        if (isNaN(numA)) return 1;
        if (isNaN(numB)) return -1;
        return numA - numB;
      });

      const validityOptions = [...new Set(fetchedPlans.map(p => p.validity))].filter(v => v > 0).sort((a, b) => a - b);
      
      setAllOperators(operators);
      setAllDataOptions(dataOptions);
      setAllValidityOptions(validityOptions);

      let currentFilters = { ...filters };
      if (initialOperator && !currentFilters.operator) {
        currentFilters.operator = initialOperator;
        setFilters(currentFilters); 
      }
    } catch (error) {
      console.error("Failed to fetch plans:", error);
    } finally {
      setLoading(false);
    }
  }, [initialOperator]); // Removed filters to prevent loops

  const performFiltering = useCallback((
    plansToFilter: TelecomPlan[],
    currentFilters: TelecomPlanFilter
  ): TelecomPlan[] => {
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
      const dataPerDayLower = currentFilters.dataPerDay.toLowerCase();
      if (dataPerDayLower === 'other') {
        tempFilteredPlans = tempFilteredPlans.filter(plan => plan.data && !plan.data.toLowerCase().includes('/day'));
      } else {
        const dataAmount = dataPerDayLower.replace('/day','').trim();
        tempFilteredPlans = tempFilteredPlans.filter(plan => plan.data && plan.data.toLowerCase().startsWith(dataAmount));
      }
    }
    if (currentFilters.validity !== undefined) {
      tempFilteredPlans = tempFilteredPlans.filter(plan => plan.validity === currentFilters.validity);
    }
    return tempFilteredPlans;
  }, []);


  useEffect(() => {
    fetchAndProcessPlans();
  }, [fetchAndProcessPlans]);
  
  useEffect(() => {
    const newFiltered = performFiltering(allPlans, filters);
    setFilteredPlans(newFiltered);
    setSelectedForCompare([]);
  }, [allPlans, filters, performFiltering]);


  const handleFilterChange = (newFilters: TelecomPlanFilter) => {
    setFilters(newFilters);
  };

  const handlePlanSelectionForCompare = (planId: string) => {
    setSelectedForCompare(prev => {
      if (prev.includes(planId)) {
        return prev.filter(id => id !== planId);
      } else {
        if (prev.length < MAX_COMPARE_PLANS) {
          return [...prev, planId];
        }
        alert(\`You can compare up to \${MAX_COMPARE_PLANS} plans.\`);
        return prev;
      }
    });
  };

  const plansToCompare = allPlans.filter(plan => selectedForCompare.includes(plan.id || plan.rechargeUrl));

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 space-y-6 sticky top-24 h-fit">
          <h2 className="text-2xl font-semibold text-foreground">Filters</h2>
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            allOperators={allOperators}
            allDataOptions={allDataOptions}
            allValidityOptions={allValidityOptions}
            priceBrackets={priceBrackets}
          />
        </aside>

        <main className="lg:col-span-3">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Recharge Plans
              </h1>
              <p className="text-muted-foreground text-base">
                Find the perfect prepaid plan for your needs.
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
               <Select defaultValue="popularity">
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="validity-desc">Validity: High to Low</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                disabled={selectedForCompare.length < 1}
                className="border-primary text-primary hover:bg-primary/10 hover:text-primary"
                onClick={() => {
                    if (selectedForCompare.length > 0) {
                         // Logic to scroll to comparison table or open modal if re-added
                        const comparisonTable = document.getElementById('plan-comparison-table');
                        comparisonTable?.scrollIntoView({ behavior: 'smooth' });
                    } else {
                        alert("Please select at least one plan to compare.");
                    }
                }}
              >
                <CompareArrows className="mr-2 h-4 w-4" />
                Compare ({selectedForCompare.length})
              </Button>
            </div>
          </div>

          <Tabs defaultValue="english" className="mb-6" onValueChange={(value) => setCurrentLanguage(value as Language)}>
            <TabsList className="grid w-full grid-cols-3 sm:w-auto sm:inline-flex">
              <TabsTrigger value="english">English</TabsTrigger>
              <TabsTrigger value="hindi">Hindi</TabsTrigger>
              <TabsTrigger value="tamil">Tamil</TabsTrigger>
            </TabsList>
          </Tabs>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <PlanList
                plans={filteredPlans} // Show all filtered plans
                loading={loading}
                selectedForCompare={selectedForCompare}
                onPlanSelect={handlePlanSelectionForCompare}
                currentLanguage={currentLanguage}
              />
            </>
          )}
          
          {filteredPlans.length > 0 && plansToCompare.length > 0 && (
            <div id="plan-comparison-table" className="mt-12">
              <PlanComparisonTable plansToCompare={plansToCompare} currentLanguage={currentLanguage} />
            </div>
          )}
          {filteredPlans.length > 0 && plansToCompare.length === 0 && selectedForCompare.length > 0 && (
             <div id="plan-comparison-table" className="mt-12 text-center text-muted-foreground">
                Select valid plans to compare. Some selected plans might have been filtered out.
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
