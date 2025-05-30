
"use client";

import { useState, useEffect, useCallback } from 'react';
import { getTelecomPlans, type TelecomPlan, type TelecomPlanFilter } from '@/services/telecom-plans';
import { PlanList } from '@/components/plans/plan-list';
import { FilterBar, type PriceBracket } from '@/components/plans/filter-bar';
import { Button } from '@/components/ui/button';
import { PlanComparisonTable } from '@/components/plans/plan-comparison-table';
import { useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Loader2, CompareArrows, Search as SearchIcon } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { PaginationControls } from '@/components/plans/pagination-controls';

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
    unlimitedCalls: false,
    includeSms: false,
    internationalRoaming: false,
  });
  const [searchTerm, setSearchTerm] = useState('');

  const [allOperators, setAllOperators] = useState<string[]>([]);
  const [allDataOptions, setAllDataOptions] = useState<string[]>([]);
  const [allValidityOptions, setAllValidityOptions] = useState<number[]>([]);
  
  const priceBrackets: PriceBracket[] = [
    { label: "Any Price", value: "any", min: undefined, max: undefined },
    { label: "Under ₹200", value: "0-199", min: 0, max: 199 },
    { label: "₹200 - ₹399", value: "200-399", min: 200, max: 399 },
    { label: "₹400 - ₹699", value: "400-699", min: 400, max: 699 },
    { label: "₹700 & Above", value: "700-Infinity", min: 700, max: undefined },
  ];

  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('english');
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPlansToDisplay, setCurrentPlansToDisplay] = useState<TelecomPlan[]>([]);


  const fetchAndProcessPlans = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedPlans = await getTelecomPlans({}); 
      setAllPlans(fetchedPlans);

      const operators = [...new Set(fetchedPlans.map(p => p.operator))].sort();
      const dataOptionsSet = new Set<string>();
      fetchedPlans.forEach(p => {
        if (p.data?.toLowerCase().includes('/day')) {
          const amount = p.data.split('/')[0].trim();
          if (amount && !isNaN(parseFloat(amount))) dataOptionsSet.add(amount + '/day');
        } else if (p.data && p.data.toLowerCase() !== "n/a" && p.data.trim() !== "" && !p.data.toLowerCase().includes('/day')) {
          dataOptionsSet.add('Other'); // For bulk data plans
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

      // Set initial operator from query params if not already set
      if (initialOperator && !filters.operator) {
        setFilters(prevFilters => ({ ...prevFilters, operator: initialOperator }));
      }
    } catch (error) {
      console.error("Failed to fetch or process plans:", error);
      // Potentially set an error state to display to the user
    } finally {
      setLoading(false);
    }
  }, [initialOperator, filters.operator]); // Added filters.operator to dependencies to re-evaluate if it changes externally


  const performFiltering = useCallback((
    plansToFilter: TelecomPlan[],
    currentFilters: TelecomPlanFilter,
    currentSearchTerm: string
  ): TelecomPlan[] => {
    let tempFilteredPlans = [...plansToFilter];

    // Apply chip/select filters
    if (currentFilters.operator) {
      tempFilteredPlans = tempFilteredPlans.filter(plan => plan.operator.toLowerCase() === currentFilters.operator!.toLowerCase());
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

    // Apply additional feature filters
    if (currentFilters.unlimitedCalls) {
      tempFilteredPlans = tempFilteredPlans.filter(plan => plan.talktime && plan.talktime.toLowerCase().includes('unlimited'));
    }
    if (currentFilters.includeSms) {
      tempFilteredPlans = tempFilteredPlans.filter(plan => plan.sms && plan.sms !== "N/A" && plan.sms !== "" && parseInt(plan.sms.split('/')[0]) > 0);
    }
    if (currentFilters.internationalRoaming) {
       tempFilteredPlans = tempFilteredPlans.filter(plan => plan.category && plan.category.toLowerCase().includes('international roaming'));
    }

    // Apply search term filter
    if (currentSearchTerm.trim() !== '') {
      const term = currentSearchTerm.toLowerCase();
      tempFilteredPlans = tempFilteredPlans.filter(plan => {
        return (
          (plan.operator?.toLowerCase().includes(term)) ||
          (plan.price?.toString().includes(term)) ||
          (plan.data?.toLowerCase().includes(term)) ||
          (plan.talktime?.toLowerCase().includes(term)) ||
          (plan.sms?.toLowerCase().includes(term)) ||
          (plan.validity?.toString().includes(term)) ||
          (plan.planNameDisplay?.toLowerCase().includes(term)) ||
          (plan.category?.toLowerCase().includes(term)) ||
          (plan.callout?.toLowerCase().includes(term)) ||
          (Array.isArray(plan.additionalBenefits) && plan.additionalBenefits.some(b => b.toLowerCase().includes(term))) ||
          (Array.isArray(plan.ottServices) && plan.ottServices.some(o => o.name.toLowerCase().includes(term)))
        );
      });
    }
    return tempFilteredPlans;
  }, []);


  useEffect(() => {
    fetchAndProcessPlans();
  }, [fetchAndProcessPlans]);
  
  // Update filtered plans and pagination when allPlans, filters, or searchTerm change
  useEffect(() => {
    const newFiltered = performFiltering(allPlans, filters, searchTerm);
    setFilteredPlans(newFiltered);
    setTotalPages(Math.ceil(newFiltered.length / PLANS_PER_PAGE));
    setCurrentPage(1); // Reset to first page on filter/search change
    setSelectedForCompare([]); // Clear comparison selection
  }, [allPlans, filters, searchTerm, performFiltering]);

  // Update current plans to display when filteredPlans or currentPage change
  useEffect(() => {
    const startIndex = (currentPage - 1) * PLANS_PER_PAGE;
    const endIndex = startIndex + PLANS_PER_PAGE;
    setCurrentPlansToDisplay(filteredPlans.slice(startIndex, endIndex));
  }, [filteredPlans, currentPage]);


  const handleFilterChange = (newFilters: Partial<TelecomPlanFilter>) => {
    setFilters(prev => ({...prev, ...newFilters}));
  };
  
  const handleAdditionalFeaturesChange = (feature: keyof Pick<TelecomPlanFilter, 'unlimitedCalls' | 'includeSms' | 'internationalRoaming'>, value: boolean) => {
    setFilters(prev => ({...prev, [feature]: value}));
  };

  const handlePlanSelectionForCompare = (planId: string) => {
    setSelectedForCompare(prev => {
      if (prev.includes(planId)) {
        return prev.filter(id => id !== planId);
      } else {
        if (prev.length < MAX_COMPARE_PLANS) {
          return [...prev, planId];
        }
        // In a real app, use a toast notification here
        alert(`You can compare up to ${MAX_COMPARE_PLANS} plans.`);
        return prev;
      }
    });
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };


  const plansToCompare = allPlans.filter(plan => selectedForCompare.includes(plan.id));

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 space-y-6 sticky top-24 h-fit">
          <h2 className="text-2xl font-semibold text-foreground">Filters</h2>
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onAdditionalFeaturesChange={handleAdditionalFeaturesChange}
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
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
               <Select defaultValue="popularity" onValueChange={() => {/* Implement sort logic */}}>
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
                <Dialog open={isCompareModalOpen} onOpenChange={setIsCompareModalOpen}>
                    <DialogTrigger asChild>
                        <Button 
                            variant="outline" 
                            disabled={selectedForCompare.length === 0}
                            className="border-primary text-primary hover:bg-primary/10 hover:text-primary w-full sm:w-auto"
                        >
                            <CompareArrows className="mr-2 h-4 w-4" />
                            Compare ({selectedForCompare.length})
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[90vw] md:max-w-4xl lg:max-w-6xl xl:max-w-7xl bg-popover text-popover-foreground">
                        <DialogHeader>
                        <DialogTitle className="text-xl text-primary">Compare Plans</DialogTitle>
                        <DialogDescription>
                            Review the selected plans side-by-side.
                        </DialogDescription>
                        </DialogHeader>
                        <PlanComparisonTable plansToCompare={plansToCompare} currentLanguage={currentLanguage} />
                        <DialogClose asChild>
                            <Button type="button" variant="secondary" className="mt-4">Close</Button>
                        </DialogClose>
                    </DialogContent>
                </Dialog>
            </div>
          </div>

          <div className="mb-6 relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Search plans (e.g., 'unlimited calls', '5gb data', 'Airtel 299')..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
            />
          </div>


          <Tabs defaultValue="english" className="mb-6" onValueChange={(value) => setCurrentLanguage(value as Language)}>
            <TabsList className="grid w-full grid-cols-3 sm:w-auto sm:inline-flex">
              <TabsTrigger value="english">English</TabsTrigger>
              <TabsTrigger value="hindi">हिंदी</TabsTrigger>
              <TabsTrigger value="tamil">தமிழ்</TabsTrigger>
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
                loading={loading} // Though loading might be false here, keep for consistency if needed
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
        </main>
      </div>
    </div>
  );
}

