
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
  averageUsageGB: number;
  potentialSavingINR: number;
  recommendedPlan: TelecomPlan;
}

export interface MockOttRecommendation {
  usedOttApp: string;
  recommendedPlan: TelecomPlan;
}

export interface MockTravelRecommendation {
  destination: string;
  travelDate: string; // e.g., "July 2025"
  recommendedPack: TelecomPlan; // Using TelecomPlan for simplicity, can be a specific RoamingPack type later
}

export interface MockPersonalizedData {
  userProfile: MockUserProfile;
  dataStatus: MockDataStatus;
  appConsumption: MockAppConsumption[];
  usagePatterns: MockUsagePatternPoint[]; // For a line/bar chart
  costSaving?: MockCostSavingRecommendation;
  ottRecommendation?: MockOttRecommendation;
  travelRecommendation?: MockTravelRecommendation;
  lastUpdated: string;
}
