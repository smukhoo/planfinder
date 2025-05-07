
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

// Ensure mock data conforms to the schema for consistency, although it's not strictly enforced at runtime for this mock.
const mockPlansData: TelecomPlan[] = [
  {
    operator: 'Jio',
    price: 299,
    data: '2GB/day',
    talktime: 'Unlimited Calls',
    sms: '100/day',
    validity: 28,
    additionalBenefits: 'Jio Apps Subscription',
    rechargeUrl: 'https://www.jio.com/selfcare/plans/mobility/jio-phone-plans/'
  },
  {
    operator: 'Airtel',
    price: 399,
    data: '1.5GB/day',
    talktime: 'Unlimited Calls',
    sms: '100/day',
    validity: 28,
    additionalBenefits: 'Free Hellotunes',
    rechargeUrl: 'https://www.airtel.in/prepaid-recharge'
  },
  {
    operator: 'Vi',
    price: 499,
    data: '3GB/day',
    talktime: 'Unlimited Calls',
    sms: '100/day',
    validity: 28,
    additionalBenefits: 'Binge All Night',
    rechargeUrl: 'https://www.myvi.in/prepaid/mobile-recharge'
  },
   {
    operator: 'Jio',
    price: 199,
    data: '1.5GB/day',
    talktime: 'Unlimited Calls',
    sms: '100/day',
    validity: 23,
    additionalBenefits: 'JioCinema, JioTV',
    rechargeUrl: 'https://www.jio.com/selfcare/plans/mobility/jio-phone-plans/'
  },
  {
    operator: 'Airtel',
    price: 239,
    data: '1GB/day',
    talktime: 'Unlimited Calls',
    sms: '100/day',
    validity: 24,
    rechargeUrl: 'https://www.airtel.in/prepaid-recharge'
  },
  {
    operator: 'Vi',
    price: 699,
    data: 'Unlimited Data (Post 3GB/day at reduced speed)',
    talktime: 'Unlimited Calls',
    sms: '100/day',
    validity: 56,
    additionalBenefits: 'Weekend Data Rollover, Vi Movies & TV',
    rechargeUrl: 'https://www.myvi.in/prepaid/mobile-recharge'
  }
];


/**
 * Asynchronously retrieves a list of telecom plans based on specified filters.
 *
 * @param filters An object containing filter criteria for telecom plans.
 * @returns A promise that resolves to an array of TelecomPlan objects.
 */
export async function getTelecomPlans(filters: TelecomPlanFilter): Promise<TelecomPlan[]> {
  // Mock implementation: In a real app, this would call an API and filter on the backend.
  // For now, we'll do some basic filtering on the mock data.
  let FfilteredPlans = [...mockPlansData];

  if (filters.operator) {
    FfilteredPlans = FfilteredPlans.filter(plan => plan.operator.toLowerCase() === filters.operator!.toLowerCase());
  }
  if (filters.minPrice !== undefined) {
    FfilteredPlans = FfilteredPlans.filter(plan => plan.price >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined) {
    FfilteredPlans = FfilteredPlans.filter(plan => plan.price <= filters.maxPrice!);
  }
  if (filters.dataPerDay) {
    if (filters.dataPerDay.toLowerCase() === 'other') {
      FfilteredPlans = FfilteredPlans.filter(plan => !plan.data.toLowerCase().includes('/day'));
    } else {
      // Simple check if data string contains the filter value e.g. "1.5GB/day" contains "1.5GB"
      FfilteredPlans = FfilteredPlans.filter(plan => plan.data.toLowerCase().includes(filters.dataPerDay!.toLowerCase()));
    }
  }
  if (filters.validity !== undefined) {
    FfilteredPlans = FfilteredPlans.filter(plan => plan.validity === filters.validity);
  }
  
  // Validate each plan against the schema before returning (good practice, though can be slow for large datasets)
  return FfilteredPlans.filter(plan => TelecomPlanSchema.safeParse(plan).success);
}

