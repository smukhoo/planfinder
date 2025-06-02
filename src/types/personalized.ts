
// src/types/personalized.ts
import type { TelecomPlan } from '@/services/telecom-plans';

export interface MockUserProfile {
  name: string;
  mobileNumber: string; // Masked
  operator: string;
  avatarSrc: string;
  avatarFallback: string;
  avatarHint: string;
}

export interface MockDataStatus {
  remainingDataGB: number;
  totalDataGB: number;
  validityDate: string; // e.g., "June 15, 2025"
}

export interface MockAppConsumption {
  id: string;
  name: string;
  icon: React.ElementType; // Lucide icon component
  usageGB: number;
  usagePercentage: number; // For potential chart use
}

export interface MockUsagePatternPoint {
  date: string; // e.g., "Mon", "Week 1", "Jan"
  usageGB: number;
}

export interface MockCostSavingRecommendation {
  averageUsageGB: number; // Her actual need/usage that led to top-ups
  potentialSavingINR: number; // The final saving amount (e.g., 804) over the cycle
  recommendedPlan: TelecomPlan;
  // Fields to help tell Priya's story
  previousPlanCost?: number; // e.g., 839 (base cost of old plan)
  previousPlanData?: string; // e.g., "1.5GB/day"
  topUpCost?: number; // e.g., 77 (cost of one top-up)
  topUpFrequency?: string; // e.g., "almost weekly"
  previousTotalSpending?: number; // e.g., 1783 (estimated actual spending over cycle)
  scenarioDescription?: string; // A short description of the problem
}

export interface MockOttRecommendation {
  usedOttApp?: string; // The OTT she had or was analyzed
  recommendedPlan: TelecomPlan; // The new plan context
  notes?: string; // e.g., "Previous OTT was unused, new plan focuses on core needs."
}

export interface MockTravelRecommendation {
  destination: string;
  travelDate: string; // e.g., "July 2025"
  recommendedPack: TelecomPlan;
}

export interface MockPersonalizedData {
  userProfile: MockUserProfile;
  dataStatus: MockDataStatus;
  appConsumption: MockAppConsumption[];
  usagePatterns: MockUsagePatternPoint[];
  costSaving?: MockCostSavingRecommendation;
  ottRecommendation?: MockOttRecommendation;
  travelRecommendation?: MockTravelRecommendation;
  lastUpdated: string;
}
