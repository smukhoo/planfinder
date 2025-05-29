
"use client";

import { HeroSection } from '@/components/home/hero-section';
import { PopularPlansSection } from '@/components/home/popular-plans-section';
import { TestimonialsSection } from '@/components/home/testimonials-section';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const searchParams = useSearchParams();
  const [dataParamValue, setDataParamValue] = useState<string | null>(null);

  useEffect(() => {
    const encodedDataValue = searchParams.get('data');
    if (encodedDataValue) {
      try {
        const decodedValue = atob(encodedDataValue);
        setDataParamValue(decodedValue);
      } catch (error) {
        console.error("Failed to decode base64 data from query parameter:", error);
        setDataParamValue("Error: Could not decode data.");
      }
    } else {
      setDataParamValue(null); // Reset if the param is not present
    }
  }, [searchParams]);

  return (
    <>
      <HeroSection />
      <PopularPlansSection />
      <TestimonialsSection />
      {dataParamValue && (
        <section className="w-full py-8 md:py-12 bg-background">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h3 className="text-2xl font-semibold text-foreground mb-3">
              Decoded Information from URL:
            </h3>
            <div className="p-4 border rounded-lg bg-card shadow-sm">
              <p className="text-md text-muted-foreground">
                {dataParamValue}
              </p>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
