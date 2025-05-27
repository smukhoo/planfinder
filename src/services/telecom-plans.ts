
import { z } from 'zod';

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
}

/**
 * Zod schema for TelecomPlan.
 */
export const TelecomPlanSchema = z.object({
  operator: z.string().describe("The name of the operator (e.g., Airtel, Jio, Vi)."),
  price: z.number().describe("The price of the plan in INR."),
  data: z.string().describe("The amount of data provided by the plan (e.g., '2GB/day', 'Unlimited')."),
  talktime: z.string().describe("The talktime offered by the plan (e.g., 'Unlimited Calls', '₹200 Talktime')."),
  sms: z.string().describe("The number of SMS messages included (e.g., '100/day', 'Unlimited')."),
  validity: z.number().describe("The validity period of the plan in days."),
  additionalBenefits: z.string().optional().describe("Any additional benefits offered by the plan."),
  rechargeUrl: z.string().url().describe("URL where the plan can be purchased."),
  id: z.string().optional().describe("Plan ID from the source data."),
  category: z.string().optional().describe("Category of the plan."),
  callout: z.string().nullable().optional().describe("Callout text for the plan."),
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
    "name": "Data : 5GB | Validity : 30 days | Added benefit : JioHotstar Mobile Subscription for 30 days. Enjoy extra benefits with RC100 instead of RC77",
    "price": 100,
    "validity": "30 days",
    "data": "5GB",
    "callout": "New! Favorite Cricket Pack!"
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
    "callout": "New! Free unlimited 5G"
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
    "id": "22",
    "category": "Data",
    "name": "Data : 2GB | Validity : 1 day",
    "price": 33,
    "validity": "1 day",
    "data": "2GB",
    "callout": "Bestseller"
  },
  {
    "id": "51",
    "category": "Data",
    "name": "Data : 1.5GB | Validity : 1 day",
    "price": 26,
    "validity": "1 day",
    "data": "1.5GB",
    "callout": "Bestseller"
  },
  {
    "id": "14",
    "category": "Data",
    "name": "Data : Unlimited | Validity : 1 day",
    "price": 49,
    "validity": "1 day",
    "data": "Unlimited",
    "callout": "Best Value"
  },
  {
    "id": "48",
    "category": "Data",
    "name": "Data : 5GB | Validity : 7 days",
    "price": 77,
    "validity": "7 days",
    "data": "5GB",
    "callout": "New! Benefits revised"
  },
  {
    "id": "18",
    "category": "Data",
    "name": "Data: 15GB | Validity: 30 days | Details: 20+ OTTs with Airtel Xstream Play for 30 days",
    "price": 181,
    "validity": "30 days",
    "data": "15GB",
    "callout": "Free 20+ OTTs"
  },
  {
    "id": "15",
    "category": "Data",
    "name": "Data : 5GB | Validity : 30 days | Added benefit : JioHotstar Mobile Subscription for 30 days. Enjoy extra benefits with RC100 instead of RC77",
    "price": 100,
    "validity": "30 days",
    "data": "5GB",
    "callout": "New! Favorite Cricket Pack!"
  },
  {
    "id": "31",
    "category": "Data",
    "name": "Data : Unlimited | Details: Revised price for Rs 79 pack",
    "price": 99,
    "validity": "2 days",
    "data": "Unlimited",
    "callout": "NEW! Unlimited Data"
  },
  {
    "id": "39",
    "category": "Data",
    "name": "Data : 1GB | Details: 1GB data valid for the same day till midnight, Revised price for Rs 19 pack",
    "price": 22,
    "validity": "1 Day",
    "data": "1GB",
    "callout": null
  },
  {
    "id": "33",
    "category": "Data",
    "name": "Data: 12 GB | Validity: 30 days",
    "price": 161,
    "validity": "30 days",
    "data": "12 GB",
    "callout": null
  },
  {
    "id": "65",
    "category": "Data",
    "name": "Data : 15GB | Details : JioHotstar Mobile subscription for 3 Months; Upgrade from Rs. 161 or Rs. 181 pack to enjoy extra benefits",
    "price": 195,
    "validity": "90 days",
    "data": "15GB",
    "callout": "New! Best Cricket Pack!"
  },
  {
    "id": "35",
    "category": "Data",
    "name": "Data : 1GB/day | Details: Revised price for Rs 181 pack",
    "price": 211,
    "validity": "30 days",
    "data": "1GB/day",
    "callout": null
  },
  {
    "id": "68",
    "category": "Data",
    "name": "Data : 50GB | Details : JioHotstar Mobile subscription for 3 Months",
    "price": 451,
    "validity": "30 days",
    "data": "50GB",
    "callout": "New! Best cricket season pack!"
  },
  {
    "id": "49",
    "category": "Data",
    "name": "Data: 50GB | Validity: 30 days",
    "price": 361,
    "validity": "30 days",
    "data": "50GB",
    "callout": null
  },
  {
    "id": "34",
    "category": "Data",
    "name": "Data : Unlimited",
    "price": 11,
    "validity": "1 hour",
    "data": "Unlimited",
    "callout": "NEW! Unlimited Data!"
  },
  {
    "id": "50",
    "category": "Data",
    "name": "Data: 6GB | Validity: 30 days",
    "price": 121,
    "validity": "30 days",
    "data": "6GB",
    "callout": null
  },
  {
    "id": "46",
    "category": "Data",
    "name": "Data : 3GB | Details: Unlimited 5G data",
    "price": 51,
    "validity": "Current Pack Validity",
    "data": "3GB",
    "callout": "New! UL 5G Add-on"
  },
  {
    "id": "17",
    "category": "Data",
    "name": "Data : 1GB | Details : 20+ OTTs with Airtel Xstream Play for 30 days",
    "price": 149,
    "validity": "Current Pack Validity",
    "data": "1GB",
    "callout": "FREE 20+ OTTs"
  },
  {
    "id": "70",
    "category": "Data",
    "name": "Data : 1GB | Details :  Netflix, JioHotstar, Airtel Xstream Play & Zee5 for 1 month.",
    "price": 279,
    "validity": "1 month",
    "data": "1GB",
    "callout": null
  },
  {
    "id": "15",
    "category": "Cricket Packs",
    "name": "Data : 5GB | Validity : 30 days | Added benefit : JioHotstar Mobile Subscription for 30 days. Enjoy extra benefits with RC100 instead of RC77",
    "price": 100,
    "validity": "30 days",
    "data": "5GB",
    "callout": "New! Favorite Cricket Pack!"
  },
  {
    "id": "65",
    "category": "Cricket Packs",
    "name": "Data : 15GB | Details : JioHotstar Mobile subscription for 3 Months; Upgrade from Rs. 161 or Rs. 181 pack to enjoy extra benefits",
    "price": 195,
    "validity": "90 days",
    "data": "15GB",
    "callout": "New! Best Cricket Pack!"
  },
  {
    "id": "14",
    "category": "Cricket Packs",
    "name": "Data : Unlimited | Validity : 1 day",
    "price": 49,
    "validity": "1 day",
    "data": "Unlimited",
    "callout": "Best Value"
  }
];


