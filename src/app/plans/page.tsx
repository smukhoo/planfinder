
"use client";

import { useState, useEffect, useCallback } from 'react';
import { getTelecomPlans, type TelecomPlan, type TelecomPlanFilter } from '@/services/telecom-plans';
import { PlanList } from '@/components/plans/plan-list';
import { FilterBar, type AdditionalFeatures } from '@/components/plans/filter-bar';
import { Button } from '@/components/ui/button';
import { PlanComparisonTable } from '@/components/plans/plan-comparison-table';
import { useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Loader2, CompareArrows } from 'lucide-react';
import { PaginationControls } from '@/components/plans/pagination-controls';

const MAX_COMPARE_PLANS = 3;
const PLANS_PER_PAGE = 5;
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
  const [additionalFeatures, setAdditionalFeatures] = useState<AdditionalFeatures>({
    unlimitedCalls: false,
    sms: false,
    internationalRoaming: false,
  });

  const [allOperators, setAllOperators] = useState<string[]>([]);
  const [allDataOptions, setAllDataOptions] = useState<string[]>([]);
  const [allValidityOptions, setAllValidityOptions] = useState<number[]>([]);
  const [maxPricePossible, setMaxPricePossible] = useState<number>(1000);

  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('english');
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchAndProcessPlans = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedPlans = await getTelecomPlans({}); // Fetch all initially
      setAllPlans(fetchedPlans);

      const operators = [...new Set(fetchedPlans.map(p => p.operator))].sort();
      const dataOptions = [...new Set(fetchedPlans.map(p => p.data.includes('/') ? p.data.split('/')[0].trim() + '/day' : 'Other'))].sort();
      const validityOptions = [...new Set(fetchedPlans.map(p => p.validity))].sort((a, b) => a - b);
      const maxPrice = Math.max(...fetchedPlans.map(p => p.price), 1000);

      setAllOperators(operators);
      setAllDataOptions(dataOptions.filter(d => d !== 'Other').concat(['Other']));
      setAllValidityOptions(validityOptions);
      setMaxPricePossible(maxPrice);

      let currentFilters = { ...filters };
      if (initialOperator && !currentFilters.operator) {
        currentFilters.operator = initialOperator;
        setFilters(currentFilters);
      }
      applyFilters(fetchedPlans, currentFilters, additionalFeatures);

    } catch (error) {
      console.error("Failed to fetch plans:", error);
    } finally {
      setLoading(false);
    }
  }, [initialOperator]); // Removed filters and additionalFeatures to prevent re-fetch loop, applyFilters handles their changes

  useEffect(() => {
    fetchAndProcessPlans();
  }, [fetchAndProcessPlans]);
  
  useEffect(() => {
    // Apply filters whenever filters or additionalFeatures change
    applyFilters(allPlans, filters, additionalFeatures);
  }, [filters, additionalFeatures, allPlans]);


  const applyFilters = (plansToFilter: TelecomPlan[], currentFilters: TelecomPlanFilter, currentAdditionalFeatures: AdditionalFeatures) => {
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
       if (currentFilters.dataPerDay === 'Other') {
         tempFilteredPlans = tempFilteredPlans.filter(plan => !plan.data.toLowerCase().includes('/day'));
       } else {
         tempFilteredPlans = tempFilteredPlans.filter(plan => plan.data.toLowerCase().startsWith(currentFilters.dataPerDay!.toLowerCase().replace('/day','')));
       }
    }
    if (currentFilters.validity !== undefined) {
      tempFilteredPlans = tempFilteredPlans.filter(plan => plan.validity === currentFilters.validity);
    }

    if (currentAdditionalFeatures.unlimitedCalls) {
        tempFilteredPlans = tempFilteredPlans.filter(plan => plan.talktime && plan.talktime.toLowerCase().includes('unlimited'));
    }
    if (currentAdditionalFeatures.sms) {
        tempFilteredPlans = tempFilteredPlans.filter(plan => plan.sms && (parseInt(plan.sms) > 0 || plan.sms.toLowerCase().includes('unlimited') || plan.sms.toLowerCase().includes('/day')) );
    }
    if (currentAdditionalFeatures.internationalRoaming) {
        tempFilteredPlans = tempFilteredPlans.filter(plan => plan.additionalBenefits?.some(b => b.toLowerCase().includes('roaming')));
    }

    setFilteredPlans(tempFilteredPlans);
    setSelectedForCompare([]); 
    setIsCompareModalOpen(false);
    setCurrentPage(1); // Reset to page 1 on filter change
  };

  const handleFilterChange = (newFilters: TelecomPlanFilter) => {
    setFilters(newFilters);
    // applyFilters(allPlans, newFilters, additionalFeatures); // applyFilters is now called by useEffect
  };

  const handleAdditionalFeaturesChange = (newAdditionalFeatures: AdditionalFeatures) => {
    setAdditionalFeatures(newAdditionalFeatures);
    // applyFilters(allPlans, filters, newAdditionalFeatures); // applyFilters is now called by useEffect
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

  // Pagination logic
  const totalPages = Math.ceil(filteredPlans.length / PLANS_PER_PAGE);
  const startIndex = (currentPage - 1) * PLANS_PER_PAGE;
  const endIndex = startIndex + PLANS_PER_PAGE;
  const currentPlansToDisplay = filteredPlans.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <h2 className="text-2xl font-semibold mb-6 text-foreground">Filters</h2>
          <FilterBar
            initialFilters={filters}
            onFilterChange={handleFilterChange}
            allOperators={allOperators}
            allDataOptions={allDataOptions}
            allValidityOptions={allValidityOptions}
            maxPricePossible={maxPricePossible}
            additionalFeatures={additionalFeatures}
            onAdditionalFeaturesChange={handleAdditionalFeaturesChange}
          />
        </div>

        <div className="lg:col-span-3">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Recharge Plans
              </h1>
              <p className="text-muted-foreground text-base">
                Find the perfect prepaid plan for your needs.
              </p>
            </div>
            <div className="flex items-center gap-4">
               <Select defaultValue="popularity">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="validity-desc">Validity: High to Low</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={isCompareModalOpen} onOpenChange={setIsCompareModalOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    disabled={selectedForCompare.length < 1}
                    className="border-primary text-primary hover:bg-primary/10 hover:text-primary"
                  >
                    <CompareArrows className="mr-2 h-4 w-4" />
                    Compare ({selectedForCompare.length})
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Plan Comparison</DialogTitle>
                    <DialogDescription>
                      Comparing {selectedForCompare.length} selected plan{selectedForCompare.length === 1 ? '' : 's'}. 
                      Select up to {MAX_COMPARE_PLANS} plans to compare.
                    </DialogDescription>
                  </DialogHeader>
                  {plansToCompare.length > 0 ? (
                    <PlanComparisonTable plansToCompare={plansToCompare} currentLanguage={currentLanguage} />
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      No plans selected or available for comparison. Please select at least one plan.
                    </p>
                  )}
                  <DialogClose asChild>
                      <Button type="button" variant="outline" className="mt-4">
                        Close
                      </Button>
                  </DialogClose>
                </DialogContent>
              </Dialog>
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
                plans={currentPlansToDisplay} 
                loading={loading}
                selectedForCompare={selectedForCompare}
                onPlanSelect={handlePlanSelectionForCompare}
                currentLanguage={currentLanguage}
              />
              {filteredPlans.length > PLANS_PER_PAGE && (
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  itemsPerPage={PLANS_PER_PAGE}
                  totalItems={filteredPlans.length}
                />
              )}
            </>
          )}
          {/* Ensure PlanComparisonTable is NOT rendered directly here */}
        </div>
      </div>
    </div>
  );
}
