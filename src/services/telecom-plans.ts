
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
  logoSrc: z.string(), // Simplified from .url()
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
  validity: number; // Always in days
  additionalBenefits?: string[];
  additionalBenefits_hi?: string[];
  rechargeUrl: string;
  id: string; // Made non-optional
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
  rechargeUrl: z.string().describe("URL where the plan can be purchased."),
  id: z.string().describe("Plan ID from the source data."), // Made non-optional
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
  // Additional features
  unlimitedCalls?: boolean;
  includeSms?: boolean;
  internationalRoaming?: boolean;
}

const newNewMockPlansData: any[] = [
  {
    "id": "airtel-26-1d", // Made ID more unique for safety
    "category": "Recommended Packs",
    "name": "Data : 1.5GB | Validity : 1 day",
    "name_hi": "डेटा : 1.5जीबी | वैधता : 1 दिन",
    "price": 26,
    "validity": "1 day",
    "data": "1.5GB",
    "data_hi": "1.5जीबी",
    "callout": "Bestseller"
  },
  {
    "id": "airtel-100-30d-hotstar",
    "category": "Recommended Packs",
    "name": "Data : 5GB | Validity : 30 days | Added benefit : JioHotstar Mobile Subscription for 30 days. Enjoy extra benefits with RC100 instead of RC77",
    "name_hi": "डेटा : 5जीबी | वैधता : 30 दिन | अतिरिक्त लाभ : डिज्नी+ हॉटस्टार मोबाइल सब्सक्रिप्शन 30 दिनों के लिए।",
    "price": 100,
    "validity": "30 days",
    "data": "5GB",
    "data_hi": "5जीबी",
    "callout": "New! Favorite Cricket Pack!",
    "ottServices_raw": [{ "id": "hotstar", "name": "Disney+ Hotstar", "name_hi": "डिज्नी+ हॉटस्टार", "logoSrc": "https://placehold.co/60x20/1E88E5/FFFFFF.png?text=D+H", "logoHint": "Disney Hotstar logo" }]
  },
  {
    "id": "airtel-33-1d",
    "category": "Recommended Packs",
    "name": "Data : 2GB | Validity : 1 day",
    "price": 33,
    "validity": "1 day",
    "data": "2GB",
    "callout": "Bestseller"
  },
  {
    "id": "airtel-409-28d-xstream",
    "category": "Recommended Packs",
    "planNameDisplay": "Airtel Xstream 409",
    "planNameDisplay_hi": "एयरटेल एक्सस्ट्रीम ४०९",
    "name": "Calls : Unlimited | Data : 2.5GB/Day | SMS : 100/Day | Validity : 28 days | Details : Airtel Xstream Play subscription with 23+ OTTs access (SonyLIV, Erosnow etc) for 28 days, UNLIMITED 5G data (over & above plan limit) | Talktime : Rs 5",
    "name_hi": "कॉल्स : अनलिमिटेड | डेटा : 2.5जीबी/दिन | एसएमएस : 100/दिन | वैधता : 28 दिन | विवरण : एयरटेल एक्सस्ट्रीम प्ले सब्सक्रिप्शन 23+ ओटीटी के साथ (सोनीलिव, इरोज़नाउ आदि) 28 दिनों के लिए, अनलिमिटेड 5जी डेटा | टॉकटाइम : रु 5",
    "price": 409,
    "validity": "28 days",
    "data": "2.5GB/Day",
    "data_hi": "2.5जीबी/दिन",
    "callout": "New! Free unlimited 5G",
    "isMostPopular": true,
    "ottServices_raw": [{ "id": "xstream", "name": "Airtel Xstream Play", "name_hi": "एयरटेल एक्सस्ट्रीम प्ले", "logoSrc": "https://placehold.co/64x24/FF0000/FFFFFF.png?text=Xstream", "logoHint": "Airtel Xstream logo" }]
  },
  {
    "id": "airtel-299-28d",
    "category": "Recommended Packs",
    "planNameDisplay": "Airtel Popular 299",
    "planNameDisplay_hi": "एयरटेल लोकप्रिय २९९",
    "name": "Calls : Unlimited | Data : 1.5GB/day | SMS : 100/day | Validity : 28 days",
    "name_hi": "कॉल्स : अनलिमिटेड | डेटा : 1.5जीबी/दिन | SMS : 100/दिन | वैधता : 28 दिन",
    "price": 299,
    "validity": "28 days",
    "data": "1.5GB/day",
    "data_hi": "1.5जीबी/दिन",
    "callout": "LAST RECHARGE",
    "isMostPopular": true,
  },
  // ... Add more diverse plans here if needed, ensuring they have unique IDs
  {
    "id": "airtel-859-84d-ul5g",
    "category": "Recommended Packs",
    "name": "Calls : Unlimited | Data : 2GB/day | SMS : 100/day | Validity : 84 days | Added benefit : Unlimited 5G available",
    "price": 859,
    "validity": "84 days",
    "data": "2GB/day",
    "callout": "Only ~Rs. 286/month"
  },
];


