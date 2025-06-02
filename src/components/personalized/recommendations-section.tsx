
// src/components/personalized/recommendations-section.tsx
"use client";

import type { MockCostSavingRecommendation, MockOttRecommendation, MockTravelRecommendation } from '@/types/personalized';
import { PersonalizedPlanCard } from './personalized-plan-card';
import { ThumbsUp, Tv, PlaneTakeoff, AlertCircle } from 'lucide-react';

interface RecommendationsSectionProps {
  costSaving?: MockCostSavingRecommendation;
  ottRecommendation?: MockOttRecommendation;
  travelRecommendation?: MockTravelRecommendation;
  cardStyle?: string;
}

export function RecommendationsSection({ costSaving, ottRecommendation, travelRecommendation, cardStyle }: RecommendationsSectionProps) {
  const hasAnyRecommendation = costSaving || ottRecommendation || travelRecommendation;
  
  const defaultInnerCardStyle = "shadow-lg";
  const effectiveCardStyle = cardStyle && cardStyle.includes("bg-transparent") ? cardStyle : `${defaultInnerCardStyle} ${cardStyle || ''}`;

  if (!hasAnyRecommendation) {
    return (
      <div className="text-md text-muted-foreground text-center py-10">
        <p>No specific recommendations for you at the moment.</p>
        <p className="text-sm">Check back later for personalized insights!</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pt-0">
      {costSaving && (
        <div className="space-y-3 p-4 bg-background/50 dark:bg-background/20 rounded-lg hover:shadow-md transition-shadow">
          <h4 className="text-lg font-semibold text-foreground flex items-center">
              <ThumbsUp className="mr-2 h-5 w-5 text-green-500" />
              AI-Powered Cost Savings Advisor
          </h4>
          {costSaving.scenarioDescription && (
            <p className="text-sm text-muted-foreground italic bg-destructive/10 p-2 rounded-md border border-destructive/30">
                <AlertCircle className="inline h-4 w-4 mr-1 relative -top-px text-destructive"/>
                {costSaving.scenarioDescription}
            </p>
          )}
          <p className="text-sm text-muted-foreground pt-1">
            Based on your usage (approx. <span className="font-semibold text-foreground">{costSaving.averageUsageGB}GB/day</span>),
            our AI found a smarter option. Your previous estimated spend was <span className="font-semibold text-destructive">₹{costSaving.previousTotalSpending}</span> over 84 days
            (₹{costSaving.previousPlanCost} base + frequent ₹{costSaving.topUpCost} top-ups).
          </p>
          <p className="text-sm text-foreground font-semibold">
            By switching to the recommended plan below, you could save approximately <span className="text-green-600 font-bold text-md">₹{costSaving.potentialSavingINR}</span> over an 84-day cycle
            and get a much better experience with reliable data, especially for your 5G-enabled commute!
          </p>
          <PersonalizedPlanCard plan={costSaving.recommendedPlan} ctaText={`Switch & Save ₹${costSaving.potentialSavingINR}`} cardStyle={effectiveCardStyle}/>
        </div>
      )}

      {ottRecommendation && (
        <div className="space-y-3 p-4 bg-background/50 dark:bg-background/20 rounded-lg hover:shadow-md transition-shadow">
           <h4 className="text-lg font-semibold text-foreground flex items-center">
              <Tv className="mr-2 h-5 w-5 text-purple-500" />
              OTT & Lifestyle Insights
          </h4>
          <p className="text-sm text-muted-foreground">
            We noticed your previous plan included the <span className="font-semibold text-foreground">{ottRecommendation.usedOttApp}</span>.
            {ottRecommendation.notes && (
              <span className="block mt-1 italic">{ottRecommendation.notes}</span>
            )}
          </p>
          {ottRecommendation.recommendedPlan && (!costSaving || (costSaving && costSaving.recommendedPlan.id !== ottRecommendation.recommendedPlan.id)) && (
            <>
                <p className="text-sm text-muted-foreground">The AI-recommended plan below also considers your overall value:</p>
                <PersonalizedPlanCard plan={ottRecommendation.recommendedPlan} ctaText="View Smart Plan" cardStyle={effectiveCardStyle} />
            </>
          )}
           {ottRecommendation.recommendedPlan && costSaving && costSaving.recommendedPlan.id === ottRecommendation.recommendedPlan.id && (
             <p className="text-sm text-muted-foreground pt-1">The cost-saving plan recommended above already takes this into account, focusing on your primary need for reliable data.</p>
           )}
        </div>
      )}

      {travelRecommendation && (
        <div className="space-y-3 p-4 bg-background/50 dark:bg-background/20 rounded-lg hover:shadow-md transition-shadow">
          <h4 className="text-lg font-semibold text-foreground flex items-center">
              <PlaneTakeoff className="mr-2 h-5 w-5 text-blue-500" />
              Travel & Roaming
          </h4>
          <p className="text-sm text-muted-foreground">
            Travelling Soon? We noticed you might be heading to <span className="font-semibold text-foreground">{travelRecommendation.destination}</span> around <span className="font-semibold text-foreground">{travelRecommendation.travelDate}</span>.
            Stay connected with this international roaming pack:
          </p>
          <PersonalizedPlanCard plan={travelRecommendation.recommendedPack} ctaText="View Roaming Pack" cardStyle={effectiveCardStyle} />
        </div>
      )}
    </div>
  );
}
