
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

const popularPlans = [
  {
    title: 'Unlimited Data Plan',
    description: 'Enjoy uninterrupted data with our unlimited plan.',
    imgSrc: 'https://placehold.co/300x200.png',
    imgHint: 'data plan illustration',
    bgColor: 'bg-orange-100',
  },
  {
    title: 'Best Value Plan',
    description: 'Get the most out of your recharge with our best value plan.',
    imgSrc: 'https://placehold.co/300x200.png',
    imgHint: 'value plan illustration',
    bgColor: 'bg-rose-100',
  },
  {
    title: 'International Roaming Plan',
    description: 'Stay connected even when you travel with our international roaming plan.',
    imgSrc: 'https://placehold.co/300x200.png',
    imgHint: 'roaming plan illustration',
    bgColor: 'bg-teal-100',
  },
];

export function PopularPlansSection() {
  return (
    <section className="w-full py-12 md:py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Popular Plans
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {popularPlans.map((plan) => (
            <Card key={plan.title} className={`overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg ${plan.bgColor}`}>
              <CardHeader className="p-0">
                <div className="aspect-[3/2] relative w-full">
                  <Image
                    src={plan.imgSrc}
                    alt={plan.title}
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint={plan.imgHint}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6 text-center md:text-left">
                <CardTitle className="text-xl font-semibold text-foreground mb-2">{plan.title}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">{plan.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
