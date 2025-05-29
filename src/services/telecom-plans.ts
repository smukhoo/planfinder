
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
  validity: number; // Always in days
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
  rechargeUrl: z.string().describe("URL where the plan can be purchased."), // Kept as string for flexibility
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

// Using the simpler mock data as requested
const newNewMockPlansData: any[] = [
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
    "ottServices_raw": []
  },
  {
    "id": "15",
    "category": "Recommended Packs",
    "name": "Data : 5GB | Validity : 30 days | Added benefit : JioHotstar Mobile Subscription for 30 days. Enjoy extra benefits with RC100 instead of RC77",
    "name_hi": "डेटा : 5जीबी | वैधता : 30 दिन | अतिरिक्त लाभ : JioHotstar मोबाइल सब्सक्रिप्शन 30 दिनों के लिए।",
    "price": 100,
    "validity": "30 days",
    "data": "5GB",
    "data_hi": "5जीबी",
    "callout": "New! Favorite Cricket Pack!",
    "ottServices_raw": [{ "id": "hotstar", "name": "Disney+ Hotstar", "name_hi": "डिज्नी+ हॉटस्टार", "logoSrc": "https://placehold.co/60x20/1E88E5/FFFFFF.png?text=D+H", "logoHint": "Disney Hotstar logo" }]
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
    "ottServices_raw": []
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
    "name_hi": "कॉल्स : अनलिमिटेड | डेटा : 2.5जीबी/दिन | SMS : 100/दिन | वैधता : 28 दिन | विवरण : एयरटेल एक्सस्ट्रीम प्ले सब्सक्रिप्शन 23+ ओटीटी के साथ (सोनीलिव, इरोज़नाउ आदि) 28 दिनों के लिए, अनलिमिटेड 5जी डेटा | टॉकटाइम : रु 5",
    "price": 409,
    "validity": "28 days",
    "data": "2.5GB/Day",
    "data_hi": "2.5जीबी/दिन",
    "callout": "New! Free unlimited 5G",
    "ottServices_raw": [{ "id": "xstream", "name": "Airtel Xstream Play", "name_hi": "एयरटेल एक्सस्ट्रीम प्ले", "logoSrc": "https://placehold.co/60x20/FF0000/FFFFFF.png?text=Xstream", "logoHint": "Airtel Xstream logo" }]
  },
  {
    "id": "61",
    "category": "Recommended Packs",
    "name": "Calls : Unlimited | Data : 1.5GB/day | SMS : 100/day | Validity : 28 days",
    "name_hi": "कॉल्स : अनलिमिटेड | डेटा : 1.5जीबी/दिन | SMS : 100/दिन | वैधता : 28 दिन",
    "price": 299,
    "validity": "28 days",
    "data": "1.5GB/day",
    "data_hi": "1.5जीबी/दिन",
    "callout": "LAST RECHARGE",
    "isMostPopular" : true,
    "ottServices_raw": []
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
    "id": "data-22", // Made ID unique
    "category": "Data",
    "name": "Data : 2GB | Validity : 1 day",
    "price": 33,
    "validity": "1 day",
    "data": "2GB",
    "callout": "Bestseller"
  },
  {
    "id": "data-51", // Made ID unique
    "category": "Data",
    "name": "Data : 1.5GB | Validity : 1 day",
    "price": 26,
    "validity": "1 day",
    "data": "1.5GB",
    "callout": "Bestseller"
  },
  {
    "id": "data-14", // Made ID unique
    "category": "Data",
    "name": "Data : Unlimited | Validity : 1 day",
    "price": 49,
    "validity": "1 day",
    "data": "Unlimited",
    "callout": "Best Value"
  },
  {
    "id": "data-48", // Made ID unique
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
    "callout": "Free 20+ OTTs",
    "ottServices_raw": [{ "id": "xstream", "name": "Airtel Xstream Play", "logoSrc": "https://placehold.co/60x20/FF0000/FFFFFF.png?text=Xstream", "logoHint": "Airtel Xstream logo" }]
  },
  {
    "id": "data-15", // Made ID unique for data category
    "category": "Data",
    "name": "Data : 5GB | Validity : 30 days | Added benefit : JioHotstar Mobile Subscription for 30 days. Enjoy extra benefits with RC100 instead of RC77",
    "price": 100,
    "validity": "30 days",
    "data": "5GB",
    "callout": "New! Favorite Cricket Pack!",
    "ottServices_raw": [{ "id": "hotstar", "name": "Disney+ Hotstar", "logoSrc": "https://placehold.co/60x20/1E88E5/FFFFFF.png?text=D+H", "logoHint": "Disney Hotstar logo" }]
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
    "validity": "1 Day", // Note: "Day" will be parsed to "day"
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
    "callout": "New! Best Cricket Pack!",
    "ottServices_raw": [{ "id": "hotstar", "name": "Disney+ Hotstar", "logoSrc": "https://placehold.co/60x20/1E88E5/FFFFFF.png?text=D+H", "logoHint": "Disney Hotstar logo" }]
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
    "callout": "New! Best cricket season pack!",
     "ottServices_raw": [{ "id": "hotstar", "name": "Disney+ Hotstar", "logoSrc": "https://placehold.co/60x20/1E88E5/FFFFFF.png?text=D+H", "logoHint": "Disney Hotstar logo" }]
  },
  {
    "id": "data-49", // Made ID unique
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
    "callout": "FREE 20+ OTTs",
    "ottServices_raw": [{ "id": "xstream", "name": "Airtel Xstream Play", "logoSrc": "https://placehold.co/60x20/FF0000/FFFFFF.png?text=Xstream", "logoHint": "Airtel Xstream logo" }]
  },
  {
    "id": "70",
    "category": "Data",
    "name": "Data : 1GB | Details :  Netflix, JioHotstar, Airtel Xstream Play & Zee5 for 1 month.",
    "price": 279,
    "validity": "1 month",
    "data": "1GB",
    "callout": null,
    "ottServices_raw": [
        { "id": "netflix", "name": "Netflix", "logoSrc": "https://placehold.co/60x20/E50914/FFFFFF.png?text=Netflix", "logoHint": "Netflix logo" },
        { "id": "hotstar", "name": "Disney+ Hotstar", "logoSrc": "https://placehold.co/60x20/1E88E5/FFFFFF.png?text=D+H", "logoHint": "Disney Hotstar logo" },
        { "id": "xstream", "name": "Airtel Xstream Play", "logoSrc": "https://placehold.co/60x20/FF0000/FFFFFF.png?text=Xstream", "logoHint": "Airtel Xstream logo" },
        { "id": "zee5", "name": "ZEE5", "logoSrc": "https://placehold.co/60x20/7D287D/FFFFFF.png?text=ZEE5", "logoHint": "ZEE5 logo" }
    ]
  },
  {
    "id": "cp_15", // Made ID unique
    "category": "Cricket Packs",
    "name": "Data : 5GB | Validity : 30 days | Added benefit : JioHotstar Mobile Subscription for 30 days. Enjoy extra benefits with RC100 instead of RC77",
    "price": 100,
    "validity": "30 days",
    "data": "5GB",
    "callout": "New! Favorite Cricket Pack!",
    "ottServices_raw": [{ "id": "hotstar", "name": "Disney+ Hotstar", "logoSrc": "https://placehold.co/60x20/1E88E5/FFFFFF.png?text=D+H", "logoHint": "Disney Hotstar logo" }]
  },
  {
    "id": "cp_65", // Made ID unique
    "category": "Cricket Packs",
    "name": "Data : 15GB | Details : JioHotstar Mobile subscription for 3 Months; Upgrade from Rs. 161 or Rs. 181 pack to enjoy extra benefits",
    "price": 195,
    "validity": "90 days",
    "data": "15GB",
    "callout": "New! Best Cricket Pack!",
    "ottServices_raw": [{ "id": "hotstar", "name": "Disney+ Hotstar", "logoSrc": "https://placehold.co/60x20/1E88E5/FFFFFF.png?text=D+H", "logoHint": "Disney Hotstar logo" }]
  },
  {
    "id": "cp_14", // Made ID unique
    "category": "Cricket Packs",
    "name": "Data : Unlimited | Validity : 1 day",
    "price": 49,
    "validity": "1 day",
    "data": "Unlimited",
    "callout": "Best Value"
  }
];