function parseValidity(validityStr?: string): number {
  if (!validityStr || typeof validityStr !== 'string') return 0;
  const lowerValidityStr = validityStr.toLowerCase();

  if (lowerValidityStr.includes("current pack validity")) return 0; 
  
  const parts = lowerValidityStr.split(" ");
  const duration = parseInt(parts[0]);
  if (isNaN(duration)) return 0;

  if (parts[1] && (parts[1].startsWith("day") || parts[1].startsWith("दिन"))) return duration;
  if (parts[1] && (parts[1].startsWith("month") || parts[1].startsWith("माह"))) return duration * 30;
  if (parts[1] && (parts[1].startsWith("hour") || parts[1].startsWith("घंटा"))) return Math.max(1, Math.ceil(duration / 24));
  
  return duration;
}

function extractFromPlanName(planName: string | undefined, keyword: string): string {
  if (!planName) return "N/A";
  const lowerPlanName = planName.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();
  const keywordIndex = lowerPlanName.indexOf(lowerKeyword);

  if (keywordIndex === -1) return "N/A";

  let substringAfterKeyword = planName.substring(keywordIndex + keyword.length);
  substringAfterKeyword = substringAfterKeyword.replace(/^[:\s]+/, '').replace(/[:\s]+$/, '');
  
  const nextPipeIndex = substringAfterKeyword.indexOf("|");
  return (nextPipeIndex === -1 ? substringAfterKeyword : substringAfterKeyword.substring(0, nextPipeIndex)).trim();
}

function transformRawPlanToTelecomPlan(rawPlan: any): TelecomPlan {
  const operator = "Airtel"; // Assuming Airtel for this dataset
  const planId = String(rawPlan.id || `${operator}-${rawPlan.price}-${(rawPlan.data || 'unknown').replace(/\s/g, '')}`);
  
  let planNameDisplay = rawPlan.planNameDisplay || `${operator} ${rawPlan.price}`;
  let planNameDisplay_hi = rawPlan.planNameDisplay_hi || planNameDisplay;

  let talktime = "N/A";
  let talktime_hi = "लागू नहीं";
  let sms = "N/A";
  let sms_hi = "लागू नहीं";
  const additionalBenefitsArray: string[] = [];
  const additionalBenefitsArray_hi: string[] = [];
  const ottServices: OttService[] = rawPlan.ottServices_raw || [];

  const nameString = typeof rawPlan.name === 'string' ? rawPlan.name : "";
  const nameHiString = typeof rawPlan.name_hi === 'string' ? rawPlan.name_hi : "";

  if (nameString.toLowerCase().includes("calls : unlimited")) {
    talktime = "Unlimited Calls";
    talktime_hi = "अनलिमिटेड कॉल्स";
  } else if (nameString.toLowerCase().includes("talktime :")) {
    talktime = extractFromPlanName(nameString, "Talktime :");
    talktime_hi = nameHiString ? extractFromPlanName(nameHiString, "टॉकटाइम :") : talktime;
  }

  if (nameString.toLowerCase().includes("sms :")) {
    sms = extractFromPlanName(nameString, "SMS :");
    sms_hi = nameHiString ? extractFromPlanName(nameHiString, "एसएमएस :") : sms;
  }
  
  let benefitSourceString = "";
  let benefitSourceString_hi = "";

  const detailsMatch = nameString.match(/(?:Details|Added benefit)\s*:\s*(.*)/i);
  if (detailsMatch && detailsMatch[1]) {
    benefitSourceString = detailsMatch[1].split('|')[0].trim();
  }
  const detailsMatchHi = nameHiString.match(/(?:विवरण|अतिरिक्त लाभ)\s*:\s*(.*)/i);
  if (detailsMatchHi && detailsMatchHi[1]) {
    benefitSourceString_hi = detailsMatchHi[1].split('|')[0].trim();
  }

  if (benefitSourceString) {
    additionalBenefitsArray.push(...benefitSourceString.split(/[,;]| and /i).map(b => b.trim()).filter(Boolean));
  } else if (rawPlan.callout && typeof rawPlan.callout === 'string' && rawPlan.callout.trim() !== "") {
    additionalBenefitsArray.push(rawPlan.callout.trim());
  }
  if (benefitSourceString_hi) {
    additionalBenefitsArray_hi.push(...benefitSourceString_hi.split(/[,;]| और /i).map(b => b.trim()).filter(Boolean));
  } else if (rawPlan.callout && typeof rawPlan.callout === 'string' && rawPlan.callout.trim() !== "" && additionalBenefitsArray.includes(rawPlan.callout.trim())) {
     additionalBenefitsArray_hi.push(`${rawPlan.callout.trim()} (अनु.)`); // Placeholder translation
  }


  return {
    id: planId,
    operator: operator,
    price: Number(rawPlan.price) || 0,
    data: String(rawPlan.data) || "N/A",
    data_hi: String(rawPlan.data_hi) || String(rawPlan.data) || "लागू नहीं",
    talktime: talktime,
    talktime_hi: talktime_hi,
    sms: sms,
    sms_hi: sms_hi,
    validity: parseValidity(rawPlan.validity),
    additionalBenefits: additionalBenefitsArray.length > 0 ? additionalBenefitsArray : undefined,
    additionalBenefits_hi: additionalBenefitsArray_hi.length > 0 ? additionalBenefitsArray_hi : undefined,
    category: String(rawPlan.category) || undefined,
    callout: rawPlan.callout || null,
    rechargeUrl: `https://www.airtel.in/prepaid-recharge/?packId=${planId}`,
    ottServices: ottServices.length > 0 ? ottServices : undefined,
    isMostPopular: !!(rawPlan.callout && typeof rawPlan.callout === 'string' && (rawPlan.callout.toLowerCase().includes("most popular") || rawPlan.callout.toLowerCase().includes("bestseller"))),
    planNameDisplay: planNameDisplay,
    planNameDisplay_hi: planNameDisplay_hi,
  };
}


