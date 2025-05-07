import type { TelecomPlan } from '@/services/telecom-plans';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { IndianRupee, Signal, Phone, MessageSquare, CalendarDays, Sparkles, Info, ExternalLink } from 'lucide-react';

interface PlanCardProps {
  plan: TelecomPlan;
  isSelectedForCompare: boolean;
  onCompareToggle: (planId: string, isSelected: boolean) => void;
}

// Helper function to get operator specific color hint
const getOperatorColor = (operator: string): string => {
  switch (operator.toLowerCase()) {
    case 'jio':
      return 'bg-blue-500'; // Jio blue
    case 'airtel':
      return 'bg-red-500';   // Airtel red
    case 'vi':
      return 'bg-yellow-500'; // Vi yellow/purple, using yellow for contrast
    default:
      return 'bg-gray-500';
  }
};


export function PlanCard({ plan, isSelectedForCompare, onCompareToggle }: PlanCardProps) {
  const operatorColorClass = getOperatorColor(plan.operator);

  return (
    <Card className="flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={`p-2 rounded-full ${operatorColorClass} text-white`}>
              <Signal className="h-5 w-5" />
            </span>
            <CardTitle className="text-2xl font-bold">{plan.operator}</CardTitle>
          </div>
          <Badge variant="outline" className="text-lg">
            <IndianRupee className="h-4 w-4 mr-1" />
            {plan.price}
          </Badge>
        </div>
        <CardDescription className="text-sm text-muted-foreground">Prepaid Recharge Plan</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex items-center">
          <Signal className="h-5 w-5 mr-2 text-primary" />
          Data: <span className="font-semibold ml-1">{plan.data}</span>
        </div>
        <div className="flex items-center">
          <Phone className="h-5 w-5 mr-2 text-primary" />
          Talktime: <span className="font-semibold ml-1">{plan.talktime}</span>
        </div>
        <div className="flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-primary" />
          SMS: <span className="font-semibold ml-1">{plan.sms}</span>
        </div>
        <div className="flex items-center">
          <CalendarDays className="h-5 w-5 mr-2 text-primary" />
          Validity: <span className="font-semibold ml-1">{plan.validity} days</span>
        </div>
        {plan.additionalBenefits && (
          <div className="flex items-start">
            <Sparkles className="h-5 w-5 mr-2 text-primary mt-0.5 shrink-0" />
            Benefits: <span className="font-semibold ml-1">{plan.additionalBenefits}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`compare-${plan.operator}-${plan.price}-${plan.validity}`} // More unique ID
            checked={isSelectedForCompare}
            onCheckedChange={(checked) => onCompareToggle(plan.rechargeUrl, !!checked)} // Using rechargeUrl as a unique ID for now
            aria-label={`Compare ${plan.operator} plan for ${plan.price}`}
          />
          <label
            htmlFor={`compare-${plan.operator}-${plan.price}-${plan.validity}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Compare
          </label>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="default" 
                className="bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto"
                onClick={() => window.open(plan.rechargeUrl, '_blank')}
                aria-label={`Recharge ${plan.operator} plan for ${plan.price}`}
              >
                Recharge Now
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="flex items-center text-xs">
                <Info className="h-3 w-3 mr-1" />
                You will be redirected to {plan.operator}'s site.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
}
