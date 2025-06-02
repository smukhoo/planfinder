
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
import { Instagram, Youtube, Facebook, Wifi, ShoppingCart, Globe, Video, MessageSquare } from 'lucide-react';

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

// Define a specific Airtel International Roaming pack for Priya's hypothetical trip
const airtelDubaiRoamingPack: TelecomPlan = {
  operator: 'Airtel',
  price: 1299, // Example price
  data: '3GB Data',
  data_hi: '3जीबी डेटा',
  talktime: '100 Mins (Local/India)',
  talktime_hi: '100 मिनट (स्थानीय/भारत)',
  sms: '50 SMS',
  sms_hi: '50 एसएमएस',
  validity: 10, // Example validity
  additionalBenefits: ['Valid in UAE (Dubai)', 'Free Incoming Calls on Wi-Fi Calling'],
  additionalBenefits_hi: ['UAE (दुबई) में मान्य', 'वाई-फाई कॉलिंग पर मुफ्त इनकमिंग कॉल'],
  rechargeUrl: 'https://www.airtel.in/ir-packs/',
  id: 'airtel-ir-dubai-1299',
  category: 'International Roaming',
  planNameDisplay: "Airtel Dubai Roamer",
  planNameDisplay_hi: "एयरटेल दुबई रोमर",
  callout: "Perfect for your upcoming Dubai trip!",
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
    remainingDataGB: 0.15, // Almost out of her 1.5GB daily mobile allowance
    totalDataGB: 1.5,      // Daily mobile allowance from her ₹839 plan
    validityDate: 'August 15, 2025', // Example for an 84-day plan
  },
  appConsumption: [ // These apps primarily consume mobile data during commute
    { id: '1', name: 'WhatsApp (Video Calls)', icon: MessageSquare, usageGB: 1.0, usagePercentage: 60 },
    { id: '2', name: 'Instagram', icon: Instagram, usageGB: 0.2, usagePercentage: 15 },
    { id: '3', name: 'YouTube', icon: Youtube, usageGB: 0.15, usagePercentage: 10 },
    { id: '4', name: 'Chrome', icon: Globe, usageGB: 0.1, usagePercentage: 10 },
    { id: '5', name: 'Other Apps (Mobile)', icon: Wifi, usageGB: 0.05, usagePercentage: 5 }, // Renamed for clarity
  ],
  usagePatterns: [ // Showing daily *mobile data* usage frequently hitting limit
    { date: 'Mon', usageGB: 1.5 }, // usageGB here means mobile data usage for the chart
    { date: 'Tue', usageGB: 1.6 }, // Exceeded, implies top-up needed
    { date: 'Wed', usageGB: 1.5 },
    { date: 'Thu', usageGB: 1.7 }, // Exceeded
    { date: 'Fri', usageGB: 1.5 },
    { date: 'Sat', usageGB: 1.4 }, // Barely managed
    { date: 'Sun', usageGB: 1.6 }, // Exceeded
  ],
  costSaving: {
    averageUsageGB: 1.7, // Her effective daily *mobile data* need that caused top-ups
    potentialSavingINR: 804, // Actual saving over 84 days (1783 - 979)
    recommendedPlan: priyaRecommendedPlan,
    previousPlanCost: 839,
    previousPlanData: "1.5GB/day (Mobile)",
    topUpCost: 77,
    topUpFrequency: "almost weekly",
    previousTotalSpending: 1783, // Her actual spend over 84 days (839 + ~12*77)
    scenarioDescription: "Your daily 1.5GB mobile data often runs out during your bus commute video calls, forcing frequent ₹77 top-ups. While you might use WiFi at home/work, this critical mobile usage adds up to ₹1,783 over 84 days!",
  },
  ottRecommendation: {
    usedOttApp: "Airtel Rewards Mini Subscription", // From her ₹839 plan
    recommendedPlan: priyaRecommendedPlan, // The new plan might have different/no OTT, focus is data fix
    notes: "The Rewards Mini subscription from your previous plan seemed unused. This new plan prioritizes your crucial mobile data needs for video calls, ensuring a seamless experience without paying for unutilized OTT benefits.",
  },
  travelRecommendation: { // Adding a travel recommendation for Priya
    destination: 'Dubai, UAE',
    travelDate: 'July 2025', // Hypothetical travel date
    recommendedPack: airtelDubaiRoamingPack,
  },
  lastUpdated: 'Just now',
};


