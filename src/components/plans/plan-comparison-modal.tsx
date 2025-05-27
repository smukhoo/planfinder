
"use client";

import type { TelecomPlan } from '@/services/telecom-plans';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

interface PlanComparisonTableProps {
  plansToCompare: TelecomPlan[];
}

const getOperatorColorClass = (operator: string): string => {
  switch (operator.toLowerCase()) {
    case 'jio':
      return 'text-blue-600';
    case 'airtel':
      return 'text-red-600';
    case 'vi':
      return 'text-yellow-600'; // Using yellow-600 as Vi has purple too
    default:
      return 'text-foreground';
  }
};

export function PlanComparisonTable({ plansToCompare }: PlanComparisonTableProps) {
  if (plansToCompare.length === 0) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Plan Comparison</CardTitle>
          <CardDescription>Select up to 3 plans from the list above to compare them side-by-side.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">No plans selected for comparison.</p>
        </CardContent>
      </Card>
    );
  }

  const features: Array<{ key: keyof TelecomPlan | 'price' | 'dataPerDay'; label: string }> = [
    { key: 'price', label: 'Price (₹)' },
    { key: 'data', label: 'Data' }, // Changed to display full data string
    { key: 'talktime', label: 'Talktime' },
    { key: 'sms', label: 'SMS' },
    { key: 'validity', label: 'Validity (Days)' },
    { key: 'additionalBenefits', label: 'Additional Benefits' },
  ];

  return (
    <Card className="overflow-hidden shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">Plan Comparison</CardTitle>
        <CardDescription>
          Comparing {plansToCompare.length} plan{plansToCompare.length > 1 ? 's' : ''}.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px] font-semibold text-muted-foreground">Feature</TableHead>
                {plansToCompare.map((plan) => (
                  <TableHead key={plan.rechargeUrl} className={`text-center font-semibold ${getOperatorColorClass(plan.operator)}`}>
                    {plan.operator} Plan {plan.price}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {features.map((feature) => (
                <TableRow key={feature.key}>
                  <TableCell className="font-medium text-foreground">{feature.label}</TableCell>
                  {plansToCompare.map((plan) => (
                    <TableCell key={`${plan.rechargeUrl}-${feature.key}`} className="text-center text-sm">
                      {feature.key === 'price' ? `${plan.price}` : 
                       feature.key === 'validity' ? `${plan.validity}` :
                       (plan[feature.key as keyof TelecomPlan] || '-')}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              <TableRow>
                <TableCell className="font-medium text-foreground">Recharge</TableCell>
                {plansToCompare.map((plan) => (
                  <TableCell key={`recharge-${plan.rechargeUrl}`} className="text-center">
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-accent text-accent-foreground hover:bg-accent/90"
                      onClick={() => window.open(plan.rechargeUrl, '_blank')}
                    >
                      Go to Site
                      <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

    