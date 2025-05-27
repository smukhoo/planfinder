
import type { TelecomPlan } from '@/services/telecom-plans';
import { PlanCard } from './plan-card';
import { Skeleton } from '@/components/ui/skeleton';

interface PlanListProps {
  plans: TelecomPlan[];
  loading: boolean;
  selectedForCompare: string[];
  onPlanSelectToggle: (planId: string) => void;
}

export function PlanList({ plans, loading, selectedForCompare, onPlanSelectToggle }: PlanListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center min-h-[300px]">
        <ImageSkeleton />
        <h3 className="text-xl font-semibold text-foreground mt-4">No Plans Found</h3>
        <p className="mt-1 text-muted-foreground">
          Try adjusting your filters or check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {plans.map((plan) => (
        <PlanCard
          key={`${plan.operator}-${plan.price}-${plan.validity}-${plan.data}`} // More robust key
          plan={plan}
          isSelected={selectedForCompare.includes(plan.rechargeUrl)}
          onSelectToggle={onPlanSelectToggle}
        />
      ))}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="flex flex-row justify-between items-center p-5 border rounded-lg shadow-sm bg-card h-[160px]">
      <div className="flex-1 space-y-3">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-8 w-1/4 mt-2" />
      </div>
      <div className="w-1/3 lg:w-2/5 xl:w-1/3 flex items-center justify-center p-2">
        <Skeleton className="h-[60px] w-[120px]" />
      </div>
    </div>
  );
}

function ImageSkeleton() {
    // You can use an actual SVG or a more styled div for a better empty state visual
    return (
        <svg className="mx-auto h-20 w-20 text-muted-foreground opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 4a1 1 0 11-2 0 1 1 0 012 0z" />
        </svg>
    );
}

    