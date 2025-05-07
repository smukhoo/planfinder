import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ListChecks, Bot, GitCompareArrows, ExternalLink } from 'lucide-react';

const steps = [
  {
    icon: <ListChecks className="h-10 w-10 text-primary" />,
    title: 'Tell Us Your Needs',
    description: 'Describe what you\'re looking for or use our simple filters.',
  },
  {
    icon: <Bot className="h-10 w-10 text-primary" />,
    title: 'Get AI Recommendations',
    description: 'Our smart assistant analyzes your needs to find the best plans.',
  },
  {
    icon: <GitCompareArrows className="h-10 w-10 text-primary" />,
    title: 'Compare Plans',
    description: 'Easily compare features, prices, and benefits side-by-side.',
  },
  {
    icon: <ExternalLink className="h-10 w-10 text-primary" />,
    title: 'Recharge Securely',
    description: 'We redirect you to the operator\'s site to complete your recharge.',
  },
];

export function HowItWorksSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-foreground">
            Finding Your Perfect Plan is Easy
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-muted-foreground md:text-lg">
            Follow these simple steps to discover the ideal mobile plan.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <Card key={index} className="flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="mb-4 flex justify-center items-center p-3 rounded-full bg-primary/10">
                  {step.icon}
                </div>
                <CardTitle className="text-xl font-semibold">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
