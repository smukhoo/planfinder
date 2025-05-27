// src/services/international-roaming.ts
import type { RoamingAdvisorInput, IndianRoamingPack, LocalSimInfo, RoamingRecommendation } from '@/types/roaming';

export const mockCountries = [
  { value: 'USA', label: 'United States' },
  { value: 'GBR', label: 'United Kingdom' },
  { value: 'FRA', label: 'France' },
  { value: 'ARE', label: 'United Arab Emirates' },
  { value: 'SGP', label: 'Singapore' },
];

const mockIndianRoamingPacks: IndianRoamingPack[] = [
  {
    id: 'jio-usa-28d-5gb',
    operator: 'Jio',
    name: 'Jio Global Plan - $15',
    price: 1101, // Approx conversion or standard pack price
    data: '5GB High Speed',
    voice: '100 mins (India/Local), Free Incoming',
    sms: '100 SMS',
    validity: 28,
    coveredCountries: ['USA', 'GBR', 'FRA', 'SGP', 'ARE'],
    activation: 'Via MyJio App or Jio.com',
    specialFeatures: 'Wi-Fi Calling available',
    rechargeUrl: 'https://www.jio.com/selfcare/plans/mobility/jio-international-roaming-plans/'
  },
  {
    id: 'airtel-global-10d-1gb',
    operator: 'Airtel',
    name: 'Airtel Roaming Pack ₹2999',
    price: 2999,
    data: '5GB Data',
    voice: '100 Mins (Local/India), Free Incoming',
    sms: '20 SMS',
    validity: 30, // Often annual validity with benefits for X days
    coveredCountries: ['USA', 'GBR', 'FRA', 'SGP', 'ARE'],
    activation: 'Via Airtel Thanks App',
    specialFeatures: 'Works in 100+ countries',
    rechargeUrl: 'https://www.airtel.in/ir-packs/'
  },
  {
    id: 'vi-europe-7d-ul',
    operator: 'Vi',
    name: 'Vi Roaming Pack ₹3199',
    price: 3199,
    data: 'Unlimited (FUP 1GB/day HS)',
    voice: 'Unlimited Incoming, 200 mins Outgoing (India/Local)',
    sms: '25 SMS',
    validity: 7,
    coveredCountries: ['GBR', 'FRA'],
    activation: 'Via Vi App or MyVi.in',
    rechargeUrl: 'https://www.myvi.in/international-roaming-packs'
  },
  {
    id: 'jio-uae-10d-1gb',
    operator: 'Jio',
    name: 'Jio UAE Special - ₹899',
    price: 899,
    data: '1GB Data',
    voice: '50 Mins (Local/India)',
    sms: '50 SMS',
    validity: 10,
    coveredCountries: ['ARE'],
    activation: 'MyJio App',
    rechargeUrl: 'https://www.jio.com/selfcare/plans/mobility/jio-international-roaming-plans/'
  },
   {
    id: 'airtel-usa-30d-3gb',
    operator: 'Airtel',
    name: 'Airtel USA Long Stay ₹4999',
    price: 4999,
    data: '3GB Data / month (billed as one-time)',
    voice: '300 Mins (Local/India), Free Incoming',
    sms: '100 SMS',
    validity: 90,
    coveredCountries: ['USA'],
    activation: 'Airtel Thanks App',
    rechargeUrl: 'https://www.airtel.in/ir-packs/'
  }
];

