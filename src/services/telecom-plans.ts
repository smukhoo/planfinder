
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
  rechargeUrl: z.string().describe("URL where the plan can be purchased."),
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
    "callout": "New! Favorite Cricket Pack!"
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
    "callout": "Bestseller"
  },
  {
    "id": "14",
    "category": "Recommended Packs",
    "name": "Data : Unlimited | Validity : 1 day",
    "name_hi": "डेटा : अनलिमिटेड | वैधता : 1 दिन",
    "price": 49,
    "validity": "1 day",
    "data": "Unlimited",
    "data_hi": "अनलिमिटेड",
    "callout": "Best Value"
  },
  {
    "id": "48",
    "category": "Recommended Packs",
    "name": "Data : 5GB | Validity : 7 days",
    "name_hi": "डेटा : 5जीबी | वैधता : 7 दिन",
    "price": 77,
    "validity": "7 days",
    "data": "5GB",
    "data_hi": "5जीबी",
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
    "callout": "LAST RECHARGE"
  },
  {
    "id": "27",
    "category": "Recommended Packs",
    "name": "Calls : Unlimited | Data : 2GB/day | SMS : 100/day | Validity : 84 days | Added benefit : Unlimited 5G available",
    "name_hi": "कॉल्स : अनलिमिटेड | डेटा : 2जीबी/दिन | SMS : 100/दिन | वैधता : 84 दिन | अतिरिक्त लाभ : अनलिमिटेड 5जी उपलब्ध",
    "price": 859,
    "validity": "84 days",
    "data": "2GB/day",
    "data_hi": "2जीबी/दिन",
    "callout": "Only ~Rs. 286/month"
  },
  {
    "id": "59",
    "category": "Recommended Packs",
    "name": "Calls : Unlimited | Data : 1.5GB/day | SMS : 100/day | Validity : 84 days",
    "name_hi": "कॉल्स : अनलिमिटेड | डेटा : 1.5जीबी/दिन | SMS : 100/दिन | वैधता : 84 दिन",
    "price": 799,
    "validity": "84 days",
    "data": "1.5GB/day",
    "data_hi": "1.5जीबी/दिन",
    "callout": "Only ~₹224/month"
  },
  // Simplified Data category for brevity
  {
    "id": "18_data",
    "category": "Data",
    "name": "Data: 15GB | Validity: 30 days | Details: 20+ OTTs with Airtel Xstream Play for 30 days",
    "name_hi": "डेटा: 15जीबी | वैधता: 30 दिन | विवरण: 20+ ओटीटी एयरटेल एक्सस्ट्रीम प्ले के साथ 30 दिनों के लिए",
    "price": 181,
    "validity": "30 days",
    "data": "15GB",
    "data_hi": "15जीबी",
    "callout": "Free 20+ OTTs",
    "ottServices_raw": [{ "id": "xstream", "name": "Airtel Xstream Play", "name_hi": "एयरटेल एक्सस्ट्रीम प्ले", "logoSrc": "https://placehold.co/60x20/FF0000/FFFFFF.png?text=Xstream", "logoHint": "Airtel Xstream logo" }]
  },
  {
    "id": "70_data_ott",
    "category": "Data",
    "name": "Data : 1GB | Details :  Netflix, JioHotstar, Airtel Xstream Play & Zee5 for 1 month.",
    "name_hi": "डेटा : 1जीबी | विवरण : नेटफ्लिक्स, जियोहॉटस्टार, एयरटेल एक्सस्ट्रीम प्ले और ज़ी5 1 महीने के लिए।",
    "price": 279,
    "validity": "1 month",
    "data": "1GB",
    "data_hi": "1जीबी",
    "callout": "All OTT Bundle",
    "ottServices_raw": [
        { "id": "netflix", "name": "Netflix", "name_hi": "नेटफ्लिक्स", "logoSrc": "https://placehold.co/60x20/E50914/FFFFFF.png?text=Netflix", "logoHint": "Netflix logo" },
        { "id": "hotstar", "name": "Disney+ Hotstar", "name_hi": "डिज्नी+ हॉटस्टार", "logoSrc": "https://placehold.co/60x20/1E88E5/FFFFFF.png?text=D+H", "logoHint": "Disney Hotstar logo" },
        { "id": "xstream", "name": "Airtel Xstream Play", "name_hi": "एयरटेल एक्सस्ट्रीम प्ले", "logoSrc": "https://placehold.co/60x20/FF0000/FFFFFF.png?text=Xstream", "logoHint": "Airtel Xstream logo" },
        { "id": "zee5", "name": "ZEE5", "name_hi": "ज़ी5", "logoSrc": "https://placehold.co/60x20/7D287D/FFFFFF.png?text=ZEE5", "logoHint": "ZEE5 logo" }
    ]
  },
  {
    "id": "cp_hotstar_90d",
    "category": "Cricket Packs",
    "name": "Data : 15GB | Details : JioHotstar Mobile subscription for 3 Months",
    "name_hi": "डेटा : 15जीबी | विवरण : जियोहॉटस्टार मोबाइल सब्सक्रिप्शन 3 महीने के लिए",
    "price": 195,
    "validity": "90 days",
    "data": "15GB",
    "data_hi": "15जीबी",
    "callout": "New! Best Cricket Pack!",
    "ottServices_raw": [{ "id": "hotstar", "name": "Disney+ Hotstar", "name_hi": "डिज्नी+ हॉटस्टार", "logoSrc": "https://placehold.co/60x20/1E88E5/FFFFFF.png?text=D+H", "logoHint": "Disney Hotstar logo" }]
  }
];


