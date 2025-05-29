
import { z } from 'zod';

/**
 * Represents an OTT service included in a plan.
 */
export interface OttService {
  id: string;
  name: string;
  name_hi?: string; // Hindi name
  logoSrc: string;
  logoHint: string;
}
export const OttServiceSchema = z.object({
  id: z.string(),
  name: z.string(),
  name_hi: z.string().optional(),
  logoSrc: z.string().url().or(z.string().startsWith('https://placehold.co')),
  logoHint: z.string(),
});


/**
 * Represents a mobile recharge plan.
 */
export interface TelecomPlan {
  operator: string;
  price: number;
  data: string;
  data_hi?: string;
  talktime: string;
  talktime_hi?: string;
  sms: string;
  sms_hi?: string;
  validity: number;
  additionalBenefits?: string[];
  additionalBenefits_hi?: string[];
  rechargeUrl: string;
  id?: string;
  category?: string;
  callout?: string | null;
  ottServices?: OttService[];
  isMostPopular?: boolean;
  planNameDisplay?: string;
  planNameDisplay_hi?: string;
}

/**
 * Zod schema for TelecomPlan.
 */
export const TelecomPlanSchema = z.object({
  operator: z.string().describe("The name of the operator (e.g., Airtel, Jio, Vi)."),
  price: z.number().describe("The price of the plan in INR."),
  data: z.string().describe("The amount of data provided by the plan (e.g., '2GB/day', 'Unlimited')."),
  data_hi: z.string().optional(),
  talktime: z.string().optional().describe("The talktime offered by the plan (e.g., 'Unlimited Calls', '₹200 Talktime')."),
  talktime_hi: z.string().optional(),
  sms: z.string().optional().describe("The number of SMS messages included (e.g., '100/day', 'Unlimited')."),
  sms_hi: z.string().optional(),
  validity: z.number().describe("The validity period of the plan in days."),
  additionalBenefits: z.array(z.string()).optional().describe("Any additional benefits offered by the plan as a list of strings."),
  additionalBenefits_hi: z.array(z.string()).optional(),
  rechargeUrl: z.string().describe("URL where the plan can be purchased."), // Kept as z.string() for flexibility
  id: z.string().optional().describe("Plan ID from the source data."),
  category: z.string().optional().describe("Category of the plan."),
  callout: z.string().nullable().optional().describe("Callout text for the plan."),
  ottServices: z.array(OttServiceSchema).optional().describe("List of OTT services included in the plan."),
  isMostPopular: z.boolean().optional().describe("Flag indicating if the plan is most popular."),
  planNameDisplay: z.string().optional().describe("A display-friendly name for the plan."),
  planNameDisplay_hi: z.string().optional(),
});

/**
 * Filters for searching available plans
 */
export interface TelecomPlanFilter {
  operator?: string;
  minPrice?: number;
  maxPrice?: number;
  dataPerDay?: string; // e.g., "1GB", "2GB", "Other"
  validity?: number;
}

