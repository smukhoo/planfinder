
// src/components/personalized/data-usage-section.tsx
"use client";

import type { MockDataStatus, MockAppConsumption, MockUsagePatternPoint } from '@/types/personalized';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, List } from 'lucide-react'; // BarChart icon removed from here as it's a component name
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart"; // Removed BarChart as ShadBarChart
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart } from "recharts"; // Added BarChart import


interface DataUsageSectionProps {
  dataStatus: MockDataStatus;
  appConsumption: MockAppConsumption[];
  usagePatterns: MockUsagePatternPoint[];
}

const appConsumptionChartConfig = {
  usageGB: {
    label: "GB Used",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const dataUsagePatternChartConfig = {
  usageGB: {
    label: "GB Used",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function DataUsageSection({ dataStatus, appConsumption, usagePatterns }: DataUsageSectionProps) {
  const dataUsedPercentage = dataStatus.totalDataGB > 0 ? ( (dataStatus.totalDataGB - dataStatus.remainingDataGB) / dataStatus.totalDataGB) * 100 : 0;

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-primary flex items-center">
            <TrendingUp className="mr-2 h-6 w-6" />
            Current Data Status
          </CardTitle>
          <CardDescription>Your current mobile data balance and validity.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-foreground">{dataStatus.remainingDataGB.toFixed(1)} GB remaining</span>
              <span className="text-muted-foreground">of {dataStatus.totalDataGB.toFixed(1)} GB</span>
            </div>
            <Progress value={100 - dataUsedPercentage} className="h-3" />
            <p className="text-xs text-muted-foreground mt-1 text-right">
              Valid till: {dataStatus.validityDate}
            </p>
          </div>
           {dataUsedPercentage > 85 && (
            <p className="text-sm text-destructive font-medium">
              You are running low on data!
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-primary flex items-center">
             <List className="mr-2 h-6 w-6" /> {/* Changed icon from BarChart to List for clarity */}
            App Data Consumption
          </CardTitle>
          <CardDescription>How your data is being used by different apps.</CardDescription>
        </CardHeader>
        <CardContent>
          {appConsumption.length > 0 ? (
            <ul className="space-y-3">
              {appConsumption.map((app) => (
                <li key={app.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <app.icon className="mr-3 h-5 w-5 text-muted-foreground" />
                    <span className="font-medium text-foreground">{app.name}</span>
                  </div>
                  <span className="text-muted-foreground">{app.usageGB.toFixed(1)} GB</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No app consumption data available.</p>
          )}
          {/* Placeholder for chart */}
          {appConsumption.length > 0 && (
            <div className="mt-4 h-[200px] w-full">
               <ChartContainer config={appConsumptionChartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={appConsumption} layout="vertical" margin={{ right: 20 }}> {/* Replaced ShadBarChart with BarChart */}
                    <CartesianGrid horizontal={false} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                      className="text-xs"
                      width={80}
                    />
                    <XAxis dataKey="usageGB" type="number" hide />
                    <RechartsTooltip
                      cursor={{ fill: 'hsl(var(--muted))' }}
                      content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Bar dataKey="usageGB" radius={4} fill="var(--color-usageGB)" />
                  </BarChart> {/* Replaced ShadBarChart with BarChart */}
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-primary flex items-center">
            {/* Using List icon here as well or a generic chart icon if preferred */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-6 w-6 lucide lucide-bar-chart-big"><line x1="12" x2="12" y1="20" y2="4"/><path d="M17 20V10"/><path d="M22 20V14"/><path d="M7 20V16"/><path d="M2 20V8"/></svg>
            Data Usage Patterns
          </CardTitle>
          <CardDescription>Your typical data usage over the last period.</CardDescription>
        </CardHeader>
        <CardContent>
          {usagePatterns.length > 0 ? (
            <div className="h-[250px] w-full">
              <ChartContainer config={dataUsagePatternChartConfig} className="h-full w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={usagePatterns}> {/* Replaced ShadBarChart with BarChart */}
                        <CartesianGrid vertical={false} />
                        <XAxis
                        dataKey="date"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        className="text-xs"
                        />
                        <YAxis tickLine={false} axisLine={false} tickMargin={10} className="text-xs" unit="GB"/>
                        <RechartsTooltip 
                            cursor={{ fill: 'hsl(var(--muted))' }}
                            content={<ChartTooltipContent indicator="dot" />} 
                        />
                        <Bar dataKey="usageGB" fill="var(--color-usageGB)" radius={4} />
                    </BarChart> {/* Replaced ShadBarChart with BarChart */}
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No usage pattern data available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
