
// src/app/personalized/page.tsx
"use client";

import { useEffect, useState } from 'react';
import type { MockPersonalizedData } from '@/types/personalized';
import { getPersonalizedData } from '@/services/personalized-data';
import { UserProfileSection } from '@/components/personalized/user-profile-section';
import { DataUsageSection } from '@/components/personalized/data-usage-section';
import { RecommendationsSection } from '@/components/personalized/recommendations-section';
import { Loader2, TrendingUp, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


export default function PersonalizedPage() {
  const [data, setData] = useState<MockPersonalizedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentScenario, setCurrentScenario] = useState<'highUsage' | 'moderateUsage' | 'newUser'>('highUsage');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const personalizedInfo = await getPersonalizedData(currentScenario);
        setData(personalizedInfo);
      } catch (err) {
        console.error("Failed to fetch personalized data:", err);
        setError("Could not load your personalized insights. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [currentScenario]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] p-4">
        <Loader2 className="h-16 w-16 animate-spin text-primary mb-6" />
        <h2 className="text-2xl font-semibold text-foreground mb-2">Loading Your Personalized Dashboard...</h2>
        <p className="text-muted-foreground">Please wait a moment.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] p-4 text-center">
        <ShieldAlert className="h-16 w-16 text-destructive mb-6" />
        <h2 className="text-2xl font-semibold text-destructive mb-2">Oops! Something went wrong.</h2>
        <p className="text-muted-foreground max-w-md mb-6">{error}</p>
        <Button onClick={() => getPersonalizedData(currentScenario).then(setData).catch(() => setError("Still unable to load data."))}>
            Try Again
        </Button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] p-4 text-center">
        <TrendingUp className="h-16 w-16 text-muted-foreground mb-6" />
        <h2 className="text-2xl font-semibold text-foreground mb-2">No Personalized Data Available</h2>
        <p className="text-muted-foreground">We couldn't find any personalized insights for you at this time.</p>
      </div>
    );
  }
  
  const scenarioDate = new Date();
  if (data.lastUpdated === "Just now") {
    // Do nothing
  } else if (data.lastUpdated === "1 hour ago") {
    scenarioDate.setHours(scenarioDate.getHours() -1 );
  }


  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Your Personalized Dashboard
        </h1>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2">
            <p className="text-md text-muted-foreground">
                Insights and recommendations tailored just for you. Last updated: 
                <span className="font-semibold text-foreground ml-1">
                    {data.lastUpdated === 'N/A' ? 'N/A' : new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(scenarioDate)}
                </span>
            </p>
            <div className="mt-3 sm:mt-0">
                <Select value={currentScenario} onValueChange={(value) => setCurrentScenario(value as any)}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="Select User Scenario" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="highUsage">High Usage User</SelectItem>
                        <SelectItem value="moderateUsage">Moderate Usage User</SelectItem>
                        <SelectItem value="newUser">New User</SelectItem>
                    </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1 text-right sm:text-left"> (For Demo)</p>
            </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <UserProfileSection profile={data.userProfile} />
        </div>
        <div className="lg:col-span-2 space-y-8">
          <DataUsageSection 
            dataStatus={data.dataStatus}
            appConsumption={data.appConsumption}
            usagePatterns={data.usagePatterns}
          />
          <RecommendationsSection
            costSaving={data.costSaving}
            ottRecommendation={data.ottRecommendation}
            travelRecommendation={data.travelRecommendation}
          />
        </div>
      </div>
      
      <Card className="mt-12 shadow-md bg-secondary/20 border-secondary/50">
        <CardHeader>
            <CardTitle className="text-lg text-secondary-foreground">Privacy & Consent</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-secondary-foreground/80">
                Your personalized insights are generated based on your usage patterns and preferences to help you find the best plans. 
                This data is handled with utmost care and privacy. For features like travel recommendations, we would (with your explicit consent) look for relevant information. 
                You can manage your data preferences in your account settings at any time.
            </p>
        </CardContent>
      </Card>

    </div>
  );
}