const newNewMockPlansData: any[] = [ // Using any for simplicity with added _hi fields
  {
    "id": "51",
    "category": "Recommended Packs",
    "name": "Data : 1.5GB | Validity : 1 day",
    "name_hi": "डेटा : 1.5जीबी | वैधता : 1 दिन",
    "price": 26,
    "validity": "1 day",
    "data": "1.5GB",
    "data_hi": "1.5जीबी",
    "callout": "Bestseller",
    "callout_hi": "बेस्टसेलर"
  },
  {
    "id": "15",
    "category": "Recommended Packs",
    "name": "Data : 5GB | Validity : 30 days | Added benefit : JioHotstar Mobile Subscription for 30 days. Enjoy extra benefits with RC100 instead of RC77",
    "name_hi": "डेटा : 5जीबी | वैधता : 30 दिन | अतिरिक्त लाभ : 30 दिनों के लिए JioHotstar मोबाइल सब्सक्रिप्शन। RC100 के साथ अतिरिक्त लाभों का आनंद लें RC77 के बजाय",
    "price": 100,
    "validity": "30 days",
    "data": "5GB",
    "data_hi": "5जीबी",
    "callout": "New! Favorite Cricket Pack!",
    "callout_hi": "नया! पसंदीदा क्रिकेट पैक!"
  },
  {
    "id": "22",
    "category": "Recommended Packs",
    "name": "Data : 2GB | Validity : 1 day",
    "name_hi": "डेटा : 2जीबी | वैधता : 1 दिन",
    "price": 33,
    "validity": "1 day",
    "data": "2GB",
    "data_hi": "2जीबी",
    "callout": "Bestseller",
    "callout_hi": "बेस्टसेलर"
  },
  {
    "id": "14",
    "category": "Recommended Packs",
    "name": "Data : Unlimited | Validity : 1 day",
    "price": 49,
    "validity": "1 day",
    "data": "Unlimited"
  },
  {
    "id": "48",
    "category": "Recommended Packs",
    "name": "Data : 5GB | Validity : 7 days",
    "price": 77,
    "validity": "7 days",
    "data": "5GB"
  },
  {
    "id": "41",
    "category": "Recommended Packs",
    "name": "Calls : Unlimited | Data : 2.5GB/Day | SMS : 100/Day | Validity : 28 days | Details : Airtel Xstream Play subscription with 23+ OTTs access (SonyLIV, Erosnow etc) for 28 days, UNLIMITED 5G data (over & above plan limit) | Talktime : Rs 5",
    "price": 409,
    "validity": "28 days",
    "data": "2.5GB/Day"
  },
  {
    "id": "61",
    "category": "Recommended Packs",
    "name": "Calls : Unlimited | Data : 1.5GB/day | SMS : 100/day | Validity : 28 days",
    "price": 299,
    "validity": "28 days",
    "data": "1.5GB/day",
    "callout": "LAST RECHARGE"
  },
  {
    "id": "27",
    "category": "Recommended Packs",
    "name": "Calls : Unlimited | Data : 2GB/day | SMS : 100/day | Validity : 84 days | Added benefit : Unlimited 5G available",
    "price": 859,
    "validity": "84 days",
    "data": "2GB/day"
  },
  {
    "id": "59",
    "category": "Recommended Packs",
    "name": "Calls : Unlimited | Data : 1.5GB/day | SMS : 100/day | Validity : 84 days",
    "price": 799,
    "validity": "84 days",
    "data": "1.5GB/day"
  },
  {
    "id": "18", // Data category example
    "category": "Data",
    "name": "Data: 15GB | Validity: 30 days | Details: 20+ OTTs with Airtel Xstream Play for 30 days",
    "price": 181,
    "validity": "30 days",
    "data": "15GB"
  },
  {
    "id": "70", // Data category example with multiple OTTs
    "category": "Data",
    "name": "Data : 1GB | Details :  Netflix, JioHotstar, Airtel Xstream Play & Zee5 for 1 month.",
    "price": 279,
    "validity": "1 month",
    "data": "1GB"
  }
];

function parseValidity(validityStr?: string): number {
  if (!validityStr) return 0;
  const lowerValidityStr = validityStr.toLowerCase();

  if (lowerValidityStr.includes("current pack validity")) {
    return 0; // Or a way to get current pack's remaining validity if possible
  }
  const parts = lowerValidityStr.split(" ");
  const duration = parseInt(parts[0]);
  if (isNaN(duration)) return 0;

  if (parts[1].startsWith("day")) {
    return duration;
  } else if (parts[1].startsWith("month")) {
    return duration * 30; // Approximate
  } else if (parts[1].startsWith("hour")) {
    return Math.max(1, Math.ceil(duration / 24)); // Convert hours to days, min 1 day
  }
  return 0;
}

function extractFromPlanName(planName: string, keyword: string): string {
  const lowerPlanName = planName.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();
  const keywordIndex = lowerPlanName.indexOf(lowerKeyword);

  if (keywordIndex === -1) return "N/A";

  let substringAfterKeyword = planName.substring(keywordIndex + keyword.length);
  substringAfterKeyword = substringAfterKeyword.replace(/^[:\s]+/, '').replace(/[:\s]+$/, ''); // Remove leading/trailing colon or space

  const nextPipeIndex = substringAfterKeyword.indexOf("|");
  if (nextPipeIndex === -1) {
    return substringAfterKeyword.trim();
  }
  return substringAfterKeyword.substring(0, nextPipeIndex).trim();
}

