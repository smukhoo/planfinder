// src/app/roaming-advisor/page.tsx
"use client";

import { useState } from 'react';
import { RoamingAdvisorForm } from '@/components/roaming/roaming-advisor-form';
import type { RoamingAdvisorInput, RoamingRecommendation, IndianRoamingPack, LocalSimInfo } from '@/types/roaming';
import { getInternationalRoamingSuggestions } from '@/services/international-roaming';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Globe, IndianRupee, Info, Loader2, MessageCircle, Plane, Smartphone, Wifi } from 'lucide-react';

export default function RoamingAdvisorPage() {
  const [recommendations, setRecommendations] = useState<RoamingRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedQuery, setSubmittedQuery] = useState<RoamingAdvisorInput | null>(null);


  const handleFormSubmit = async (data: RoamingAdvisorInput) => {
    setIsLoading(true);
    setError(null);
    setRecommendations(null);
    setSubmittedQuery(data);
    try {
      const result = await getInternationalRoamingSuggestions(data);
      setRecommendations(result);
    } catch (err) {
      setError("Failed to fetch roaming recommendations. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const calculateDuration = (start?: Date, end?: Date): number | null => {
    if (start && end && end > start) {
      return Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
    }
    return null;
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <header className="mb-12 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
            <Plane className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          International Roaming Plan Advisor
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-muted-foreground md:text-lg">
          Find the best international roaming packs or local SIM options for your trip abroad.
        </p>
      </header>

      <Card className="mb-12 shadow-xl">
        <CardHeader>
          <CardTitle>Enter Your Travel Details</CardTitle>
          <CardDescription>Let us help you find the most suitable plans.</CardDescription>
        </CardHeader>
        <CardContent>
          <RoamingAdvisorForm onSubmit={handleFormSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>

      {isLoading && (
        <div className="text-center py-10">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-lg text-muted-foreground">Searching for the best roaming options...</p>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="mb-8">
          <Info className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {recommendations && !isLoading && (
        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-6">
            Your Roaming Recommendations
            {submittedQuery?.destinationCountry && ` for ${submittedQuery.destinationCountry}`}
            {submittedQuery?.departureDate && submittedQuery?.returnDate && 
             ` (${calculateDuration(submittedQuery.departureDate, submittedQuery.returnDate) || ''} days)`}
          </h2>

          {recommendations.advice && (
            <Alert className="mb-6 bg-secondary/20 border-secondary/50">
              <Info className="h-4 w-4 text-secondary-foreground" />
              <AlertTitle className="text-secondary-foreground">Quick Advice</AlertTitle>
              <AlertDescription className="text-secondary-foreground/80">
                {recommendations.advice}
              </AlertDescription>
            </Alert>
          )}

          {recommendations.indianPacks.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-foreground mb-4">Recommended Indian Roaming Packs</h3>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {recommendations.indianPacks.map((pack) => (
                  <Card key={pack.id} className="flex flex-col shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{pack.operator} - {pack.name}</CardTitle>
                        <Badge variant="secondary" className="text-md">
                          <IndianRupee className="h-4 w-4 mr-1"/>{pack.price}
                        </Badge>
                      </div>
                      <CardDescription>{pack.validity} days validity</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm flex-grow">
                      <p><Smartphone className="inline h-4 w-4 mr-1 text-primary"/> Data: {pack.data}</p>
                      <p><MessageCircle className="inline h-4 w-4 mr-1 text-primary"/> Voice: {pack.voice}</p>
                      <p><Wifi className="inline h-4 w-4 mr-1 text-primary"/> SMS: {pack.sms}</p>
                      {pack.specialFeatures && <p><Info className="inline h-4 w-4 mr-1 text-primary"/> Features: {pack.specialFeatures}</p>}
                      <p className="text-xs text-muted-foreground pt-1">Activation: {pack.activation}</p>
                    </CardContent>
                    <CardFooter>
                      <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                        <a href={pack.rechargeUrl} target="_blank" rel="noopener noreferrer">
                          View on {pack.operator} Site <ExternalLink className="ml-2 h-4 w-4"/>
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {recommendations.localSimInfo && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-foreground mb-4">Consider a Local SIM in {recommendations.localSimInfo.country}</h3>
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Local SIM Card Information</CardTitle>
                  <CardDescription>{recommendations.localSimInfo.generalAdvice}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {recommendations.localSimInfo.estimatedCostRange && <p><strong>Estimated Cost:</strong> {recommendations.localSimInfo.estimatedCostRange}</p>}
                  {recommendations.localSimInfo.keyProviders && <p><strong>Key Providers:</strong> {recommendations.localSimInfo.keyProviders.join(', ')}</p>}
                  {recommendations.localSimInfo.purchaseLocations && <p><strong>Where to Buy:</strong> {recommendations.localSimInfo.purchaseLocations}</p>}
                  <div className="pt-2">
                    <p><strong>Pros:</strong> {recommendations.localSimInfo.pros.join(', ')}</p>
                    <p><strong>Cons:</strong> {recommendations.localSimInfo.cons.join(', ')}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {(recommendations.indianPacks.length === 0 && !recommendations.localSimInfo && !recommendations.advice) && (
             <Alert>
                <Globe className="h-4 w-4" />
                <AlertTitle>No Specific Recommendations</AlertTitle>
                <AlertDescription>
                We couldn't find specific roaming packs or local SIM information matching all your criteria for the selected destination. 
                Please check directly with your Indian telecom provider (Jio, Airtel, Vi) for their latest international roaming offers, or look for local SIM card options upon arrival at your destination.
                </AlertDescription>
            </Alert>
          )}

          <Alert className="mt-12 bg-muted/50">
            <Info className="h-4 w-4" />
            <AlertTitle>Disclaimer</AlertTitle>
            <AlertDescription>
              Prices, plan details, and availability are subject to change. Always verify the information with the respective telecom provider or at your destination before making any purchase. ConnectPlan AI helps you find and compare options but is not responsible for the actual service delivery.
            </AlertDescription>
          </Alert>
        </section>
      )}
    </div>
  );
}
