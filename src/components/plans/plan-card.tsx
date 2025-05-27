
import type { TelecomPlan } from '@/services/telecom-plans';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface PlanCardProps {
  plan: TelecomPlan;
  isSelected: boolean;
  onSelectToggle: (planId: string) => void;
}

const operatorLogoPlaceholders: Record<string, { src: string, hint: string }> = {
  'Jio': { src: 'https://placehold.co/120x60.png', hint: 'Jio logo blue' },
  'Airtel': { src: 'https://placehold.co/120x60.png', hint: 'Airtel logo red' },
  'Vi': { src: 'https://placehold.co/120x60.png', hint: 'Vi logo yellow purple' },
  'BSNL': { src: 'https://placehold.co/120x60.png', hint: 'BSNL logo' },
  'Default': { src: 'https://placehold.co/120x60.png', hint: 'telecom logo generic' },
};

export function PlanCard({ plan, isSelected, onSelectToggle }: PlanCardProps) {
  const logoInfo = operatorLogoPlaceholders[plan.operator] || operatorLogoPlaceholders['Default'];

  return (
    <Card className="flex flex-col sm:flex-row justify-between shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out rounded-lg border overflow-hidden">
      <div className="flex-1 p-5">
        <CardHeader className="p-0 mb-2">
          <CardTitle className="text-lg font-semibold text-foreground">Plan {plan.price}</CardTitle> {/* Using price as part of title as in image */}
        </CardHeader>
        <CardContent className="p-0 text-sm text-muted-foreground space-y-1">
          <p>Data: {plan.data}</p>
          <p>Talktime: {plan.talktime}</p>
          <p>SMS: {plan.sms}</p>
          <p>Validity: {plan.validity} days</p>
          {plan.additionalBenefits && <p className="text-xs">Benefits: {plan.additionalBenefits}</p>}
        </CardContent>
        <CardFooter className="p-0 mt-4">
          <Button 
            variant={isSelected ? "default" : "outline"} 
            size="sm"
            onClick={() => onSelectToggle(plan.rechargeUrl)} // rechargeUrl as unique ID
            className="w-full sm:w-auto"
          >
            {isSelected ? "Selected" : "Select"}
          </Button>
        </CardFooter>
      </div>
      <div className="w-full sm:w-1/3 lg:w-2/5 xl:w-1/3 bg-muted/30 flex items-center justify-center p-4 sm:p-2 min-h-[100px] sm:min-h-0">
        <div className="relative w-[120px] h-[60px]">
            <Image
                src={logoInfo.src}
                alt={`${plan.operator} logo`}
                layout="fill"
                objectFit="contain"
                data-ai-hint={logoInfo.hint}
            />
        </div>
      </div>
    </Card>
  );
}

    