function transformRawPlanToTelecomPlan(rawPlan: any): TelecomPlan {
  let talktime = "N/A";
  if (rawPlan.name && rawPlan.name.toLowerCase().includes("calls : unlimited")) {
    talktime = "Unlimited Calls";
  } else if (rawPlan.name && rawPlan.name.toLowerCase().includes("talktime :")) {
    talktime = extractFromPlanName(rawPlan.name, "Talktime :");
  }

  let sms = "N/A";
  if (rawPlan.name && rawPlan.name.toLowerCase().includes("sms :")) {
    sms = extractFromPlanName(rawPlan.name, "SMS :");
  }

  const isMostPopular = !!(rawPlan.callout && rawPlan.callout.toLowerCase().includes("most popular"));
  const planId = String(rawPlan.id || rawPlan.price + rawPlan.data);

  let planNameDisplay = rawPlan.operator || "Airtel";
  if (rawPlan.name) {
      const nameParts = rawPlan.name.split('|');
      const firstPart = nameParts[0]?.trim();
      if (firstPart && !firstPart.toLowerCase().startsWith("data") && !firstPart.toLowerCase().startsWith("calls") && !firstPart.toLowerCase().startsWith("sms") && !firstPart.toLowerCase().startsWith("talktime")) {
          planNameDisplay = firstPart;
      } else if (rawPlan.category) {
        planNameDisplay = `${rawPlan.operator || "Airtel"} ${rawPlan.category}`
      }
  }
   planNameDisplay = planNameDisplay.includes(String(rawPlan.price)) || planNameDisplay.length < 5 ? `${rawPlan.operator || "Airtel"} ${rawPlan.price}` : planNameDisplay;


  const ottServices: OttService[] = [];
  const benefitsFromBenefitsField: string[] = [];

  if (rawPlan.benefits && Array.isArray(rawPlan.benefits)) {
    rawPlan.benefits.forEach((benefitKey: string) => {
      // This part would ideally map benefitKey to actual service details
      // For now, using placeholders if specific logic isn't present
      if (benefitKey.toLowerCase().includes("jiohotstar")) {
        ottServices.push({ id: "hotstar", name: "Disney+ Hotstar", name_hi: "डिज्नी+ हॉटस्टार", logoSrc: "https://placehold.co/60x20/1E88E5/FFFFFF.png?text=D+H", logoHint: "Disney Hotstar logo" });
      } else if (benefitKey.toLowerCase().includes("xstream")) {
        ottServices.push({ id: "xstream", name: "Airtel Xstream Play", name_hi: "एयरटेल एक्सस्ट्रीम प्ले", logoSrc: "https://placehold.co/60x20/FF0000/FFFFFF.png?text=Xstream", logoHint: "Airtel Xstream logo" });
      } else if (benefitKey.toLowerCase().includes("netflix")) {
        ottServices.push({ id: "netflix", name: "Netflix", name_hi: "नेटफ्लिक्स", logoSrc: "https://placehold.co/60x20/E50914/FFFFFF.png?text=Netflix", logoHint: "Netflix logo" });
      } else if (benefitKey.toLowerCase().includes("zee5")) {
        ottServices.push({ id: "zee5", name: "ZEE5", name_hi: "ज़ी5", logoSrc: "https://placehold.co/60x20/7D287D/FFFFFF.png?text=ZEE5", logoHint: "ZEE5 logo" });
      } else {
        benefitsFromBenefitsField.push(benefitKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())); // Basic formatting
      }
    });
  }
  
  let additionalBenefitsArray: string[] = [];
  let benefitSourceString = "";

  if (rawPlan.name && typeof rawPlan.name === 'string') {
    const detailsMatch = rawPlan.name.match(/Details\s*:\s*(.*)/i);
    const addedBenefitMatch = rawPlan.name.match(/Added benefit\s*:\s*(.*)/i);

    if (detailsMatch && detailsMatch[1]) {
      benefitSourceString = detailsMatch[1].trim();
    } else if (addedBenefitMatch && addedBenefitMatch[1]) {
      benefitSourceString = addedBenefitMatch[1].trim();
    }
    
    if (!benefitSourceString && nameParts[nameParts.length -1] && nameParts.length > 1) { // Use last part of name if no explicit details
        let potentialBenefit = nameParts[nameParts.length -1].trim();
        if (!potentialBenefit.toLowerCase().startsWith("validity") && 
            !potentialBenefit.toLowerCase().startsWith("talktime") && 
            !potentialBenefit.toLowerCase().startsWith("data") &&
            !potentialBenefit.toLowerCase().startsWith("calls") &&
            !potentialBenefit.toLowerCase().startsWith("sms") &&
            potentialBenefit.length > 5) {
            benefitSourceString = potentialBenefit;
        }
    }
  }

  if (benefitSourceString) {
    additionalBenefitsArray = benefitSourceString
      .split(/\s*\|\s*|\s*&\s*|,\s*(?![^()]*\))|\.\s*(?=[A-Z])|\s+and\s+/gi) 
      .map(b => b.trim().replace(/\.$/,'').replace(/^Rs\s*\d+/i, '').trim()) 
      .filter(b => b && b.length > 3 && !b.toLowerCase().includes("validity") && !b.toLowerCase().includes("talktime"));
  }
  
  additionalBenefitsArray = [...additionalBenefitsArray, ...benefitsFromBenefitsField];
  
  if (rawPlan.callout && rawPlan.callout.trim() !== "" && !additionalBenefitsArray.some(b => b.toLowerCase().includes(rawPlan.callout!.toLowerCase().trim()))) {
    additionalBenefitsArray.push(rawPlan.callout.trim());
  }

  ottServices.forEach(ott => {
    additionalBenefitsArray = additionalBenefitsArray.filter(b => !b.toLowerCase().includes(ott.name.toLowerCase()));
  });
  additionalBenefitsArray = [...new Set(additionalBenefitsArray)]; // Remove duplicates


  return {
    id: planId,
    operator: rawPlan.operator || "Airtel",
    price: rawPlan.price,
    data: rawPlan.data,
    data_hi: rawPlan.data_hi || rawPlan.data, // Fallback to English if no Hindi version
    talktime: talktime,
    talktime_hi: rawPlan.talktime_hi || talktime,
    sms: sms,
    sms_hi: rawPlan.sms_hi || sms,
    validity: parseValidity(rawPlan.validity),
    additionalBenefits: additionalBenefitsArray.length > 0 ? additionalBenefitsArray : undefined,
    additionalBenefits_hi: rawPlan.additionalBenefits_hi || (additionalBenefitsArray.length > 0 ? additionalBenefitsArray.map(b => `${b} (अनुवादित)`) : undefined), // Mock translation
    category: rawPlan.category,
    callout: rawPlan.callout || undefined,
    rechargeUrl: `https://www.airtel.in/prepaid-recharge/?packId=${planId}`, 
    ottServices: ottServices.length > 0 ? ottServices : undefined,
    isMostPopular: isMostPopular,
    planNameDisplay: planNameDisplay,
    planNameDisplay_hi: rawPlan.name_hi || planNameDisplay, // Fallback to English
  };
}


