
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
  talktime: string;
  sms: string;
  validity: number;
  additionalBenefits?: string[]; // Changed to string[]
  rechargeUrl: string;
  id?: string;
  category?: string;
  callout?: string | null;
  ottServices?: OttService[];
  isMostPopular?: boolean;
  planNameDisplay?: string;
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
  additionalBenefits: z.array(z.string()).optional().describe("Any additional benefits offered by the plan as a list of strings."), // Changed to array
  rechargeUrl: z.string().describe("URL where the plan can be purchased."),
  id: z.string().optional().describe("Plan ID from the source data."),
  category: z.string().optional().describe("Category of the plan."),
  callout: z.string().nullable().optional().describe("Callout text for the plan."),
  ottServices: z.array(OttServiceSchema).optional().describe("List of OTT services included in the plan."),
  isMostPopular: z.boolean().optional().describe("Flag indicating if the plan is most popular."),
  planNameDisplay: z.string().optional().describe("A display-friendly name for the plan."),
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

const newNewMockPlansData = [
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
    "id": "18", // Data category example
    "category": "Data",
    "name": "Data: 15GB | Validity: 30 days | Details: 20+ OTTs with Airtel Xstream Play for 30 days",
    "price": 181,
    "validity": "30 days",
    "data": "15GB",
    "callout": "Free 20+ OTTs"
  },
  {
    "id": "70", // Data category example with multiple OTTs
    "category": "Data",
    "name": "Data : 1GB | Details :  Netflix, JioHotstar, Airtel Xstream Play & Zee5 for 1 month.",
    "price": 279,
    "validity": "1 month",
    "data": "1GB",
    "callout": null
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
  substringAfterKeyword = substringAfterKeyword.replace(/^[:\s]+/, ''); // Remove leading colon or space

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

  let planNameDisplay = rawPlan.operator || "Airtel"; // Default to Airtel
  if (rawPlan.name) {
      const nameParts = rawPlan.name.split('|');
      const firstPart = nameParts[0]?.trim();
      if (firstPart && !firstPart.toLowerCase().startsWith("data") && !firstPart.toLowerCase().startsWith("calls") && !firstPart.toLowerCase().startsWith("sms")) {
          planNameDisplay = firstPart;
      } else if (rawPlan.category) {
        planNameDisplay = `${rawPlan.operator || "Airtel"} ${rawPlan.category}`
      }
  }


  const ottServices: OttService[] = [];
  if (rawPlan.name && rawPlan.name.toLowerCase().includes("jiohotstar")) {
    ottServices.push({ id: "hotstar", name: "Disney+ Hotstar", logoSrc: "https://placehold.co/60x20/1E88E5/FFFFFF.png?text=D+H", logoHint: "Disney Hotstar logo" });
  }
  if (rawPlan.name && rawPlan.name.toLowerCase().includes("airtel xstream play")) {
    ottServices.push({ id: "xstream", name: "Airtel Xstream Play", logoSrc: "https://placehold.co/60x20/FF0000/FFFFFF.png?text=Xstream", logoHint: "Airtel Xstream logo" });
  }
   if (rawPlan.name && rawPlan.name.toLowerCase().includes("netflix")) {
    ottServices.push({ id: "netflix", name: "Netflix", logoSrc: "https://placehold.co/60x20/E50914/FFFFFF.png?text=Netflix", logoHint: "Netflix logo" });
  }
  if (rawPlan.name && rawPlan.name.toLowerCase().includes("zee5")) {
    ottServices.push({ id: "zee5", name: "ZEE5", logoSrc: "https://placehold.co/60x20/7D287D/FFFFFF.png?text=ZEE5", logoHint: "ZEE5 logo" });
  }


  let benefitsArray: string[] = [];
  let benefitSourceString = "";

  if (rawPlan.name && typeof rawPlan.name === 'string') {
    const detailsMatch = rawPlan.name.match(/Details\s*:\s*(.*)/i);
    const addedBenefitMatch = rawPlan.name.match(/Added benefit\s*:\s*(.*)/i);

    if (detailsMatch && detailsMatch[1]) {
      benefitSourceString = detailsMatch[1].trim();
    } else if (addedBenefitMatch && addedBenefitMatch[1]) {
      benefitSourceString = addedBenefitMatch[1].trim();
    }
    
    // Attempt to get a general description if specific details are not found
    if (!benefitSourceString) {
        let cleanedName = rawPlan.name;
        // Remove already parsed parts like Data, Validity, Calls, SMS, Talktime from the name string
        cleanedName = cleanedName.replace(/Data\s*:\s*[^|]*\|?/gi, '')
                                .replace(/Validity\s*:\s*[^|]*\|?/gi, '')
                                .replace(/Calls\s*:\s*[^|]*\|?/gi, '')
                                .replace(/SMS\s*:\s*[^|]*\|?/gi, '')
                                .replace(/Talktime\s*:\s*[^|]*\|?/gi, '')
                                .replace(/^\|\s*/, '').replace(/\s*\|\s*$/, '').trim(); // Trim leading/trailing pipes and spaces
        if(cleanedName && cleanedName.length > 10) { // Heuristic to avoid short/generic plan names
            benefitSourceString = cleanedName;
        }
    }
  }

  if (benefitSourceString) {
    benefitsArray = benefitSourceString
      .split(/\s*\|\s*|\s*&\s*|,\s*(?![^()]*\))|\.\s*(?=[A-Z])/g) // Split by |, &, comma not in parens, or period followed by capital
      .map(b => b.trim().replace(/\.$/,'')) // Trim and remove trailing period
      .filter(b => b && b.length > 3); // Filter out empty or very short strings
  }
  
  if (rawPlan.callout && rawPlan.callout.trim() !== "" && !benefitsArray.some(b => b.toLowerCase().includes(rawPlan.callout.toLowerCase().trim()))) {
    benefitsArray.push(rawPlan.callout.trim());
  }
  // Ensure OTT service names are not duplicated in additionalBenefits if already covered by ottServices
  ottServices.forEach(ott => {
    benefitsArray = benefitsArray.filter(b => !b.toLowerCase().includes(ott.name.toLowerCase()));
  });


  return {
    id: planId,
    operator: rawPlan.operator || "Airtel",
    price: rawPlan.price,
    data: rawPlan.data,
    talktime: talktime,
    sms: sms,
    validity: parseValidity(rawPlan.validity),
    additionalBenefits: benefitsArray.length > 0 ? benefitsArray : undefined,
    category: rawPlan.category,
    callout: rawPlan.callout || undefined,
    rechargeUrl: `https://www.airtel.in/prepaid-recharge/?packId=${planId}`, // More unique placeholder
    ottServices: ottServices.length > 0 ? ottServices : undefined,
    isMostPopular: isMostPopular,
    planNameDisplay: planNameDisplay.includes(String(rawPlan.price)) || planNameDisplay.length < 5 ? `${rawPlan.operator || "Airtel"} ${rawPlan.price}` : planNameDisplay,
  };
}


export async function getTelecomPlans(filters: TelecomPlanFilter): Promise<TelecomPlan[]> {
  const allTransformedPlans: TelecomPlan[] = newNewMockPlansData.map(transformRawPlanToTelecomPlan);
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
      filteredPlans = filteredPlans.filter(plan => plan.data.toLowerCase().startsWith(filters.dataPerDay!.toLowerCase().replace('/day','')));
    }
  }
  if (filters.validity !== undefined) {
    filteredPlans = filteredPlans.filter(plan => plan.validity === filters.validity);
  }

  // For now, return all transformed plans that pass basic filtering,
  // actual schema validation by Zod will happen at the AI flow/tool level.
  // return filteredPlans.filter(plan => TelecomPlanSchema.safeParse(plan).success);
  return filteredPlans;
}

    