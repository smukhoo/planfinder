
import type { TelecomPlan, OttService } from '@/services/telecom-plans';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ExternalLink, PlusCircle, Phone, MessageSquareText, ChevronRight } from 'lucide-react';

interface PlanCardProps {
  plan: TelecomPlan;
  isSelected: boolean;
  onPlanSelect: (planId: string) => void;
  currentLanguage: 'english' | 'hindi' | 'tamil';
}

export function PlanCard({ plan, isSelected, onPlanSelect, currentLanguage }: PlanCardProps) {
  const displayPlanName = currentLanguage === 'hindi' && plan.planNameDisplay_hi ? plan.planNameDisplay_hi : (plan.planNameDisplay || `${plan.operator} Plan`);
  const displayData = currentLanguage === 'hindi' && plan.data_hi ? plan.data_hi : plan.data;
  const displayTalktime = currentLanguage === 'hindi' && plan.talktime_hi ? plan.talktime_hi : plan.talktime;
  const displaySms = currentLanguage === 'hindi' && plan.sms_hi ? plan.sms_hi : plan.sms;
  const displayAdditionalBenefits = currentLanguage === 'hindi' && plan.additionalBenefits_hi ? plan.additionalBenefits_hi : plan.additionalBenefits;

  const parseDataForDisplay = (dataStr: string | undefined) => {
    if (!dataStr) return { value: 'N/A', unit: '' };
    const parts = dataStr.toLowerCase().split('/');
    let value = parts[0].trim();
    let unit = parts.length > 1 ? parts[1].trim() : (value.toLowerCase() === 'unlimited' ? '' : 'total data');
    
    value = value.charAt(0).toUpperCase() + value.slice(1);
    if (currentLanguage === 'hindi') {
        unit = unit === 'day' ? 'प्रति दिन' : (unit === 'total data' ? 'कुल डेटा' : unit);
    } else {
        unit = unit === 'day' ? 'data / day' : unit;
    }
    return { value, unit };
  };

  const dataInfo = parseDataForDisplay(displayData);

  const getOttServiceName = (ott: OttService) => {
    return currentLanguage === 'hindi' && ott.name_hi ? ott.name_hi : ott.name;
  };

  return (
    <Card className="relative flex flex-col shadow-sm hover:shadow-lg transition-shadow duration-200 ease-in-out rounded-lg border overflow-hidden bg-amber-50 dark:bg-amber-950/30">
      {plan.isMostPopular && (
        <div className="absolute top-0 left-0 bg-yellow-400 text-yellow-900 text-xs font-semibold px-2 py-1 rounded-br-lg z-10">
          {currentLanguage === 'hindi' ? 'सबसे लोकप्रिय' : 'Most Popular'}
        </div>
      )}
      {/* Main inner content wrapper - increased top padding here */}
      <div className="px-3 pb-3 pt-7 flex-1 flex flex-col justify-between"> 
        <div> {/* Content top part */}
          <CardHeader className="p-0 mb-2">
            <div className="flex flex-col sm:flex-row justify-start sm:items-center gap-x-6 gap-y-1 mb-2">
              {/* Left: Price & Plan Name */}
              <div className="flex-shrink-0">
                <span className="text-3xl font-bold text-primary">₹{plan.price}</span>
                <p className="text-sm font-semibold text-foreground -mt-1">{displayPlanName}</p>
              </div>

              {/* Right: Key Stats & Buy Button */}
              <div className="flex flex-col items-start sm:items-end sm:flex-row sm:items-center gap-x-4 gap-y-2 w-full sm:w-auto mt-2 sm:mt-0">
                <div className="flex items-baseline gap-1">
                  <p className="font-semibold text-xl text-foreground">{dataInfo.value}</p>
                  <p className="text-xs text-muted-foreground">{dataInfo.unit}</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <p className="font-semibold text-xl text-foreground">{plan.validity}</p>
                  <p className="text-xs text-muted-foreground">{currentLanguage === 'hindi' ? 'दिन वैधता' : 'days validity'}</p>
                </div>
                 <Button 
                    className="bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto px-4 py-2 h-auto text-sm order-first sm:order-last sm:ml-2"
                    onClick={() => window.open(plan.rechargeUrl, '_blank', 'noopener,noreferrer')}
                  >
                    {currentLanguage === 'hindi' ? 'प्लान खरीदें' : 'Buy Plan'} <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0 text-sm text-muted-foreground space-y-2">
            <hr className="my-2 border-border/50"/>
            {(displayTalktime && displayTalktime !== "N/A" && displayTalktime !== "") || 
             (displaySms && displaySms !== "N/A" && displaySms !== "") || 
             (plan.ottServices && plan.ottServices.length > 0) || 
             (displayAdditionalBenefits && displayAdditionalBenefits.length > 0) ? (
              <>
                <h4 className="text-sm font-semibold text-foreground mb-1.5 flex items-center">
                  {currentLanguage === 'hindi' ? 'शामिल लाभ:' : 'Benefits Included:'}
                </h4>
                <ul className="space-y-1 text-xs pl-1">
                  {displayTalktime && displayTalktime !== "N/A" && displayTalktime !== "" && (
                    <li className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-primary/80 shrink-0" />
                      <span className="text-foreground/90">
                        <span className="font-medium">{currentLanguage === 'hindi' ? 'टॉकटाइम' : 'Talktime'}:</span> {displayTalktime}
                      </span>
                    </li>
                  )}
                  {displaySms && displaySms !== "N/A" && displaySms !== "" && (
                    <li className="flex items-center gap-1.5">
                      <MessageSquareText className="h-3.5 w-3.5 text-primary/80 shrink-0" />
                      <span className="text-foreground/90">
                        <span className="font-medium">SMS:</span> {displaySms}
                      </span>
                    </li>
                  )}
                  {plan.ottServices && plan.ottServices.map((ott, index) => (
                    <li key={`ott-${index}`} className="flex items-center gap-1.5">
                      <Image
                        src={ott.logoSrc || `https://placehold.co/20x20/777/FFF.png?text=${ott.name.substring(0,1)}`}
                        alt={`${ott.name} logo`}
                        width={20}
                        height={20}
                        className="object-contain rounded-sm shrink-0"
                        data-ai-hint={ott.logoHint}
                      />
                      <span className="text-foreground/90">{getOttServiceName(ott)}</span>
                    </li>
                  ))}
                  {displayAdditionalBenefits && displayAdditionalBenefits.slice(0, 2).map((benefit, index) => (
                    <li key={`benefit-${index}`} className="flex items-start text-left ml-0.5">
                       <ChevronRight className="mr-1 h-3.5 w-3.5 text-primary/70 shrink-0 relative top-0.5" /> 
                       <span className="text-foreground/90">{benefit.length > 60 ? benefit.substring(0,57) + "..." : benefit}</span>
                    </li>
                  ))}
                  {displayAdditionalBenefits && displayAdditionalBenefits.length > 2 && (
                    <li className="text-xs text-primary hover:underline cursor-pointer pl-4">...see more benefits</li>
                  )}
                </ul>
              </>
            ) : (
              <p className="text-xs text-muted-foreground italic py-2">
                {currentLanguage === 'hindi' ? 'इस प्लान के लिए कोई अतिरिक्त लाभ सूचीबद्ध नहीं है।' : 'No additional benefits listed for this plan.'}
              </p>
            )}
          </CardContent>
        </div>

        <CardFooter className="p-0 mt-3 pt-3 border-t border-border/50">
          <Button
            variant={isSelected ? "default" : "outline"}
            size="sm"
            onClick={() => onPlanSelect(plan.id || plan.rechargeUrl)}
            className="w-full"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            {isSelected ? (currentLanguage === 'hindi' ? 'तुलना के लिए चयनित' : "Selected for Compare") : (currentLanguage === 'hindi' ? 'तुलना के लिए चुनें' : "Select to Compare")}
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