export async function getTelecomPlans(filters: TelecomPlanFilter): Promise<TelecomPlan[]> {
  const allTransformedPlans: TelecomPlan[] = newNewMockPlansData.map(rawPlan => transformRawPlanToTelecomPlan({...rawPlan, operator: "Airtel"})); // Assume Airtel for this dataset
  let filteredPlans = [...allTransformedPlans];

  if (filters.operator) {
    filteredPlans = filteredPlans.filter(plan => plan.operator.toLowerCase() === filters.operator!.toLowerCase());
  }
  if (filters.minPrice !== undefined) {
    filteredPlans = filteredPlans.filter(plan => plan.price >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined) {
    filteredPlans = filteredPlans.filter(plan => plan.price <= filters.maxPrice!);
  }
  if (filters.dataPerDay) {
    if (filters.dataPerDay.toLowerCase() === 'other') {
      // This logic might need adjustment based on how "Other" is defined for the new dataset.
      // For now, assume it means plans where data isn't explicitly per day.
      filteredPlans = filteredPlans.filter(plan => !plan.data.toLowerCase().includes('/day'));
    } else {
      // Match if plan.data starts with the numeric part of dataPerDay (e.g., "1.5GB" from "1.5GB/day")
      const dataAmount = filters.dataPerDay.toLowerCase().replace('/day','').replace('gb','').trim();
      filteredPlans = filteredPlans.filter(plan => plan.data.toLowerCase().startsWith(dataAmount));
    }
  }
  if (filters.validity !== undefined) {
    filteredPlans = filteredPlans.filter(plan => plan.validity === filters.validity);
  }

  return filteredPlans;
}