// New recommended plan for Amit Singh (low mobile data user)
const amitRecommendedPlanLowMobile: TelecomPlan = {
  operator: 'Jio',
  price: 395,
  data: '6GB', // Total data for 84 days
  data_hi: '6जीबी',
  talktime: 'Unlimited Calls',
  talktime_hi: 'अनलिमिटेड कॉल्स',
  sms: '1000 SMS', // Jio often gives bulk SMS for longer validity plans
  sms_hi: '१००० एसएमएस',
  validity: 84,
  additionalBenefits: ['JioTV Basic', 'JioCinema Basic'],
  additionalBenefits_hi: ['जियो टीवी बेसिक', 'जियो सिनेमा बेसिक'],
  rechargeUrl: 'https://www.jio.com/selfcare/plans/mobility/prepaid-plans-home/',
  id: 'jio-395-6gb-84d-amit',
  category: 'AI Recommended',
  planNameDisplay: "AI WiFi Companion 395",
  planNameDisplay_hi: "AI वाईफाई साथी ३९५",
  callout: "Perfect for WiFi users, save ₹444!",
};

const moderateUser: MockPersonalizedData = { // Amit Singh
  userProfile: {
    name: 'Amit Singh',
    mobileNumber: 'XXXXXX1234',
    operator: 'Jio',
    avatarSrc: '/avatars/amit-singh.png',
    avatarFallback: 'AS',
    avatarHint: 'man glasses'
  },
  dataStatus: { // Reflects his current mobile plan status
    remainingDataGB: 5.8, // Example: if he's on the 6GB/84 day plan already, or remaining from an old one.
    totalDataGB: 6.0,   // From his low-usage mobile plan
    validityDate: 'September 10, 2025', // Example
  },
  appConsumption: [ // Apps that *might* use mobile data when he's out
    { id: '1', name: 'WhatsApp', icon: MessageSquare, usageGB: 0.1, usagePercentage: 40 }, // Low mobile usage
    { id: '2', name: 'Google Maps', icon: Globe, usageGB: 0.05, usagePercentage: 20 },
    { id: '3', name: 'Banking App', icon: ShoppingCart, usageGB: 0.05, usagePercentage: 20 }, // Assuming banking app icon
    { id: '4', name: 'Browser (Occasional)', icon: Globe, usageGB: 0.05, usagePercentage: 20 },
  ],
  usagePatterns: [ // Showing daily *mobile data* usage (very low)
    // Daily mobile data usage averaging < 50MB (0.05GB)
    { date: 'Mon', usageGB: 0.04 },
    { date: 'Tue', usageGB: 0.02 },
    { date: 'Wed', usageGB: 0.05 },
    { date: 'Thu', usageGB: 0.03 },
    { date: 'Fri', usageGB: 0.06 },
    { date: 'Sat', usageGB: 0.07 }, // Slightly more on weekend
    { date: 'Sun', usageGB: 0.04 },
  ],
  costSaving: {
    averageUsageGB: 0.05, // His typical daily *mobile data* usage
    potentialSavingINR: 444, // 839 (old plan) - 395 (new plan)
    recommendedPlan: amitRecommendedPlanLowMobile,
    previousPlanCost: 839,
    previousPlanData: "1.5GB/day (Mobile)",
    previousTotalSpending: 839, // Assuming no top-ups, just an inefficient base plan
    scenarioDescription: "We see you're a heavy WiFi user (around 3GB/day) and use very little mobile data (typically under 50MB/day). Your previous ₹839 mobile plan (1.5GB/day) seems excessive for your mobile needs. By switching to the Jio ₹395 plan (6GB total data for 84 days, unlimited calls), you could save ₹444 while still having sufficient mobile data for when you're away from WiFi. This plan also doesn't include the 'Rewards Mini Subscription' which you weren't using.",
  },
  ottRecommendation: {
    usedOttApp: "Rewards Mini Subscription", // From his previous ₹839 plan
    recommendedPlan: amitRecommendedPlanLowMobile,
    notes: "The 'Rewards Mini Subscription' from your previous ₹839 plan was likely unused given your primary WiFi usage. The recommended Jio ₹395 plan focuses on essential mobile connectivity at a much lower cost.",
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
  usagePatterns: [], // This `usageGB` will represent mobile data usage for the chart
  lastUpdated: 'N/A',
};


export async function getPersonalizedData(scenario: 'highUsage' | 'moderateUsage' | 'newUser' = 'highUsage'): Promise<MockPersonalizedData> {
  await new Promise(resolve => setTimeout(resolve, 500));
  switch (scenario) {
    case 'highUsage': // This now represents Priya Sharma
      return highUsageUser;
    case 'moderateUsage': // This now represents Amit Singh
      return moderateUser;
    case 'newUser':
      return newUser;
    default:
      return highUsageUser;
  }
}

