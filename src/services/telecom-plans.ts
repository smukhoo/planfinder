
import { z } from 'zod';

/**
 * Represents an OTT service included in a plan.
 */
export interface OttService {
  id: string;
  name: string;
  logoSrc: string;
  logoHint: string;
}
export const OttServiceSchema = z.object({
  id: z.string(),
  name: z.string(),
  logoSrc: z.string().url().or(z.string().startsWith('https://placehold.co')), // Allow placeholder URLs
  logoHint: z.string(),
});


/**
 * Represents a mobile recharge plan.
 */
export interface TelecomPlan {
  /**
   * The name of the operator (e.g., Airtel, Jio, Vi).
   */
  operator: string;
  /**
   * The price of the plan in INR.
   */
  price: number;
  /**
   * The amount of data provided by the plan (e.g., '2GB/day', 'Unlimited').
   */
  data: string;
  /**
   * The talktime offered by the plan (e.g., 'Unlimited Calls', '₹200 Talktime').
   */
  talktime: string;
  /**
   * The number of SMS messages included (e.g., '100/day', 'Unlimited').
   */
  sms: string;
  /**
   * The validity period of the plan in days.
   */
  validity: number;
  /**
   * Any additional benefits offered by the plan (e.g., 'Includes Prime Video', 'Free Wynk Music').
   */
  additionalBenefits?: string;
  /**
   * URL where the plan can be purchased
   */
  rechargeUrl: string;
  /**
   * Plan ID from the source data
   */
  id?: string;
  /**
   * Category of the plan
   */
  category?: string;
   /**
   * Callout text for the plan
   */
  callout?: string | null;
  /**
   * Array of OTT services included in the plan.
   */
  ottServices?: OttService[];
}

/**
 * Zod schema for TelecomPlan.
 */
