
import type { TelecomPlan, OttService } from '@/services/telecom-plans';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Wifi, Tv2 } from 'lucide-react'; // Added Tv2 for OTT section

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
        <CardHeader className="p-0 mb-3">
          <CardTitle className="text-xl font-semibold text-foreground">
            {plan.operator} Plan ₹{plan.price}
          </CardTitle>
          {plan.callout && (
            <CardDescription className="text-xs text-accent font-medium pt-0.5">{plan.callout}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="p-0 text-sm text-muted-foreground space-y-1.5">
          <p><strong>Data:</strong> {plan.data}</p>
          <p><strong>Talktime:</strong> {plan.talktime}</p>
          <p><strong>SMS:</strong> {plan.sms}</p>
          <p><strong>Validity:</strong> {plan.validity} days</p>
          {plan.additionalBenefits && <p className="text-xs mt-1"><em>Benefits: {plan.additionalBenefits}</em></p>}

          {plan.ottServices && plan.ottServices.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border/50">
              <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center">
                <Tv2 className="h-4 w-4 mr-1.5 text-primary" />
                Included Apps:
              </h4>
              <div className="flex flex-wrap gap-2 items-center">
                {plan.ottServices.map((ott) => (
                  <div key={ott.id} className="flex items-center gap-1.5 p-1.5 bg-secondary/30 rounded-md text-xs">
                    <Image
                      src={ott.logoSrc}
                      alt={`${ott.name} logo`}
                      width={64} // Adjusted for better visibility, assuming aspect ratio allows
                      height={20} // Adjusted for better visibility
                      className="object-contain h-5 w-auto" // Max height, auto width
                      data-ai-hint={ott.logoHint}
                    />
                    <span className="text-foreground/90">{ott.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="p-0 mt-4">
          <Button 
            variant={isSelected ? "default" : "outline"} 
            size="sm"
            onClick={() => onSelectToggle(plan.id || plan.rechargeUrl)} // Use plan.id if available
            className="w-full sm:w-auto"
          >
            {isSelected ? "Selected for Compare" : "Select to Compare"}
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
