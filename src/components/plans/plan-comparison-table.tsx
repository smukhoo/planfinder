
"use client";

import type { TelecomPlan } from '@/services/telecom-plans';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

interface PlanComparisonTableProps {
  plansToCompare: TelecomPlan[];
  currentLanguage: 'english' | 'hindi' | 'tamil';
}

const getOperatorColorClass = (operator: string): string => {
  switch (operator.toLowerCase()) {
    case 'jio':
      return 'text-blue-600';
    case 'airtel':
      return 'text-red-600';
    case 'vi':
      return 'text-yellow-600'; 
    default:
      return 'text-foreground';
  }
};

export function PlanComparisonTable({ plansToCompare, currentLanguage }: PlanComparisonTableProps) {
  const lang = currentLanguage;

  if (plansToCompare.length === 0) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>{lang === 'hindi' ? 'प्लान तुलना' : 'Plan Comparison'}</CardTitle>
          <CardDescription>{lang === 'hindi' ? 'तुलना करने के लिए ऊपर दी गई सूची से अधिकतम 3 प्लान चुनें।' : 'Select up to 3 plans from the list above to compare them side-by-side.'}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">{lang === 'hindi' ? 'तुलना के लिए कोई प्लान चयनित नहीं है।' : 'No plans selected for comparison.'}</p>
        </CardContent>
      </Card>
    );
  }

  const features = [
    { key: 'price', label: lang === 'hindi' ? 'मूल्य (₹)' : 'Price (₹)' },
    { key: 'data', label: lang === 'hindi' ? 'डेटा' : 'Data' },
    { key: 'talktime', label: lang === 'hindi' ? 'टॉकटाइम' : 'Talktime' },
    { key: 'sms', label: 'SMS' },
    { key: 'validity', label: lang === 'hindi' ? 'वैधता (दिन)' : 'Validity (Days)' },
    { key: 'additionalBenefits', label: lang === 'hindi' ? 'अतिरिक्त लाभ' : 'Additional Benefits' },
  ];

  const getDisplayValue = (plan: TelecomPlan, featureKey: keyof TelecomPlan | 'price') => {
    const isHindi = lang === 'hindi';
    switch (featureKey) {
      case 'price':
        return plan.price.toString();
      case 'data':
        return (isHindi && plan.data_hi) ? plan.data_hi : plan.data || '-';
      case 'talktime':
        return (isHindi && plan.talktime_hi) ? plan.talktime_hi : plan.talktime || '-';
      case 'sms':
        return (isHindi && plan.sms_hi) ? plan.sms_hi : plan.sms || '-';
      case 'validity':
        return plan.validity.toString();
      case 'additionalBenefits':
        const benefits = (isHindi && plan.additionalBenefits_hi) ? plan.additionalBenefits_hi : plan.additionalBenefits;
        return benefits && benefits.length > 0 ? benefits.join(', ') : '-';
      default:
        return (plan[featureKey as keyof TelecomPlan] as any)?.toString() || '-';
    }
  };


  return (
    <Card className="overflow-hidden shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">{lang === 'hindi' ? 'प्लान तुलना' : 'Plan Comparison'}</CardTitle>
        <CardDescription>
          {lang === 'hindi' ? `${plansToCompare.length} प्लान की तुलना की जा रही है।` : `Comparing ${plansToCompare.length} plan${plansToCompare.length > 1 ? 's' : ''}.`}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px] font-semibold text-muted-foreground">{lang === 'hindi' ? 'सुविधा' : 'Feature'}</TableHead>
                {plansToCompare.map((plan) => (
                  <TableHead key={plan.id || plan.rechargeUrl} className={`text-center font-semibold ${getOperatorColorClass(plan.operator)}`}>
                    {lang === 'hindi' ? (plan.planNameDisplay_hi || `${plan.operator} प्लान ${plan.price}`) : (plan.planNameDisplay || `${plan.operator} Plan ${plan.price}`)}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {features.map((feature) => (
                <TableRow key={feature.key}>
                  <TableCell className="font-medium text-foreground">{feature.label}</TableCell>
                  {plansToCompare.map((plan) => (
                    <TableCell key={`${plan.id || plan.rechargeUrl}-${feature.key}`} className="text-center text-sm">
                      {getDisplayValue(plan, feature.key as any)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              <TableRow>
                <TableCell className="font-medium text-foreground">{lang === 'hindi' ? 'रिचार्ज' : 'Recharge'}</TableCell>
                {plansToCompare.map((plan) => (
                  <TableCell key={`recharge-${plan.id || plan.rechargeUrl}`} className="text-center">
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-accent text-accent-foreground hover:bg-accent/90"
                      onClick={() => window.open(plan.rechargeUrl, '_blank')}
                    >
                      {lang === 'hindi' ? 'साइट पर जाएं' : 'Go to Site'}
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

