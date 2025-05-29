
import type { TelecomPlan, OttService } from '@/services/telecom-plans';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Tv2 } from 'lucide-react';

interface PlanCardProps {
  plan: TelecomPlan;
  isSelected: boolean;
  onSelectToggle: (planId: string) => void;
}

export function PlanCard({ plan, isSelected, onSelectToggle }: PlanCardProps) {
  return (
    <Card className="flex flex-col shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out rounded-lg border overflow-hidden">
      <div className="flex-1 p-4"> {/* Reduced padding from p-5 to p-4 */}
        <CardHeader className="p-0 mb-2"> {/* Reduced margin-bottom from mb-3 to mb-2 */}
          <CardTitle className="text-xl font-semibold text-foreground">
            {plan.operator} Plan ₹{plan.price}
          </CardTitle>
          {plan.callout && (
            <CardDescription className="text-xs text-accent font-medium pt-0.5">{plan.callout}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="p-0 text-sm text-muted-foreground space-y-1.5">
          <p><strong>Data:</strong> {plan.data}</p>
          <p><strong>Talktime:</strong> {plan.talktime}</p>
          <p><strong>SMS:</strong> {plan.sms}</p>
          <p><strong>Validity:</strong> {plan.validity} days</p>
          {plan.additionalBenefits && <p className="text-xs mt-1"><em>Benefits: {plan.additionalBenefits}</em></p>}

          {plan.ottServices && plan.ottServices.length > 0 && (
            <div className="mt-2 pt-2 border-t border-border/50"> {/* Reduced mt and pt */}
              <h4 className="text-xs font-semibold text-foreground mb-1.5 flex items-center"> {/* Reduced mb */}
                <Tv2 className="h-4 w-4 mr-1.5 text-primary" />
                Included Apps:
              </h4>
              <div className="flex flex-wrap gap-2 items-center">
                {plan.ottServices.map((ott) => (
                  <div key={ott.id} className="flex items-center gap-1.5 p-1.5 bg-secondary/30 rounded-md text-xs">
                    <Image
                      src={ott.logoSrc}
                      alt={`${ott.name} logo`}
                      width={64}
                      height={20}
                      className="object-contain h-5 w-auto"
                      data-ai-hint={ott.logoHint}
                    />
                    <span className="text-foreground/90">{ott.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="p-0 mt-3"> {/* Reduced margin-top from mt-4 to mt-3 */}
          <Button
            variant={isSelected ? "default" : "outline"}
            size="sm"
            onClick={() => onSelectToggle(plan.id || plan.rechargeUrl)}
            className="w-full sm:w-auto"
          >
            {isSelected ? "Selected for Compare" : "Select to Compare"}
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