function parseValidity(validityStr?: string): number {
  if (!validityStr) return 0;
  const lowerValidityStr = validityStr.toLowerCase();

  if (lowerValidityStr.includes("current pack validity")) {
    // This is tricky as "current pack validity" depends on another active pack.
    // For simplicity in mock data, let's set it to a short, non-zero duration like 1 day,
    // or 0 if it means it uses the main pack's validity without adding its own.
    // For now, 0 implies it inherits, which might be fine for filtering if not explicitly searched.
    return 0; 
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

// Helper to extract specific details from the plan name string
function extractFromPlanName(planName: string, keyword: string): string {
  const lowerPlanName = planName.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();
  const keywordIndex = lowerPlanName.indexOf(lowerKeyword);

  if (keywordIndex === -1) return "N/A";

  let substringAfterKeyword = planName.substring(keywordIndex + keyword.length);
  // Remove leading colon or space, and trailing colon or space
  substringAfterKeyword = substringAfterKeyword.replace(/^[:\s]+/, '').replace(/[:\s]+$/, '');


  const nextPipeIndex = substringAfterKeyword.indexOf("|");
  if (nextPipeIndex === -1) {
    return substringAfterKeyword.trim();
  }
  return substringAfterKeyword.substring(0, nextPipeIndex).trim();
}


function transformRawPlanToTelecomPlan(rawPlan: any): TelecomPlan {
  const operator = "Airtel"; // Assuming Airtel for this dataset
  const planId = String(rawPlan.id || `${operator}-${rawPlan.price}-${rawPlan.data?.replace(/\s/g, '')}`);

  let talktime = "N/A";
  let sms = "N/A";
  let planNameDisplay = rawPlan.planNameDisplay || `${operator} Plan`;
  let additionalBenefitsArray: string[] = [];
  let benefitSourceString = "";
  let nameParts: string[] = [];

  if (rawPlan.name && typeof rawPlan.name === 'string') {
    nameParts = rawPlan.name.split('|').map(p => p.trim());
    const firstPart = nameParts[0];

    if (firstPart && !firstPart.toLowerCase().startsWith("data") && !firstPart.toLowerCase().startsWith("calls") && !firstPart.toLowerCase().startsWith("sms") && !firstPart.toLowerCase().startsWith("talktime")) {
      planNameDisplay = firstPart;
    } else if (rawPlan.category) {
      planNameDisplay = `${operator} ${rawPlan.category}`;
    } else {
       planNameDisplay = `${operator} ${rawPlan.price}`;
    }
    if(planNameDisplay.includes(String(rawPlan.price)) || planNameDisplay.length < 5) {
        planNameDisplay = `${operator} ${rawPlan.price}`;
    }


    if (rawPlan.name.toLowerCase().includes("calls : unlimited")) {
      talktime = "Unlimited Calls";
    } else if (rawPlan.name.toLowerCase().includes("talktime :")) {
      talktime = extractFromPlanName(rawPlan.name, "Talktime :");
    }

    if (rawPlan.name.toLowerCase().includes("sms :")) {
      sms = extractFromPlanName(rawPlan.name, "SMS :");
    }

    const detailsMatch = rawPlan.name.match(/Details\s*:\s*(.*)/i);
    const addedBenefitMatch = rawPlan.name.match(/Added benefit\s*:\s*(.*)/i);

    if (detailsMatch && detailsMatch[1]) {
      benefitSourceString = detailsMatch[1].trim();
    } else if (addedBenefitMatch && addedBenefitMatch[1]) {
      benefitSourceString = addedBenefitMatch[1].trim();
    }
  }
  
  if (!benefitSourceString && nameParts.length > 1) {
      const potentialBenefitPart = nameParts.find(part => part.toLowerCase().includes("details :") || part.toLowerCase().includes("added benefit :"));
      if (potentialBenefitPart) {
          benefitSourceString = potentialBenefitPart.split(/details\s*:|added benefit\s*:/i)[1]?.trim() || "";
      } else {
          // Fallback: use parts of the name not directly related to data/calls/sms/validity
          const nonCoreParts = nameParts.filter(part => 
              !part.toLowerCase().startsWith("data") &&
              !part.toLowerCase().startsWith("calls") &&
              !part.toLowerCase().startsWith("sms") &&
              !part.toLowerCase().startsWith("validity") &&
              !part.toLowerCase().startsWith("talktime") &&
              part !== planNameDisplay // Avoid repeating the plan name itself
          );
          if (nonCoreParts.length > 0) {
              benefitSourceString = nonCoreParts.join(' | ');
          }
      }
  }


  if (benefitSourceString) {
    additionalBenefitsArray = benefitSourceString
      .split(/\s*\|\s*|\s*&\s*|,\s*(?![^()]*\))|\.\s*(?=[A-Z])|\s+and\s+/gi)
      .map(b => b.trim().replace(/\.$/, '').replace(/^Rs\s*\d+/i, '').trim())
      .filter(b => b && b.length > 3 && !b.toLowerCase().includes("validity") && !b.toLowerCase().includes("talktime"));
  }

  if (rawPlan.callout && rawPlan.callout.trim() !== "" && !additionalBenefitsArray.some(b => b.toLowerCase().includes(rawPlan.callout!.toLowerCase().trim()))) {
    additionalBenefitsArray.push(rawPlan.callout.trim());
  }
  
  const ottServices: OttService[] = rawPlan.ottServices_raw || [];
  ottServices.forEach(ott => {
    additionalBenefitsArray = additionalBenefitsArray.filter(benefit => !benefit.toLowerCase().includes(ott.name.toLowerCase()));
  });
  additionalBenefitsArray = [...new Set(additionalBenefitsArray)];


  return {
    id: planId,
    operator: operator,
    price: rawPlan.price,
    data: rawPlan.data || "N/A",
    data_hi: rawPlan.data_hi || rawPlan.data || "लागू नहीं",
    talktime: talktime,
    talktime_hi: rawPlan.name_hi && rawPlan.name_hi.toLowerCase().includes("कॉल्स : अनलिमिटेड") ? "अनलिमिटेड कॉल्स" : talktime,
    sms: sms,
    sms_hi: rawPlan.name_hi && rawPlan.name_hi.toLowerCase().includes("sms :") ? extractFromPlanName(rawPlan.name_hi, "SMS :") : sms,
    validity: parseValidity(rawPlan.validity),
    additionalBenefits: additionalBenefitsArray.length > 0 ? additionalBenefitsArray : undefined,
    additionalBenefits_hi: rawPlan.additionalBenefits_hi_raw || (additionalBenefitsArray.length > 0 ? additionalBenefitsArray.map(b => `${b} (अनुवादित)`) : undefined),
    category: rawPlan.category,
    callout: rawPlan.callout || null,
    rechargeUrl: `https://www.airtel.in/prepaid-recharge/?packId=${planId}`, // Using a template, as full URLs aren't in this data
    ottServices: ottServices.length > 0 ? ottServices : undefined,
    isMostPopular: !!(rawPlan.callout && (rawPlan.callout.toLowerCase().includes("most popular") || rawPlan.callout.toLowerCase().includes("bestseller"))),
    planNameDisplay: planNameDisplay,
    planNameDisplay_hi: rawPlan.name_hi ? rawPlan.name_hi.split('|')[0].trim() : planNameDisplay,
  };
}


export async function getTelecomPlans(filters: TelecomPlanFilter): Promise<TelecomPlan[]> {
  const allTransformedPlans: TelecomPlan[] = newNewMockPlansData.map(rawPlan => transformRawPlanToTelecomPlan(rawPlan));
  
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
      const dataAmount = filters.dataPerDay.toLowerCase().replace('/day','').replace('gb','').trim();
      filteredPlans = filteredPlans.filter(plan => plan.data.toLowerCase().startsWith(dataAmount));
    }
  }
  if (filters.validity !== undefined) {
    filteredPlans = filteredPlans.filter(plan => plan.validity === filters.validity);
  }

  // For debugging: console.log all plans that *passed* transformation before filtering
  // console.log("Transformed plans before filtering:", allTransformedPlans.length);
  // console.log("Filtered plans count:", filteredPlans.length);
  // if(filteredPlans.length === 0 && allTransformedPlans.length > 0) {
  //   console.log("All plans were filtered out. First transformed plan for inspection:", allTransformedPlans[0]);
  // }


  return filteredPlans;
}

