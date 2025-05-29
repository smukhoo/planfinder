
// src/components/personalized/personalized-plan-card.tsx
import type { TelecomPlan } from '@/services/telecom-plans';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IndianRupee, CalendarDays, Database, MessageSquareText, Phone, ExternalLink, ChevronRight } from 'lucide-react';

interface PersonalizedPlanCardProps {
  plan: TelecomPlan;
  ctaText?: string;
  cardStyle?: string;
}

export function PersonalizedPlanCard({ plan, ctaText = "View Plan", cardStyle }: PersonalizedPlanCardProps) {
  return (
    <Card className={`${cardStyle ? cardStyle.replace('shadow-xl', 'shadow-md').replace('rounded-xl', 'rounded-lg') : 'bg-secondary/30 shadow-md rounded-lg'} hover:shadow-lg transition-shadow`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-bold text-primary">{plan.operator} - <IndianRupee className="inline h-5 w-5 relative -top-0.5"/>{plan.price}</CardTitle>
            {plan.category && <Badge variant="outline" className="text-xs border-primary/50 text-primary">{plan.category}</Badge>}
        </div>
        {plan.callout && <CardDescription className="text-xs text-accent font-medium pt-0.5">{plan.callout}</CardDescription>}
      </CardHeader>
      <CardContent className="text-sm space-y-2 text-muted-foreground pb-4">
        <div className="flex items-center justify-between hover:bg-muted/20 p-1 rounded">
            <span className="flex items-center"><Database className="mr-2 h-4 w-4 text-primary/80" /> Data:</span>
            <span className="font-semibold text-foreground">{plan.data}</span>
        </div>
        <div className="flex items-center justify-between hover:bg-muted/20 p-1 rounded">
            <span className="flex items-center"><CalendarDays className="mr-2 h-4 w-4 text-primary/80" /> Validity:</span>
            <span className="font-semibold text-foreground">{plan.validity} days</span>
        </div>
        {plan.talktime && plan.talktime !== "N/A" && (
            <div className="flex items-center justify-between hover:bg-muted/20 p-1 rounded">
                <span className="flex items-center"><Phone className="mr-2 h-4 w-4 text-primary/80" /> Talktime:</span>
                <span className="font-semibold text-foreground">{plan.talktime}</span>
            </div>
        )}
        {plan.sms && plan.sms !== "N/A" && (
            <div className="flex items-center justify-between hover:bg-muted/20 p-1 rounded">
                <span className="flex items-center"><MessageSquareText className="mr-2 h-4 w-4 text-primary/80" /> SMS:</span>
                <span className="font-semibold text-foreground">{plan.sms}</span>
            </div>
        )}
        {plan.additionalBenefits && Array.isArray(plan.additionalBenefits) && plan.additionalBenefits.length > 0 && (
          <div className="pt-2">
            <p className="text-xs font-medium text-foreground mb-1">Key Benefits:</p>
            <ul className="space-y-1">
              {plan.additionalBenefits.slice(0, 2).map((benefit, index) => (
                <li key={index} className="flex items-center text-xs hover:bg-muted/20 p-1 rounded">
                  <ChevronRight className="mr-1.5 h-3 w-3 text-primary/70 shrink-0" /> {benefit.length > 40 ? benefit.substring(0,37) + "..." : benefit}
                </li>
              ))}
              {plan.additionalBenefits.length > 2 && <li className="text-xs text-primary hover:underline cursor-pointer p-1 rounded">View all benefits...</li>}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
            variant="default" 
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 transition-transform hover:scale-105"
            onClick={() => window.open(plan.rechargeUrl, '_blank')}
        >
          {ctaText}
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
    
