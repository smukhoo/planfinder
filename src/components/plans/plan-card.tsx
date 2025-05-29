
import type { TelecomPlan, OttService } from '@/services/telecom-plans';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { CheckCircle, ExternalLink, PlusCircle } from 'lucide-react';

interface PlanCardProps {
  plan: TelecomPlan;
  isSelected: boolean;
  onSelectToggle: (planId: string) => void;
  currentLanguage: 'english' | 'hindi' | 'tamil';
}

export function PlanCard({ plan, isSelected, onSelectToggle, currentLanguage }: PlanCardProps) {
  const displayPlanName = currentLanguage === 'hindi' && plan.planNameDisplay_hi ? plan.planNameDisplay_hi : (plan.planNameDisplay || `${plan.operator} Plan`);
  const displayData = currentLanguage === 'hindi' && plan.data_hi ? plan.data_hi : plan.data;
  const displayTalktime = currentLanguage === 'hindi' && plan.talktime_hi ? plan.talktime_hi : plan.talktime;
  const displaySms = currentLanguage === 'hindi' && plan.sms_hi ? plan.sms_hi : plan.sms;
  const displayAdditionalBenefits = currentLanguage === 'hindi' && plan.additionalBenefits_hi ? plan.additionalBenefits_hi : plan.additionalBenefits;

  const parseDataForDisplay = (dataStr: string) => {
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
    <Card className="flex flex-col shadow-sm hover:shadow-lg transition-shadow duration-200 ease-in-out rounded-lg border overflow-hidden relative">
      {plan.isMostPopular && (
        <div className="absolute top-0 left-0 bg-yellow-400 text-yellow-900 text-xs font-semibold px-2 py-1 rounded-br-lg z-10">
          {currentLanguage === 'hindi' ? 'सबसे लोकप्रिय' : 'Most Popular'}
        </div>
      )}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <CardHeader className="p-0 mb-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-x-4 gap-y-2 mb-2">
              <div className="flex-shrink-0">
                <span className="text-3xl font-bold text-primary">₹{plan.price}</span>
                <p className="text-sm font-semibold text-foreground -mt-1">{displayPlanName}</p>
              </div>
              <div className="flex flex-col items-start sm:items-end sm:flex-row sm:items-center gap-x-3 gap-y-1 w-full sm:w-auto mt-2 sm:mt-0">
                <div className="flex items-baseline gap-1">
                  <p className="font-semibold text-lg text-foreground">{dataInfo.value}</p>
                  <p className="text-xs text-muted-foreground">{dataInfo.unit}</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <p className="font-semibold text-lg text-foreground">{plan.validity}</p>
                  <p className="text-xs text-muted-foreground">{currentLanguage === 'hindi' ? 'दिन वैधता' : 'days validity'}</p>
                </div>
                 {displayTalktime && displayTalktime !== "N/A" && (
                  <div className="flex items-baseline gap-1">
                    <p className="font-semibold text-lg text-foreground truncate max-w-[100px]">{displayTalktime}</p>
                    <p className="text-xs text-muted-foreground">{currentLanguage === 'hindi' ? 'टॉकटाइम' : 'talktime'}</p>
                  </div>
                )}
                {displaySms && displaySms !== "N/A" && (
                    <div className="flex items-baseline gap-1">
                        <p className="font-semibold text-lg text-foreground truncate max-w-[100px]">{displaySms}</p>
                        <p className="text-xs text-muted-foreground">SMS</p>
                    </div>
                )}
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
            <hr className="my-3"/>
            {(plan.ottServices && plan.ottServices.length > 0) || (displayAdditionalBenefits && displayAdditionalBenefits.length > 0) ? (
              <>
                <h4 className="text-sm font-semibold text-foreground mb-1.5 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1.5 text-green-500" />
                  {currentLanguage === 'hindi' ? 'शामिल लाभ:' : 'Benefits Included:'}
                </h4>
                <ul className="space-y-1 list-inside text-xs pl-2">
                  {plan.ottServices && plan.ottServices.map((ott, index) => (
                    <li key={`ott-${index}`} className="flex items-center gap-2">
                      <Image
                        src={ott.logoSrc || `https://placehold.co/20x20/777/FFF.png?text=${ott.name.substring(0,1)}`}
                        alt={`${ott.name} logo`}
                        width={20}
                        height={20}
                        className="object-contain rounded-sm"
                        data-ai-hint={ott.logoHint}
                      />
                      <span className="text-foreground/90">{getOttServiceName(ott)}</span>
                    </li>
                  ))}
                  {displayAdditionalBenefits && displayAdditionalBenefits.map((benefit, index) => (
                    <li key={`benefit-${index}`} className="ml-1 before:content-['•'] before:mr-2 before:text-primary/70">
                      {benefit}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                {currentLanguage === 'hindi' ? 'इस प्लान के लिए कोई अतिरिक्त लाभ सूचीबद्ध नहीं है।' : 'No additional benefits listed for this plan.'}
              </p>
            )}
          </CardContent>
        </div>

        <CardFooter className="p-0 mt-4 pt-4 border-t border-border/50">
          <Button
            variant={isSelected ? "default" : "outline"}
            size="sm"
            onClick={() => onSelectToggle(plan.id || plan.rechargeUrl)}
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
