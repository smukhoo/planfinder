import type { TelecomPlan } from '@/services/telecom-plans';
import { PlanCard } from './plan-card';
import { Skeleton } from '@/components/ui/skeleton';

interface PlanListProps {
  plans: TelecomPlan[];
  loading: boolean;
  selectedForCompare: string[];
  onCompareToggle: (planId: string, isSelected: boolean) => void;
}

export function PlanList({ plans, loading, selectedForCompare, onCompareToggle }: PlanListProps) {
  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <img src="https://picsum.photos/seed/no-plans/300/200" alt="No plans found" data-ai-hint="empty state illustration" className="mb-6 rounded-lg shadow-md" width="300" height="200" />
        <h3 className="text-2xl font-semibold text-foreground">No Plans Found</h3>
        <p className="mt-2 text-muted-foreground">
          Try adjusting your filters or check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {plans.map((plan) => (
        <PlanCard
          key={`${plan.operator}-${plan.price}-${plan.validity}-${plan.data}`} // More robust key
          plan={plan}
          isSelectedForCompare={selectedForCompare.includes(plan.rechargeUrl)} // Using rechargeUrl as ID
          onCompareToggle={onCompareToggle}
        />
      ))}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="flex flex-col space-y-3 p-4 border rounded-lg shadow-sm bg-card">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-2/5" />
        <Skeleton className="h-6 w-1/4" />
      </div>
      <Skeleton className="h-4 w-1/3" />
      <div className="space-y-2 pt-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      <div className="flex justify-between items-center pt-3">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-10 w-2/5" />
      </div>
    </div>
  );
}
