
// src/components/personalized/personalized-plan-card.tsx
import type { TelecomPlan } from '@/services/telecom-plans';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IndianRupee, CalendarDays, Database, MessageSquareText, Phone, ExternalLink } from 'lucide-react';

interface PersonalizedPlanCardProps {
  plan: TelecomPlan;
  ctaText?: string;
}

export function PersonalizedPlanCard({ plan, ctaText = "View Plan" }: PersonalizedPlanCardProps) {
  return (
    <Card className="bg-secondary/30 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-bold text-primary">{plan.operator} - <IndianRupee className="inline h-5 w-5 relative -top-0.5"/>{plan.price}</CardTitle>
            {plan.category && <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full">{plan.category}</span>}
        </div>
        {plan.callout && <CardDescription className="text-xs text-accent font-medium pt-0.5">{plan.callout}</CardDescription>}
      </CardHeader>
      <CardContent className="text-sm space-y-1.5 text-muted-foreground">
        <p className="flex items-center"><Database className="mr-2 h-4 w-4 text-primary/80" /> Data: <span className="text-foreground ml-1">{plan.data}</span></p>
        <p className="flex items-center"><CalendarDays className="mr-2 h-4 w-4 text-primary/80" /> Validity: <span className="text-foreground ml-1">{plan.validity} days</span></p>
        {plan.talktime && plan.talktime !== "N/A" && (
            <p className="flex items-center"><Phone className="mr-2 h-4 w-4 text-primary/80" /> Talktime: <span className="text-foreground ml-1">{plan.talktime}</span></p>
        )}
        {plan.sms && plan.sms !== "N/A" && (
            <p className="flex items-center"><MessageSquareText className="mr-2 h-4 w-4 text-primary/80" /> SMS: <span className="text-foreground ml-1">{plan.sms}</span></p>
        )}
        {plan.additionalBenefits && (
          <p className="text-xs pt-1">Benefits: {plan.additionalBenefits.length > 100 ? plan.additionalBenefits.substring(0,97) + "..." : plan.additionalBenefits}</p>
        )}
      </CardContent>
      <CardFooter>
        <Button 
            variant="default" 
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={() => window.open(plan.rechargeUrl, '_blank')}
        >
          {ctaText}
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