function parseValidity(validityStr?: string): number {
  if (!validityStr || typeof validityStr !== 'string') return 0;
  const lowerValidityStr = validityStr.toLowerCase();

  if (lowerValidityStr.includes("current pack validity")) return 0; // Or a specific flag if needed
  
  const parts = lowerValidityStr.split(" ");
  const duration = parseInt(parts[0]);
  if (isNaN(duration)) return 0;

  if (parts[1].startsWith("day")) return duration;
  if (parts[1].startsWith("month")) return duration * 30; // Approximate
  if (parts[1].startsWith("hour")) return Math.max(1, Math.ceil(duration / 24)); // Convert hours to days, min 1 day
  
  return duration; // Fallback if unit is missing but number exists
}

function extractFromPlanName(planName: string, keyword: string): string {
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
  const planId = String(rawPlan.id || `${operator}-${rawPlan.price}-${rawPlan.data?.replace(/\s/g, '') || 'unknown'}`);
  
  let planNameDisplay = `${operator} ${rawPlan.price}`; // Default plan name
  let talktime = "N/A";
  let sms = "N/A";
  const additionalBenefitsArray: string[] = [];
  const ottServices: OttService[] = rawPlan.ottServices_raw || [];

  if (rawPlan.name && typeof rawPlan.name === 'string') {
    const nameParts = rawPlan.name.split('|').map(p => p.trim());
    const firstPart = nameParts[0];

    // Attempt to find a better plan name
    if (firstPart && !firstPart.toLowerCase().startsWith("data :") && !firstPart.toLowerCase().startsWith("calls :") && !firstPart.toLowerCase().startsWith("sms :")) {
        planNameDisplay = firstPart;
    } else if (rawPlan.category) {
        planNameDisplay = `${operator} ${rawPlan.category}`;
    }
    
    // Extract talktime
    if (rawPlan.name.toLowerCase().includes("calls : unlimited")) {
      talktime = "Unlimited Calls";
    } else if (rawPlan.name.toLowerCase().includes("talktime :")) {
      talktime = extractFromPlanName(rawPlan.name, "Talktime :");
    }

    // Extract SMS
    if (rawPlan.name.toLowerCase().includes("sms :")) {
      sms = extractFromPlanName(rawPlan.name, "SMS :");
    }

    // Extract Additional Benefits from 'Details' or 'Added benefit'
    const detailsMatch = rawPlan.name.match(/(?:Details|Added benefit)\s*:\s*(.*)/i);
    if (detailsMatch && detailsMatch[1]) {
      const benefitsString = detailsMatch[1].split('|')[0].trim(); // Take content before next pipe if any
      additionalBenefitsArray.push(...benefitsString.split(/,|\s+and\s+/i).map(b => b.trim()).filter(Boolean));
    }
  }

  if (rawPlan.callout && typeof rawPlan.callout === 'string' && rawPlan.callout.trim() !== "") {
    additionalBenefitsArray.push(rawPlan.callout.trim());
  }
  
  const uniqueBenefits = [...new Set(additionalBenefitsArray.filter(b => b.length > 3))];

  return {
    id: planId,
    operator: operator,
    price: rawPlan.price,
    data: typeof rawPlan.data === 'string' ? rawPlan.data : "N/A",
    data_hi: typeof rawPlan.data_hi === 'string' ? rawPlan.data_hi : (typeof rawPlan.data === 'string' ? rawPlan.data : "लागू नहीं"),
    talktime: talktime,
    talktime_hi: rawPlan.name_hi && rawPlan.name_hi.toLowerCase().includes("कॉल्स : अनलिमिटेड") ? "अनलिमिटेड कॉल्स" : talktime,
    sms: sms,
    sms_hi: rawPlan.name_hi && rawPlan.name_hi.toLowerCase().includes("sms :") ? extractFromPlanName(rawPlan.name_hi, "SMS :") : sms,
    validity: parseValidity(rawPlan.validity),
    additionalBenefits: uniqueBenefits.length > 0 ? uniqueBenefits : undefined,
    additionalBenefits_hi: uniqueBenefits.length > 0 ? uniqueBenefits.map(b => `${b} (अनु.)`) : undefined, // Placeholder translation
    category: rawPlan.category,
    callout: rawPlan.callout || null,
    rechargeUrl: `https://www.airtel.in/prepaid-recharge/?packId=${planId}`, // Example URL
    ottServices: ottServices.length > 0 ? ottServices : undefined,
    isMostPopular: !!(rawPlan.callout && typeof rawPlan.callout === 'string' && (rawPlan.callout.toLowerCase().includes("most popular") || rawPlan.callout.toLowerCase().includes("bestseller"))),
    planNameDisplay: planNameDisplay,
    planNameDisplay_hi: rawPlan.name_hi ? rawPlan.name_hi.split('|')[0].trim() : planNameDisplay,
  };
}


