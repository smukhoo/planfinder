
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
import { Instagram, Youtube, Facebook, Wifi, ShoppingCart, Globe, Video, MessageSquare } from 'lucide-react'; // Added MessageSquare

// Sample TelecomPlan objects (can be fetched or defined more robustly)
const samplePlan1: TelecomPlan = {
  operator: 'Airtel',
  price: 299,
  data: '1.5GB/day',
  talktime: 'Unlimited',
  sms: '100/day',
  validity: 28,
  additionalBenefits: ['Wynk Music', 'Free Hellotunes'],
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
  additionalBenefits: ['JioTV', 'JioCinema', 'Netflix Mobile subscription'],
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
  additionalBenefits: ['Valid in 80+ countries including Dubai'],
  rechargeUrl: 'https://www.myvi.in/international-roaming-packs',
  id: 'vi-ir-2999',
  category: 'Roaming',
};


// Priya Sharma's recommended plan (Airtel ₹979)
const priyaRecommendedPlan: TelecomPlan = {
  operator: 'Airtel',
  price: 979,
  data: '2GB/day + Unlimited 5G',
  data_hi: '2GB/दिन + अनलिमिटेड 5G',
  talktime: 'Unlimited Calls',
  talktime_hi: 'अनलिमिटेड कॉल्स',
  sms: '100/day', // Assuming standard
  sms_hi: '100/दिन',
  validity: 84,
  additionalBenefits: [
    'Unlimited 5G data in 5G enabled areas (covers your commute!)',
    'Avoids frequent top-ups',
    'Seamless video calls on the bus'
  ],
  additionalBenefits_hi: [
    '5G सक्षम क्षेत्रों में अनलिमिटेड 5G डेटा (आपकी बस यात्रा को कवर करता है!)',
    'बार-बार टॉप-अप से बचें',
    'बस में निर्बाध वीडियो कॉल'
  ],
  rechargeUrl: 'https://www.airtel.in/prepaid-recharge/', // Generic Airtel link
  id: 'airtel-979-ul5g-priya',
  category: 'AI Recommended',
  planNameDisplay: "AI Smart Saver 979",
  planNameDisplay_hi: "AI स्मार्ट सेवर ९७९",
  callout: "Save ₹804 over 84 days & enjoy worry-free 5G video calls!",
};

// Update highUsageUser to be Priya Sharma
const highUsageUser: MockPersonalizedData = {
  userProfile: {
    name: 'Priya Sharma',
    mobileNumber: 'XXXXXX1357', // Priya's masked number
    operator: 'Airtel',
    avatarSrc: '/avatars/priya-sharma.png', // Ensure this image exists in public/avatars
    avatarFallback: 'PS',
    avatarHint: 'woman developer glasses' // More specific hint
  },
  dataStatus: { // Reflects her situation *before* ConnectPlan on a typical day
    remainingDataGB: 0.15, // Almost out of her 1.5GB daily allowance
    totalDataGB: 1.5,      // Daily allowance from her ₹839 plan
    validityDate: 'August 15, 2025', // Example for an 84-day plan
  },
  appConsumption: [
    { id: '1', name: 'WhatsApp (Video Calls)', icon: MessageSquare, usageGB: 1.2, usagePercentage: 70 },
    { id: '2', name: 'Instagram', icon: Instagram, usageGB: 0.2, usagePercentage: 12 },
    { id: '3', name: 'YouTube', icon: Youtube, usageGB: 0.15, usagePercentage: 9 },
    { id: '4', name: 'Chrome', icon: Globe, usageGB: 0.1, usagePercentage: 6 },
    { id: '5', name: 'Other Apps', icon: Wifi, usageGB: 0.05, usagePercentage: 3 },
  ],
  usagePatterns: [ // Showing daily data frequently hitting limit
    { date: 'Mon', usageGB: 1.5 },
    { date: 'Tue', usageGB: 1.6 }, // Exceeded, implies top-up needed
    { date: 'Wed', usageGB: 1.5 },
    { date: 'Thu', usageGB: 1.7 }, // Exceeded
    { date: 'Fri', usageGB: 1.5 },
    { date: 'Sat', usageGB: 1.4 }, // Barely managed
    { date: 'Sun', usageGB: 1.6 }, // Exceeded
  ],
  costSaving: {
    averageUsageGB: 1.7, // Her effective daily need that caused top-ups
    potentialSavingINR: 804, // Actual saving over 84 days (1783 - 979)
    recommendedPlan: priyaRecommendedPlan,
    previousPlanCost: 839,
    previousPlanData: "1.5GB/day",
    topUpCost: 77,
    topUpFrequency: "almost weekly",
    previousTotalSpending: 1783, // Her actual spend over 84 days (839 + ~12*77)
    scenarioDescription: "Your daily 1.5GB data often runs out during your commute video calls, forcing frequent ₹77 top-ups. Over 84 days, this adds up to ₹1,783!",
  },
  ottRecommendation: {
    usedOttApp: "Airtel Rewards Mini Subscription", // From her ₹839 plan
    recommendedPlan: priyaRecommendedPlan, // The new plan might have different/no OTT, focus is data fix
    notes: "The Rewards Mini subscription from your previous plan seemed unused. This new plan prioritizes your crucial data needs for video calls, ensuring a seamless experience without paying for unutilized OTT benefits.",
  },
  travelRecommendation: undefined, // No travel for Priya in this story
  lastUpdated: 'Just now',
};

const moderateUser: MockPersonalizedData = {
  userProfile: {
    name: 'Amit Singh',
    mobileNumber: 'XXXXXX1234',
    operator: 'Jio',
    avatarSrc: '/avatars/amit-singh.png',
    avatarFallback: 'AS',
    avatarHint: 'man glasses'
  },
  dataStatus: {
    remainingDataGB: 20.5,
    totalDataGB: 56.0,
    validityDate: 'August 20, 2025',
  },
  appConsumption: [
    { id: '1', name: 'YouTube', icon: Youtube, usageGB: 10.2, usagePercentage: 50 },
    { id: '2', name: 'WhatsApp', icon: MessageSquare, usageGB: 5.0, usagePercentage: 25 }, 
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
    averageUsageGB: 1.0,
    potentialSavingINR: 120,
    recommendedPlan: { ...samplePlan1, price: 199, data: '1GB/day', id: 'jio-199', additionalBenefits: ['Free Hellotunes'] },
  },
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
};


export async function getPersonalizedData(scenario: 'highUsage' | 'moderateUsage' | 'newUser' = 'highUsage'): Promise<MockPersonalizedData> {
  await new Promise(resolve => setTimeout(resolve, 500));
  switch (scenario) {
    case 'highUsage': // This now represents Priya Sharma
      return highUsageUser;
    case 'moderateUsage':
      return moderateUser;
    case 'newUser':
      return newUser;
    default:
      return highUsageUser;
  }
}

