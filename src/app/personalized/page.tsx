
// src/app/personalized/page.tsx
"use client";

import { useEffect, useState } from 'react';
import type { MockPersonalizedData } from '@/types/personalized';
import { getPersonalizedData } from '@/services/personalized-data';
import { UserProfileSection } from '@/components/personalized/user-profile-section';
import { DataUsageSection } from '@/components/personalized/data-usage-section';
import { RecommendationsSection } from '@/components/personalized/recommendations-section';
import { Loader2, TrendingUp, ShieldAlert, Award, Zap, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';

// Glassmorphic card style using Tailwind utilities
const glassCardStyle = "bg-card/60 dark:bg-card/40 backdrop-blur-lg border border-card/30 dark:border-card/20 shadow-xl rounded-xl transition-all duration-300 hover:shadow-2xl";

export default function PersonalizedPage() {
  const [data, setData] = useState<MockPersonalizedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentScenario, setCurrentScenario] = useState<'highUsage' | 'moderateUsage' | 'newUser'>('highUsage');
  const [greeting, setGreeting] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const personalizedInfo = await getPersonalizedData(currentScenario);
        setData(personalizedInfo);
        if (personalizedInfo.userProfile) {
          setUserName(personalizedInfo.userProfile.name.split(' ')[0]); // Get first name
        }
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
        <h2 className="text-2xl font-semibold text-foreground mb-2">Crafting Your Personalized Dashboard...</h2>
        <p className="text-muted-foreground">Just a moment, we're tailoring this just for you.</p>
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
    <div className="container mx-auto px-4 py-8 md:px-6 space-y-10">
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          {greeting}{userName && `, ${userName}`}!
        </h1>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2">
            <p className="text-md text-muted-foreground">
                Here’s your personalized dashboard. Last updated: 
                <span className="font-semibold text-foreground ml-1">
                    {data.lastUpdated === 'N/A' ? 'N/A' : new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(scenarioDate)}
                </span>
            </p>
            <div className="mt-3 sm:mt-0">
                <Select value={currentScenario} onValueChange={(value) => setCurrentScenario(value as any)}>
                    <SelectTrigger className={`w-full sm:w-[220px] ${glassCardStyle} border-primary/30 hover:border-primary/50`}>
                        <SelectValue placeholder="Select User Scenario" />
                    </SelectTrigger>
                    <SelectContent className={`${glassCardStyle} border-primary/30`}>
                        <SelectItem value="highUsage">High Usage User</SelectItem>
                        <SelectItem value="moderateUsage">Moderate Usage User</SelectItem>
                        <SelectItem value="newUser">New User</SelectItem>
                    </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1 text-right sm:text-left"> (For Demo)</p>
            </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-8">
          <UserProfileSection profile={data.userProfile} cardStyle={glassCardStyle} />
          
          <Card className={glassCardStyle}>
            <CardHeader>
              <CardTitle className="text-xl flex items-center text-primary">
                <Award className="mr-2 h-6 w-6" />
                Your Achievements
              </CardTitle>
              <CardDescription>Keep up the great work!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center p-3 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors">
                <Zap className="mr-3 h-5 w-5 text-yellow-500" />
                <div>
                  <p className="font-semibold text-foreground">Data Saver Pro</p>
                  <p className="text-xs text-muted-foreground">5 days data saving streak!</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors">
                <Gift className="mr-3 h-5 w-5 text-green-500" />
                <div>
                  <p className="font-semibold text-foreground">Early Bird Bonus</p>
                  <p className="text-xs text-muted-foreground">Claimed your monthly freebie!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-8">
          <DataUsageSection 
            dataStatus={data.dataStatus}
            appConsumption={data.appConsumption}
            usagePatterns={data.usagePatterns}
            cardStyle={glassCardStyle}
          />
          <RecommendationsSection
            costSaving={data.costSaving}
            ottRecommendation={data.ottRecommendation}
            travelRecommendation={data.travelRecommendation}
            cardStyle={glassCardStyle}
          />
        </div>
      </div>
      
      <Card className={`mt-12 ${glassCardStyle}`}>
        <CardHeader>
            <CardTitle className="text-lg text-primary">Privacy & Consent</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground">
                Your personalized insights are generated based on your usage patterns and preferences to help you find the best plans. 
                This data is handled with utmost care and privacy. You can manage your data preferences in your account settings at any time.
            </p>
        </CardContent>
      </Card>

    </div>
  );
}

    