
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import Image from 'next/image';

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative rounded-xl overflow-hidden shadow-2xl">
          <Image
            src="https://placehold.co/1200x500.png"
            alt="Mobile phone with charger"
            layout="responsive"
            width={1200}
            height={500}
            className="absolute inset-0 h-full w-full object-cover z-0"
            data-ai-hint="modern smartphone lifestyle"
          />
          <div className="relative z-10 flex flex-col items-center justify-center h-[400px] md:h-[500px] bg-black/40 p-8 text-center text-white">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Find the perfect prepaid plan for your mobile
            </h1>
            <p className="mt-4 max-w-[700px] text-lg md:text-xl opacity-90">
              Discover the best recharge options tailored to your needs. Compare plans, get recommendations, and recharge with ease.
            </p>
            <form className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="tel"
                  placeholder="Enter your mobile number"
                  className="h-12 w-full rounded-md bg-white pl-10 pr-4 text-foreground"
                  aria-label="Mobile number"
                />
              </div>
              <Button type="submit" size="lg" className="h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-base">
                Find Plans
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
