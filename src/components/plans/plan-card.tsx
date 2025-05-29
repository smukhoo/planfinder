
import type { TelecomPlan, OttService } from '@/services/telecom-plans';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Tv2, CheckCircle, ExternalLink, PlusCircle } from 'lucide-react';

interface PlanCardProps {
  plan: TelecomPlan;
  isSelected: boolean;
  onSelectToggle: (planId: string) => void;
}

export function PlanCard({ plan, isSelected, onSelectToggle }: PlanCardProps) {
  const parseData = (dataStr: string) => {
    if (!dataStr) return { value: 'N/A', unit: '' };
    const parts = dataStr.toLowerCase().split('/');
    const value = parts[0].trim();
    const unit = parts.length > 1 ? parts[1].trim() : (value.toLowerCase() === 'unlimited' ? '' : 'total data');
    return { value: value.charAt(0).toUpperCase() + value.slice(1), unit: unit === 'day' ? 'data / day' : unit };
  };

  const dataInfo = parseData(plan.data);

  return (
    <Card className="flex flex-col shadow-sm hover:shadow-lg transition-shadow duration-200 ease-in-out rounded-lg border overflow-hidden relative">
      {plan.isMostPopular && (
        <div className="absolute top-0 left-0 bg-yellow-400 text-yellow-900 text-xs font-semibold px-2 py-1 rounded-br-lg z-10">
          Most Popular
        </div>
      )}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <CardHeader className="p-0 mb-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-x-4 gap-y-2 mb-2">
              <div className="flex-shrink-0">
                <span className="text-3xl font-bold text-primary">₹{plan.price}</span>
                {plan.planNameDisplay && <p className="text-sm font-semibold text-foreground -mt-1">{plan.planNameDisplay}</p>}
                {!plan.planNameDisplay && <p className="text-sm text-muted-foreground -mt-1">{plan.operator} Plan</p>}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                <div className="flex items-baseline gap-1">
                  <p className="font-semibold text-lg text-foreground">{dataInfo.value}</p>
                  <p className="text-xs text-muted-foreground">{dataInfo.unit}</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <p className="font-semibold text-lg text-foreground">{plan.validity}</p>
                  <p className="text-xs text-muted-foreground">days validity</p>
                </div>
                 {plan.talktime && plan.talktime !== "N/A" && (
                  <div className="flex items-baseline gap-1">
                    <p className="font-semibold text-lg text-foreground truncate max-w-[100px]">{plan.talktime}</p>
                    <p className="text-xs text-muted-foreground">talktime</p>
                  </div>
                )}
              </div>
            </div>
             <Button 
                className="bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto sm:self-end px-6 py-2 h-auto text-base mt-2 sm:mt-0 order-first sm:order-last"
                onClick={() => window.open(plan.rechargeUrl, '_blank', 'noopener,noreferrer')}
              >
                Buy Plan <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
          </CardHeader>

          <CardContent className="p-0 text-sm text-muted-foreground space-y-2">
            <hr className="my-3"/>
            {(plan.ottServices && plan.ottServices.length > 0) || (plan.additionalBenefits && plan.additionalBenefits.length > 0) ? (
              <>
                <h4 className="text-sm font-semibold text-foreground mb-1.5 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1.5 text-green-500" />
                  Benefits Included:
                </h4>
                <ul className="space-y-1 list-inside text-xs">
                  {plan.ottServices && plan.ottServices.map((ott, index) => (
                    <li key={`ott-${index}`} className="flex items-center gap-2">
                      <Image
                        src={ott.logoSrc || `https://placehold.co/20x20/777/FFF.png?text=${ott.name.substring(0,1)}`}
                        alt={`${ott.name} logo`}
                        width={20}
                        height={20}
                        className="object-contain rounded-sm"
                        data-ai-hint={ott.logoHint}
                      />
                      <span className="text-foreground/90">{ott.name}</span>
                    </li>
                  ))}
                  {plan.additionalBenefits && plan.additionalBenefits.map((benefit, index) => (
                    <li key={`benefit-${index}`} className="ml-1 before:content-['•'] before:mr-2 before:text-primary/70">
                      {benefit}
                    </li>
                  ))}
                  {/* Placeholder for "see more" if benefit list is very long */}
                </ul>
              </>
            ) : (
              <p className="text-xs text-muted-foreground italic">No additional benefits listed for this plan.</p>
            )}
          </CardContent>
        </div>

        <CardFooter className="p-0 mt-4 pt-4 border-t border-border/50">
          <Button
            variant={isSelected ? "default" : "outline"}
            size="sm"
            onClick={() => onSelectToggle(plan.id || plan.rechargeUrl)}
            className="w-full"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            {isSelected ? "Selected for Compare" : "Select to Compare"}
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