export const TelecomPlanSchema = z.object({
  operator: z.string().describe("The name of the operator (e.g., Airtel, Jio, Vi)."),
  price: z.number().describe("The price of the plan in INR."),
  data: z.string().describe("The amount of data provided by the plan (e.g., '2GB/day', 'Unlimited')."),
  talktime: z.string().optional().describe("The talktime offered by the plan (e.g., 'Unlimited Calls', '₹200 Talktime')."),
  sms: z.string().optional().describe("The number of SMS messages included (e.g., '100/day', 'Unlimited')."),
  validity: z.number().describe("The validity period of the plan in days."),
  additionalBenefits: z.string().optional().describe("Any additional benefits offered by the plan."),
  rechargeUrl: z.string().describe("URL where the plan can be purchased."), // Relaxed from .url() for mock data flexibility
  id: z.string().optional().describe("Plan ID from the source data."),
  category: z.string().optional().describe("Category of the plan."),
  callout: z.string().nullable().optional().describe("Callout text for the plan."),
  ottServices: z.array(OttServiceSchema).optional().describe("List of OTT services included in the plan."),
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

const newMockPlansData = [
  {
    "id": "51",
    "category": "Recommended Packs",
    "name": "Data : 1.5GB | Validity : 1 day",
    "price": 26,
    "validity": "1 day",
    "data": "1.5GB",
    "callout": "Bestseller"
  },
  {
    "id": "15",
    "category": "Recommended Packs",
    "name": "Data : 5GB | Validity : 30 days | Added benefit : Disney+ Hotstar Mobile Subscription for 30 days. Enjoy extra benefits with RC100 instead of RC77",
    "price": 100,
    "validity": "30 days",
    "data": "5GB",
    "callout": "New! Favorite Cricket Pack!",
    "ottServices": [
      { "id": "hotstar", "name": "Disney+ Hotstar", "logoSrc": "https://placehold.co/80x30.png", "logoHint": "Disney Hotstar logo" }
    ]
  },
  {
    "id": "22",
    "category": "Recommended Packs",
    "name": "Data : 2GB | Validity : 1 day",
    "price": 33,
    "validity": "1 day",
    "data": "2GB",
    "callout": "Bestseller"
  },
  {
    "id": "14",
    "category": "Recommended Packs",
    "name": "Data : Unlimited | Validity : 1 day",
    "price": 49,
    "validity": "1 day",
    "data": "Unlimited",
    "callout": "Best Value"
  },
  {
    "id": "48",
    "category": "Recommended Packs",
    "name": "Data : 5GB | Validity : 7 days",
    "price": 77,
    "validity": "7 days",
    "data": "5GB",
    "callout": "New! Benefits revised"
  },
  {
    "id": "41",
    "category": "Recommended Packs",
    "name": "Calls : Unlimited | Data : 2.5GB/Day | SMS : 100/Day | Validity : 28 days | Details : Airtel Xstream Play subscription with 23+ OTTs access (SonyLIV, Erosnow etc) for 28 days, UNLIMITED 5G data (over & above plan limit) | Talktime : Rs 5",
    "price": 409,
    "validity": "28 days",
    "data": "2.5GB/Day",
    "callout": "New! Free unlimited 5G",
    "ottServices": [
      { "id": "xstream", "name": "Airtel Xstream Play", "logoSrc": "https://placehold.co/80x30.png", "logoHint": "Airtel Xstream logo" },
      { "id": "sonyliv", "name": "SonyLIV", "logoSrc": "https://placehold.co/80x30.png", "logoHint": "SonyLIV logo" }
    ]
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
    "data": "2GB/day",
    "callout": "Only ~Rs. 286/month"
  },
  {
    "id": "59",
    "category": "Recommended Packs",
    "name": "Calls : Unlimited | Data : 1.5GB/day | SMS : 100/day | Validity : 84 days",
    "price": 799,
    "validity": "84 days",
    "data": "1.5GB/day",
    "callout": "Only ~₹224/month"
  },
  {
    "id": "18",
    "category": "Data",
    "name": "Data: 15GB | Validity: 30 days | Details: 20+ OTTs with Airtel Xstream Play for 30 days",
    "price": 181,
    "validity": "30 days",
    "data": "15GB",
    "callout": "Free 20+ OTTs",
     "ottServices": [
      { "id": "xstream", "name": "Airtel Xstream Play", "logoSrc": "https://placehold.co/80x30.png", "logoHint": "Airtel Xstream logo" }
    ]
  },
  {
    "id": "70",
    "category": "Data",
    "name": "Data : 1GB | Details :  Netflix, Disney+ Hotstar, Airtel Xstream Play & Zee5 for 1 month.",
    "price": 279,
    "validity": "1 month",
    "data": "1GB",
    "callout": null,
    "ottServices": [
        { "id": "netflix", "name": "Netflix", "logoSrc": "https://placehold.co/80x30.png", "logoHint": "Netflix logo" },
        { "id": "hotstar", "name": "Disney+ Hotstar", "logoSrc": "https://placehold.co/80x30.png", "logoHint": "Disney Hotstar logo" },
        { "id": "xstream", "name": "Airtel Xstream Play", "logoSrc": "https://placehold.co/80x30.png", "logoHint": "Airtel Xstream logo" },
        { "id": "zee5", "name": "Zee5", "logoSrc": "https://placehold.co/80x30.png", "logoHint": "Zee5 logo" }
    ]
  }
];


function parseValidity(validityStr: string): number {
  if (!validityStr) return 0;
  const lowerValidityStr = validityStr.toLowerCase();

  if (lowerValidityStr.includes("current pack validity")) {
    return 0; // Or specific handling if current pack validity can be determined
  }
  const parts = lowerValidityStr.split(" ");
  const duration = parseInt(parts[0]);
  if (isNaN(duration)) return 0;

  if (parts[1].startsWith("day")) {
    return duration;
  } else if (parts[1].startsWith("month")) {
    return duration * 30; // Approximate
  } else if (parts[1].startsWith("hour")) {
    return 1; // Treat as 1 day for simplicity
  }
  return 0;
}

function extractFromPlanName(planName: string, keyword: string): string {
  const lowerPlanName = planName.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();
  const keywordIndex = lowerPlanName.indexOf(lowerKeyword);

  if (keywordIndex === -1) return "N/A";

  let substringAfterKeyword = planName.substring(keywordIndex + keyword.length);
  
  // Remove leading colon or space if present
  substringAfterKeyword = substringAfterKeyword.replace(/^[:\s]+/, '');


  const nextPipeIndex = substringAfterKeyword.indexOf("|");
  
  if (nextPipeIndex === -1) {
    return substringAfterKeyword.trim();
  }
  return substringAfterKeyword.substring(0, nextPipeIndex).trim();
}


/**
 * Transforms a raw plan object from the new data source into the standardized TelecomPlan format.
 * @param rawPlan A plan object from the new mock data.
 * @returns A TelecomPlan object.
 */
function transformRawPlanToTelecomPlan(rawPlan: any): TelecomPlan {
  let talktime = "N/A";
  if (rawPlan.name.toLowerCase().includes("calls : unlimited")) {
    talktime = "Unlimited Calls";
  } else if (rawPlan.name.toLowerCase().includes("talktime :")) {
    talktime = extractFromPlanName(rawPlan.name, "Talktime :");
  }
  
  let sms = "N/A";
  if (rawPlan.name.toLowerCase().includes("sms :")) {
    sms = extractFromPlanName(rawPlan.name, "SMS :");
  }

  let benefitsString = rawPlan.name;
  // Remove parts already covered by other fields to avoid redundancy in additionalBenefits
  benefitsString = benefitsString.replace(/Data\s*:\s*[^|]+\s*\|?/gi, '')
                                     .replace(/Validity\s*:\s*[^|]+\s*\|?/gi, '')
                                     .replace(/Calls\s*:\s*[^|]+\s*\|?/gi, '')
                                     .replace(/SMS\s*:\s*[^|]+\s*\|?/gi, '')
                                     .replace(/Talktime\s*:\s*[^|]+\s*\|?/gi, '')
                                     .replace(/\|\s*$/, '') // Remove trailing pipe
                                     .replace(/^\s*\|\s*/, '') // Remove leading pipe
                                     .replace(/^Details\s*:\s*/i, '') // Remove "Details :" prefix
                                     .trim();
  
  if (rawPlan.callout && rawPlan.callout.trim() !== "") {
    if (benefitsString && benefitsString !== rawPlan.callout) {
        benefitsString = `${benefitsString} | ${rawPlan.callout}`;
    } else {
        benefitsString = rawPlan.callout;
    }
  }
  
  const planId = String(rawPlan.id || rawPlan.price); // Ensure ID is a string
  const rechargeUrl = `https://www.airtel.in/prepaid-recharge/?packId=${planId}`; // Placeholder with slight uniqueness

  return {
    id: planId,
    operator: "Airtel", // Assuming all data is for Airtel for now
    price: rawPlan.price,
    data: rawPlan.data,
    talktime: talktime,
    sms: sms,
    validity: parseValidity(rawPlan.validity),
    additionalBenefits: benefitsString || undefined,
    category: rawPlan.category,
    callout: rawPlan.callout || undefined,
    rechargeUrl: rechargeUrl,
    ottServices: rawPlan.ottServices || undefined, // Pass through if it exists
  };
}


/**
 * Asynchronously retrieves a list of telecom plans based on specified filters.
 *
 * @param filters An object containing filter criteria for telecom plans.
 * @returns A promise that resolves to an array of TelecomPlan objects.
 */
export async function getTelecomPlans(filters: TelecomPlanFilter): Promise<TelecomPlan[]> {
  const allTransformedPlans: TelecomPlan[] = newMockPlansData.map(transformRawPlanToTelecomPlan);

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
      filteredPlans = filteredPlans.filter(plan => !plan.data.toLowerCase().includes('/day'));
    } else {
      // Handles cases like "1.5GB/day" matching "1.5GB"
      filteredPlans = filteredPlans.filter(plan => plan.data.toLowerCase().startsWith(filters.dataPerDay!.toLowerCase().replace('/day','')));
    }
  }
  if (filters.validity !== undefined) {
    filteredPlans = filteredPlans.filter(plan => plan.validity === filters.validity);
  }
  
  // For debugging, you can log the plans before and after schema validation
  // console.log("Transformed Plans before schema validation:", filteredPlans.length, filteredPlans[0]);

  // The safeParse step will be handled by the AI flow's tool definition schema
  // return filteredPlans.filter(plan => TelecomPlanSchema.safeParse(plan).success);
  return filteredPlans;
}
