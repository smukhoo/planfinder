
"use client";

import { HeroSection } from '@/components/home/hero-section';
import { PopularPlansSection } from '@/components/home/popular-plans-section';
import { TestimonialsSection } from '@/components/home/testimonials-section';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const DECODED_DATA_KEY = 'decodedQueryData';

export default function HomePage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const encodedDataValue = searchParams.get('data');
    if (encodedDataValue) {
      try {
        const decodedValue = atob(encodedDataValue);
        if (typeof window !== 'undefined') {
          localStorage.setItem(DECODED_DATA_KEY, decodedValue);
        }
        console.log('Decoded and stored data from query parameter:', decodedValue);
      } catch (error) {
        console.error("Failed to decode or store base64 data from query parameter:", error);
        if (typeof window !== 'undefined') {
          // Optionally store error or indicate failure in localStorage
          localStorage.setItem(DECODED_DATA_KEY, "Error: Could not decode data.");
        }
      }
    }
    // We don't clear localStorage here, as it might be needed by other pages
    // or if the user navigates back without the query param.
  }, [searchParams]);

  return (
    <>
      <HeroSection />
      <PopularPlansSection />
      <TestimonialsSection />
      {/* The section to display dataParamValue has been removed from here */}
    </>
  );
}