const mockLocalSimInfo: LocalSimInfo[] = [
  {
    country: 'USA',
    generalAdvice: 'Local SIMs in the USA (e.g., T-Mobile, AT&T pre-paid) can offer more data for longer stays but might require ID for purchase. eSIM options are increasingly available.',
    estimatedCostRange: '$30-$50 for 10-15GB data + calls/texts',
    keyProviders: ['T-Mobile', 'AT&T', 'Verizon (prepaid)'],
    pros: ['Potentially more data for cost', 'Good coverage'],
    cons: ['May need US ID/address for some', 'Hassle of SIM swap if not eSIM'],
    purchaseLocations: 'Airport kiosks, Mobile operator stores, Walmart, Target'
  },
  {
    country: 'GBR',
    generalAdvice: 'Getting a local SIM in the UK is easy and cost-effective. Providers like EE, Vodafone, O2, Three offer good tourist plans.',
    estimatedCostRange: '£10-£20 for 20-50GB data + calls/texts',
    keyProviders: ['EE', 'Vodafone', 'O2', 'Three'],
    pros: ['Excellent value for data', 'Easy to find and activate'],
    cons: ['SIM swap'],
    purchaseLocations: 'Airport kiosks, Supermarkets, Mobile operator stores'
  },
  {
    country: 'FRA',
    generalAdvice: 'Local SIMs in France (e.g., Orange, SFR, Free Mobile) are good for data-heavy users. "Tabac" shops often sell them.',
    estimatedCostRange: '€20-€30 for 20-50GB data',
    keyProviders: ['Orange', 'SFR', 'Bouygues Telecom', 'Free Mobile'],
    pros: ['Good data allowances', 'Often include EU roaming'],
    cons: ['SIM swap', 'Language barrier at smaller shops possible'],
    purchaseLocations: 'Airport kiosks, Tabac shops, Mobile operator stores'
  },
  {
    country: 'ARE',
    generalAdvice: 'Tourist SIMs are readily available at Dubai/Abu Dhabi airports (e.g., du, Etisalat). They often come with free data for a short period.',
    estimatedCostRange: 'AED 50-150 for various tourist packs',
    keyProviders: ['du', 'Etisalat', 'Virgin Mobile'],
    pros: ['Convenient to purchase on arrival', 'Good network quality'],
    cons: ['Can be pricier than some other countries for long stays'],
    purchaseLocations: 'Airport kiosks, Malls'
  },
  {
    country: 'SGP',
    generalAdvice: 'Singapore offers excellent tourist SIM options (e.g., Singtel, StarHub, M1) with generous data allowances. Easy to buy at Changi Airport.',
    estimatedCostRange: 'SGD 15-30 for 100GB+ tourist SIMs (often valid for 7-14 days)',
    keyProviders: ['Singtel', 'StarHub', 'M1'],
    pros: ['Very high data allowances', 'Excellent network coverage', 'Easy to purchase'],
    cons: ['SIM swap if physical SIM'],
    purchaseLocations: 'Changi Airport, Convenience stores (7-Eleven), Mobile operator stores'
  }
];

export async function getInternationalRoamingSuggestions(input: RoamingAdvisorInput): Promise<RoamingRecommendation> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const recommendations: RoamingRecommendation = {
    indianPacks: [],
    localSimInfo: undefined,
    advice: ''
  };

  // Filter Indian Roaming Packs
  recommendations.indianPacks = mockIndianRoamingPacks.filter(pack =>
    pack.coveredCountries.includes(input.destinationCountry)
  );

  if (input.departureDate && input.returnDate) {
    const duration = (input.returnDate.getTime() - input.departureDate.getTime()) / (1000 * 3600 * 24);
    recommendations.indianPacks = recommendations.indianPacks.filter(pack => pack.validity >= duration);
    
    // Basic advice based on duration
    if (duration > 15 && recommendations.indianPacks.length === 0) {
        recommendations.advice = `For a trip of ${duration} days, Indian roaming packs might be expensive or have limited validity. Consider a local SIM.`;
    } else if (duration <= 7 && recommendations.indianPacks.length > 0) {
        recommendations.advice = `For your ${duration}-day trip, the following Indian roaming packs could be suitable.`;
    } else {
         recommendations.advice = `Here are some options for your trip to ${mockCountries.find(c => c.value === input.destinationCountry)?.label || input.destinationCountry}.`;
    }
  }


  // Find Local SIM Info
  recommendations.localSimInfo = mockLocalSimInfo.find(info => info.country === input.destinationCountry);
  
  if (!recommendations.indianPacks.length && !recommendations.localSimInfo) {
    recommendations.advice = `Sorry, we don't have specific recommendations for ${input.destinationCountry} at the moment. Check directly with your Indian telecom provider or look for local SIM options upon arrival.`;
  } else if (!recommendations.indianPacks.length && recommendations.localSimInfo) {
    recommendations.advice = `For ${input.destinationCountry}, a local SIM might be your best option. ${recommendations.advice || ''}`;
  }


  // Sort packs by price (ascending)
  recommendations.indianPacks.sort((a, b) => a.price - b.price);

  return recommendations;
}
