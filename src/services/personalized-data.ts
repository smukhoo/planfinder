
// src/services/personalized-data.ts
import type {
  MockPersonalizedData,
  MockUserProfile,
  MockDataStatus,
  MockAppConsumption,
  MockUsagePatternPoint,
  MockCostSavingRecommendation,
  MockOttRecommendation,
  MockTravelRecommendation,
} from '@/types/personalized';
import type { TelecomPlan } from '@/services/telecom-plans';
import { Instagram, Youtube, Facebook, Wifi, ShoppingCart, Globe } from 'lucide-react';

// Sample TelecomPlan objects (can be fetched or defined more robustly)
const samplePlan1: TelecomPlan = {
  operator: 'Airtel',
  price: 299,
  data: '1.5GB/day',
  talktime: 'Unlimited',
  sms: '100/day',
  validity: 28,
  additionalBenefits: ['Wynk Music', 'Free Hellotunes'], // Changed to array
  rechargeUrl: 'https://www.airtel.in/prepaid-recharge/',
  id: 'airtel-299',
  category: 'Popular',
};

const samplePlan2: TelecomPlan = {
  operator: 'Jio',
  price: 666,
  data: '2GB/day',
  talktime: 'Unlimited',
  sms: '100/day',
  validity: 84,
  additionalBenefits: ['JioTV', 'JioCinema', 'Netflix Mobile subscription'], // Changed to array
  rechargeUrl: 'https://www.jio.com/selfcare/plans/mobility/prepaid-plans-home/',
  id: 'jio-666-netflix',
  category: 'Entertainment',
};

const sampleRoamingPack: TelecomPlan = {
  operator: 'Vi',
  price: 2999,
  data: '5GB Global Data',
  talktime: '100 mins Local/India',
  sms: '20 SMS',
  validity: 30,
  additionalBenefits: ['Valid in 80+ countries including Dubai'], // Changed to array
  rechargeUrl: 'https://www.myvi.in/international-roaming-packs',
  id: 'vi-ir-2999',
  category: 'Roaming',
};

const highUsageUser: MockPersonalizedData = {
  userProfile: {
    name: 'Priya Sharma',
    mobileNumber: 'XXXXXX5678',
    operator: 'Airtel',
    avatarSrc: '/avatars/priya-sharma.png', // You'll need to add these to public/avatars
    avatarFallback: 'PS',
    avatarHint: 'woman smiling'
  },
  dataStatus: {
    remainingDataGB: 0.2,
    totalDataGB: 2.0,
    validityDate: 'June 5, 2025',
  },
  appConsumption: [
    { id: '1', name: 'Instagram', icon: Instagram, usageGB: 3.5, usagePercentage: 40 },
    { id: '2', name: 'YouTube', icon: Youtube, usageGB: 2.8, usagePercentage: 30 },
    { id: '3', name: 'Facebook', icon: Facebook, usageGB: 1.5, usagePercentage: 15 },
    { id: '4', name: 'Others', icon: Wifi, usageGB: 1.2, usagePercentage: 15 },
  ],
  usagePatterns: [
    { date: 'Mon', usageGB: 1.8 },
    { date: 'Tue', usageGB: 1.5 },
    { date: 'Wed', usageGB: 2.1 }, // Peak
    { date: 'Thu', usageGB: 1.6 },
    { date: 'Fri', usageGB: 1.9 },
    { date: 'Sat', usageGB: 2.0 },
    { date: 'Sun', usageGB: 1.7 },
  ],
  costSaving: {
    averageUsageGB: 1.8,
    potentialSavingINR: 50,
    recommendedPlan: samplePlan1,
  },
  ottRecommendation: {
    usedOttApp: 'Netflix',
    recommendedPlan: samplePlan2,
  },
  travelRecommendation: {
    destination: 'Dubai',
    travelDate: 'July 2025',
    recommendedPack: sampleRoamingPack,
  },
  lastUpdated: 'Just now',
};

const moderateUser: MockPersonalizedData = {
  userProfile: {
    name: 'Amit Singh',
    mobileNumber: 'XXXXXX1234',
    operator: 'Jio',
    avatarSrc: '/avatars/amit-singh.png', // You'll need to add these to public/avatars
    avatarFallback: 'AS',
    avatarHint: 'man glasses'
  },
  dataStatus: {
    remainingDataGB: 20.5,
    totalDataGB: 56.0, // Assuming a longer validity plan
    validityDate: 'August 20, 2025',
  },
  appConsumption: [
    { id: '1', name: 'YouTube', icon: Youtube, usageGB: 10.2, usagePercentage: 50 },
    { id: '2', name: 'WhatsApp', icon: Wifi, usageGB: 5.0, usagePercentage: 25 },
    { id: '3', name: 'Amazon Shopping', icon: ShoppingCart, usageGB: 3.0, usagePercentage: 15 },
    { id: '4', name: 'Chrome', icon: Globe, usageGB: 2.0, usagePercentage: 10 },
  ],
  usagePatterns: [
    { date: 'Week 1', usageGB: 5.0 },
    { date: 'Week 2', usageGB: 6.5 },
    { date: 'Week 3', usageGB: 4.8 },
    { date: 'Week 4', usageGB: 5.5 },
  ],
  costSaving: {
    averageUsageGB: 1.0, // Lower average than current plan
    potentialSavingINR: 120,
    recommendedPlan: { ...samplePlan1, price: 199, data: '1GB/day', id: 'jio-199', additionalBenefits: ['Free Hellotunes'] }, // Ensured benefits is array
  },
  // No OTT or travel recommendation for this user scenario
  lastUpdated: '1 hour ago',
};

const newUser: MockPersonalizedData = {
  userProfile: {
    name: 'New User',
    mobileNumber: 'XXXXXXXXXX',
    operator: 'Unknown',
    avatarSrc: '/avatars/default-user.png',
    avatarFallback: 'NU',
    avatarHint: 'user silhouette'
  },
  dataStatus: {
    remainingDataGB: 0,
    totalDataGB: 0,
    validityDate: 'N/A',
  },
  appConsumption: [],
  usagePatterns: [],
  lastUpdated: 'N/A',
  // No recommendations for new user
};


// Function to get a specific mock data scenario
export async function getPersonalizedData(scenario: 'highUsage' | 'moderateUsage' | 'newUser' = 'highUsage'): Promise<MockPersonalizedData> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));

  switch (scenario) {
    case 'highUsage':
      return highUsageUser;
    case 'moderateUsage':
      return moderateUser;
    case 'newUser':
      return newUser;
    default:
      return highUsageUser;
  }
}
