"use client";

import type { TelecomPlan } from '@/services/telecom-plans';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IndianRupee, Signal, Phone, MessageSquare, CalendarDays, Sparkles, ExternalLink, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PlanComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  plansToCompare: TelecomPlan[];
}

const getOperatorColor = (operator: string): string => {
  switch (operator.toLowerCase()) {
    case 'jio':
      return 'text-blue-500';
    case 'airtel':
      return 'text-red-500';
    case 'vi':
      return 'text-yellow-600'; // Darker yellow for better contrast on white
    default:
      return 'text-gray-500';
  }
};

export function PlanComparisonModal({ isOpen, onClose, plansToCompare }: PlanComparisonModalProps) {
  if (!isOpen || plansToCompare.length === 0) {
    return null;
  }

  const features: Array<{ key: keyof TelecomPlan | 'price'; label: string; icon: React.ReactNode }> = [
    { key: 'price', label: 'Price', icon: <IndianRupee className="h-4 w-4 mr-1" /> },
    { key: 'data', label: 'Data', icon: <Signal className="h-4 w-4 mr-1" /> },
    { key: 'talktime', label: 'Talktime', icon: <Phone className="h-4 w-4 mr-1" /> },
    { key: 'sms', label: 'SMS', icon: <MessageSquare className="h-4 w-4 mr-1" /> },
    { key: 'validity', label: 'Validity', icon: <CalendarDays className="h-4 w-4 mr-1" /> },
    { key: 'additionalBenefits', label: 'Benefits', icon: <Sparkles className="h-4 w-4 mr-1" /> },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] xl:max-w-4xl p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl font-bold">Compare Plans</DialogTitle>
          <DialogDescription>
            View selected plans side-by-side to find the best fit for you.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          <div className="p-6 pt-0">
            {plansToCompare.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px] text-muted-foreground font-semibold">Feature</TableHead>
                    {plansToCompare.map((plan) => (
                      <TableHead key={plan.rechargeUrl} className={`text-center font-semibold ${getOperatorColor(plan.operator)}`}>
                        {plan.operator}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {features.map((feature) => (
                    <TableRow key={feature.key}>
                      <TableCell className="font-medium text-foreground flex items-center">
                        {feature.icon}
                        {feature.label}
                      </TableCell>
                      {plansToCompare.map((plan) => (
                        <TableCell key={`${plan.rechargeUrl}-${feature.key}`} className="text-center text-sm">
                          {feature.key === 'price' ? `₹${plan.price}` : 
                           feature.key === 'validity' ? `${plan.validity} days` :
                           plan[feature.key as keyof TelecomPlan] || '-'}
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
            ) : (
              <p className="text-muted-foreground text-center py-8">Select at least two plans to compare.</p>
            )}
          </div>
        </ScrollArea>
        <DialogFooter className="p-6 pt-2 border-t">
           <div className="text-xs text-muted-foreground flex items-center w-full">
              <Info className="h-3 w-3 mr-1.5 shrink-0" />
              Recharges are completed on the operator's official website. ConnectPlan AI helps you find and compare.
            </div>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
