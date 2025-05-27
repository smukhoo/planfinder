// src/types/roaming.ts

export interface RoamingAdvisorInput {
  destinationCountry: string;
  departureDate?: Date;
  returnDate?: Date;
  primaryUsage: 'data' | 'calls' | 'balanced' | '';
}

export interface IndianRoamingPack {
  id: string;
  operator: 'Jio' | 'Airtel' | 'Vi';
  name: string;
  price: number; // INR
  data: string; // e.g., "5GB", "Unlimited (1GB/day high-speed)"
  voice: string; // e.g., "100 mins to India & Local", "Unlimited incoming"
  sms: string; // e.g., "100 SMS"
  validity: number; // days
  coveredCountries: string[];
  activation: string; // Brief activation info or link
  specialFeatures?: string;
  rechargeUrl: string;
}

export interface LocalSimInfo {
  country: string;
  generalAdvice: string;
  estimatedCostRange?: string; // e.g., "€20-€30 for 15GB"
  keyProviders?: string[];
  pros: string[];
  cons: string[];
  purchaseLocations?: string;
}

export interface RoamingRecommendation {
  indianPacks: IndianRoamingPack[];
  localSimInfo?: LocalSimInfo;
  advice?: string; // General advice or summary
}
