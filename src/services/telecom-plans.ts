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
 * Filters for searching available plans
 */
export interface TelecomPlanFilter {
  operator?: string;
  minPrice?: number;
  maxPrice?: number;
  dataPerDay?: string;
  validity?: number;
}

/**
 * Asynchronously retrieves a list of telecom plans based on specified filters.
 *
 * @param filters An object containing filter criteria for telecom plans.
 * @returns A promise that resolves to an array of TelecomPlan objects.
 */
export async function getTelecomPlans(filters: TelecomPlanFilter): Promise<TelecomPlan[]> {
  // TODO: Implement this by calling an API.

  return [
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
  ];
}
