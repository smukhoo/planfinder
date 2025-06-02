
// src/components/personalized/data-usage-section.tsx
"use client";

import type { MockDataStatus, MockAppConsumption, MockUsagePatternPoint } from '@/types/personalized';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, List, BarChart2 as BarChart2Icon, ChevronRight } from 'lucide-react'; // Renamed BarChart2 to avoid conflict
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart as RechartsBarChart } from "recharts";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as React from 'react';

interface DataUsageSectionProps {
  dataStatus: MockDataStatus;
  appConsumption: MockAppConsumption[];
  usagePatterns: MockUsagePatternPoint[];
  cardStyle?: string; // Applied to individual cards within this section
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

const yAxisTicks = [0, 0.5, 1, 1.5, 2];

// Custom Tick component for Y-Axis to hardcode labels
const HardcodedYAxisTick = (props: any) => {
  const { x, y, payload, index } = props; // payload might contain an original value, index is key

  let tickText = '';
  if (index >= 0 && index < yAxisTicks.length) {
    tickText = `${yAxisTicks[index].toFixed(1)}GB`;
  } else {
    // Fallback if index is out of bounds, though with interval={0} and matching ticks array, it shouldn't be.
    tickText = payload && Number.isFinite(payload.value) ? `${Number(payload.value).toFixed(1)}GB` : '';
  }

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={4} textAnchor="end" fill="hsl(var(--muted-foreground))" className="text-xs">
        {tickText}
      </text>
    </g>
  );
};


export function DataUsageSection({ dataStatus, appConsumption, usagePatterns, cardStyle }: DataUsageSectionProps) {
  const dataUsedPercentage = dataStatus.totalDataGB > 0 ? ( (dataStatus.totalDataGB - dataStatus.remainingDataGB) / dataStatus.totalDataGB) * 100 : 0;
  const remainingPercentage = 100 - dataUsedPercentage;

  const defaultInnerCardStyle = "shadow-lg";
  const effectiveCardStyle = cardStyle && cardStyle.includes("bg-transparent") ? cardStyle : `${defaultInnerCardStyle} ${cardStyle || ''}`;

  return (
    <div className="space-y-6"> {/* This div is now the root, no outer Card here */}
      <Card className={effectiveCardStyle}>
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
              <span className="text-muted-foreground">of {dataStatus.totalDataGB.toFixed(1)} GB total</span>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Progress value={remainingPercentage} className="h-4 rounded-full cursor-pointer" indicatorClassName="rounded-full" />
                </TooltipTrigger>
                <TooltipContent className="bg-popover text-popover-foreground">
                  <p>{remainingPercentage.toFixed(0)}% remaining ({dataStatus.remainingDataGB.toFixed(1)} GB)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <p className="text-xs text-muted-foreground mt-1.5 text-right">
              Valid till: {dataStatus.validityDate}
            </p>
          </div>
           {dataUsedPercentage > 85 && (
            <p className="text-sm text-destructive font-medium animate-pulse">
              You are running low on data! Consider recharging soon.
            </p>
          )}
        </CardContent>
      </Card>

      <Card className={effectiveCardStyle}>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-primary flex items-center">
             <List className="mr-2 h-6 w-6" />
            App Data Consumption
          </CardTitle>
          <CardDescription>How your data is being used by different apps this cycle.</CardDescription>
        </CardHeader>
        <CardContent>
          {appConsumption.length > 0 ? (
            <div className="space-y-3">
              <TooltipProvider>
                {appConsumption.map((app) => (
                  <Tooltip key={app.id}>
                    <TooltipTrigger asChild>
                      <div className="flex items-center justify-between p-3 bg-background/50 dark:bg-background/20 hover:bg-muted/40 dark:hover:bg-muted/30 rounded-lg transition-colors cursor-pointer">
                        <div className="flex items-center">
                          <app.icon className="mr-3 h-6 w-6 text-muted-foreground" />
                          <span className="font-medium text-foreground">{app.name}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-muted-foreground mr-2">{app.usageGB.toFixed(1)} GB</span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-popover text-popover-foreground">
                      <p>{app.name}: {app.usageGB.toFixed(2)} GB used ({app.usagePercentage.toFixed(0)}%)</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No app consumption data available.</p>
          )}
          {appConsumption.length > 0 && (
            <div className="mt-6 h-[200px] w-full">
               <ChartContainer config={appConsumptionChartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={appConsumption} layout="vertical" margin={{ right: 20, left: 10 }}>
                    <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="hsl(var(--border)/0.5)" />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      className="text-xs fill-muted-foreground"
                      width={80}
                    />
                    <XAxis dataKey="usageGB" type="number" hide />
                    <RechartsTooltip
                      cursor={{ fill: 'hsl(var(--muted)/0.5)' }}
                      content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Bar dataKey="usageGB" radius={[0, 4, 4, 0]} fill="var(--color-usageGB)" barSize={20} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className={effectiveCardStyle}>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-primary flex items-center">
            <BarChart2Icon className="mr-2 h-6 w-6" />
            Data Usage Patterns
          </CardTitle>
          <CardDescription>Your typical data usage over the last period.</CardDescription>
        </CardHeader>
        <CardContent>
          {usagePatterns.length > 0 ? (
            <div className="h-[250px] w-full">
              <ChartContainer config={dataUsagePatternChartConfig} className="h-full w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={usagePatterns} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border)/0.5)" />
                        <XAxis
                          dataKey="date"
                          tickLine={false}
                          tickMargin={10}
                          axisLine={false}
                          className="text-xs fill-muted-foreground"
                        />
                        <YAxis
                          type="number"
                          domain={[0, 2]} 
                          ticks={yAxisTicks} 
                          interval={0}
                          tickLine={false}
                          axisLine={false}
                          tickMargin={10} // Standard margin
                          width={40} // Give enough width for "2.0GB"
                          tick={<HardcodedYAxisTick />} // Use the custom tick component
                        />
                        <RechartsTooltip 
                            cursor={{ fill: 'hsl(var(--muted)/0.5)' }}
                            content={<ChartTooltipContent indicator="dot" />} 
                        />
                        <Bar dataKey="usageGB" fill="var(--color-usageGB)" radius={[4, 4, 0, 0]} barSize={30}/>
                    </RechartsBarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No usage pattern data available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
    