export async function getTelecomPlans(filters: TelecomPlanFilter): Promise<TelecomPlan[]> {
  const allTransformedPlans: TelecomPlan[] = newNewMockPlansData
    .map(rawPlan => {
      try {
        const transformed = transformRawPlanToTelecomPlan(rawPlan);
        // Basic check for essential fields
        if (!transformed.id || typeof transformed.price !== 'number' || !transformed.data || typeof transformed.validity !== 'number') {
            // console.warn(`Plan dropped due to missing essential fields (ID: ${rawPlan.id || 'unknown'})`);
            return null;
        }
        return transformed;
      } catch (e) {
        // console.error(`Error transforming plan (ID: ${rawPlan.id || 'unknown'}):`, e);
        return null;
      }
    })
    .filter((plan): plan is TelecomPlan => plan !== null);
  
  let filteredPlans = [...allTransformedPlans];

  // Apply operator filter
  if (filters.operator) {
    filteredPlans = filteredPlans.filter(plan => plan.operator.toLowerCase() === filters.operator!.toLowerCase());
  }

  // Apply price filters
  if (filters.minPrice !== undefined) {
    filteredPlans = filteredPlans.filter(plan => plan.price >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined) {
    filteredPlans = filteredPlans.filter(plan => plan.price <= filters.maxPrice!);
  }

  // Apply data per day filter
  if (filters.dataPerDay) {
    const dataPerDayLower = filters.dataPerDay.toLowerCase();
    if (dataPerDayLower === 'other') {
      filteredPlans = filteredPlans.filter(plan => plan.data && !plan.data.toLowerCase().includes('/day'));
    } else {
      const dataAmount = dataPerDayLower.replace('/day','').trim();
      filteredPlans = filteredPlans.filter(plan => plan.data && plan.data.toLowerCase().startsWith(dataAmount));
    }
  }

  // Apply validity filter
  if (filters.validity !== undefined) {
    filteredPlans = filteredPlans.filter(plan => plan.validity === filters.validity);
  }

  // Apply additional feature filters
  if (filters.unlimitedCalls) {
    filteredPlans = filteredPlans.filter(plan => plan.talktime && plan.talktime.toLowerCase().includes('unlimited'));
  }
  if (filters.includeSms) {
    filteredPlans = filteredPlans.filter(plan => plan.sms && plan.sms !== "N/A" && plan.sms !== "");
  }
  // Note: International Roaming filter would require 'International Roaming' category or a specific benefit tag in data.
  // This is not fully implemented in the current mock data structure for this filter type.

  return filteredPlans;
}
