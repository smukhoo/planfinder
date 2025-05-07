import { HeroSection } from '@/components/home/hero-section';
import { HowItWorksSection } from '@/components/home/how-it-works';
import { FeaturedOperatorsSection } from '@/components/home/featured-operators';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <FeaturedOperatorsSection />
    </>
  );
}