function parseValidity(validityStr: string): number {
  if (validityStr.toLowerCase().includes("current pack validity")) {
    return 0; // Or some other indicator for "uses current pack validity"
  }
  const parts = validityStr.toLowerCase().split(" ");
  const duration = parseInt(parts[0]);
  if (isNaN(duration)) return 0;

  if (parts[1].startsWith("day")) {
    return duration;
  } else if (parts[1].startsWith("month")) {
    return duration * 30; // Approximate
  } else if (parts[1].startsWith("hour")) {
    return 1; // Treat as 1 day for simplicity in our current model
  }
  return 0;
}

function extractFromPlanName(planName: string, keyword: string): string {
  const keywordIndex = planName.indexOf(keyword);
  if (keywordIndex === -1) return "N/A";

  const substringAfterKeyword = planName.substring(keywordIndex + keyword.length);
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

  let additionalBenefits = rawPlan.name;
  if (rawPlan.callout && rawPlan.callout.trim() !== "") {
    additionalBenefits += ` | ${rawPlan.callout}`;
  }
  // Remove parts already covered by other fields to avoid redundancy in additionalBenefits
  additionalBenefits = additionalBenefits.replace(/Data\s*:\s*[^|]+\s*\|?/i, '')
                                     .replace(/Validity\s*:\s*[^|]+\s*\|?/i, '')
                                     .replace(/Calls\s*:\s*[^|]+\s*\|?/i, '')
                                     .replace(/SMS\s*:\s*[^|]+\s*\|?/i, '')
                                     .replace(/Talktime\s*:\s*[^|]+\s*\|?/i, '')
                                     .replace(/\|\s*$/, '') // Remove trailing pipe
                                     .replace(/^\s*\|\s*/, '') // Remove leading pipe
                                     .trim();
  
  if (additionalBenefits === rawPlan.callout || additionalBenefits === "") {
    additionalBenefits = rawPlan.callout || undefined;
  }


  return {
    id: rawPlan.id,
    operator: "Airtel", // Assuming all data is for Airtel
    price: rawPlan.price,
    data: rawPlan.data,
    talktime: talktime,
    sms: sms,
    validity: parseValidity(rawPlan.validity),
    additionalBenefits: additionalBenefits || undefined,
    category: rawPlan.category,
    callout: rawPlan.callout,
    rechargeUrl: "https://www.airtel.in/prepaid-recharge" // Default URL
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
    // Since we assume all data is Airtel, this might filter out everything if another operator is requested.
    // Or, if the intent is to only show Airtel, this works.
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
      filteredPlans = filteredPlans.filter(plan => plan.data.toLowerCase().includes(filters.dataPerDay!.toLowerCase().replace('/day','')));
    }
  }
  if (filters.validity !== undefined) {
    filteredPlans = filteredPlans.filter(plan => plan.validity === filters.validity);
  }
  
  return filteredPlans.filter(plan => TelecomPlanSchema.safeParse(plan).success);
}
