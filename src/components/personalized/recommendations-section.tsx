
// src/components/personalized/recommendations-section.tsx
"use client";

import type { MockCostSavingRecommendation, MockOttRecommendation, MockTravelRecommendation } from '@/types/personalized';
// Card, CardContent, CardHeader, CardTitle, CardDescription will be handled by Accordion
import { PersonalizedPlanCard } from './personalized-plan-card';
import { ThumbsUp, Tv, PlaneTakeoff } from 'lucide-react'; // Lightbulb icon removed as it's in AccordionTrigger

interface RecommendationsSectionProps {
  costSaving?: MockCostSavingRecommendation;
  ottRecommendation?: MockOttRecommendation;
  travelRecommendation?: MockTravelRecommendation;
  cardStyle?: string; // This style will be applied to individual recommendation cards
}

export function RecommendationsSection({ costSaving, ottRecommendation, travelRecommendation, cardStyle }: RecommendationsSectionProps) {
  const hasAnyRecommendation = costSaving || ottRecommendation || travelRecommendation;
  
  // If cardStyle indicates transparent/no border (meaning it's inside an accordion), apply it.
  // Otherwise, use a default card styling for standalone use.
  const defaultInnerCardStyle = "shadow-lg"; // This would be for individual cards if this section was NOT in an accordion
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
    <div className="space-y-10 pt-0"> {/* Removed outer Card, this is the content for Accordion */}
      {costSaving && (
        <div className="space-y-3 p-4 bg-background/50 dark:bg-background/20 rounded-lg hover:shadow-md transition-shadow">
          <h4 className="text-lg font-semibold text-foreground flex items-center">
              <ThumbsUp className="mr-2 h-5 w-5 text-green-500" />
              Cost Savings Advisor
          </h4>
          <p className="text-sm text-muted-foreground">
            Save More! Based on your typical usage of <span className="font-semibold text-foreground">{costSaving.averageUsageGB} GB/day</span>,
            you could have saved <span className="font-semibold text-green-600">₹{costSaving.potentialSavingINR}</span> last month by choosing this plan:
          </p>
          <PersonalizedPlanCard plan={costSaving.recommendedPlan} ctaText="View Plan & Save" cardStyle={effectiveCardStyle}/>
        </div>
      )}

      {ottRecommendation && (
        <div className="space-y-3 p-4 bg-background/50 dark:bg-background/20 rounded-lg hover:shadow-md transition-shadow">
           <h4 className="text-lg font-semibold text-foreground flex items-center">
              <Tv className="mr-2 h-5 w-5 text-purple-500" />
              OTT & Lifestyle Benefits
          </h4>
          <p className="text-sm text-muted-foreground">
            Binge Smarter! Since you frequently use <span className="font-semibold text-foreground">{ottRecommendation.usedOttApp}</span>,
            consider this plan with an included {ottRecommendation.usedOttApp} subscription:
          </p>
          <PersonalizedPlanCard plan={ottRecommendation.recommendedPlan} ctaText="View Plan & Binge" cardStyle={effectiveCardStyle} />
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
    

    