export async function getTelecomPlans(filters: TelecomPlanFilter): Promise<TelecomPlan[]> {
  // const result = TelecomPlanListSchema.safeParse(newNewMockPlansData);
  // if (!result.success) {
  //   console.error("Mock data validation failed:", result.error.flatten());
  //   return []; // Return empty if primary data is invalid
  // }
  // const validRawPlans = result.data;

  const allTransformedPlans: TelecomPlan[] = newNewMockPlansData
    .map(rawPlan => {
      try {
        // More robust transformation or pre-validation of rawPlan fields if necessary
        const transformed = transformRawPlanToTelecomPlan(rawPlan);
        // Validate each transformed plan against the schema
        const validation = TelecomPlanSchema.safeParse(transformed);
        if (validation.success) {
          return validation.data;
        } else {
          // console.warn(`Plan dropped due to validation error (ID: ${rawPlan.id}):`, validation.error.flatten());
          return null;
        }
      } catch (e) {
        // console.error(`Error transforming plan (ID: ${rawPlan.id}):`, e);
        return null;
      }
    })
    .filter((plan): plan is TelecomPlan => plan !== null);
  
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
    const dataPerDayLower = filters.dataPerDay.toLowerCase();
    if (dataPerDayLower === 'other') {
      filteredPlans = filteredPlans.filter(plan => plan.data && !plan.data.toLowerCase().includes('/day'));
    } else {
      const dataAmount = dataPerDayLower.replace('/day','').trim();
      filteredPlans = filteredPlans.filter(plan => plan.data && plan.data.toLowerCase().startsWith(dataAmount));
    }
  }
  if (filters.validity !== undefined) {
    filteredPlans = filteredPlans.filter(plan => plan.validity === filters.validity);
  }
  
  return filteredPlans;
}
