import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SignalIcon } from 'lucide-react'; // Using Signal as a generic representation

const operators = [
  { name: 'Airtel', hint: 'Airtel logo' },
  { name: 'Jio', hint: 'Jio logo' },
  { name: 'Vi', hint: 'Vi logo (Vodafone Idea)' },
];

export function FeaturedOperatorsSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-foreground">
            Trusted Operators We Cover
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-muted-foreground md:text-lg">
            Find plans from India's leading telecom providers.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {operators.map((operator) => (
            <Card key={operator.name} className="flex flex-col items-center p-6 shadow-md hover:shadow-lg transition-shadow duration-300" data-ai-hint={operator.hint}>
              <CardHeader className="p-0 mb-4">
                 <div className="p-4 bg-primary/10 rounded-full">
                    <SignalIcon className="h-12 w-12 text-primary" />
                 </div>
              </CardHeader>
              <CardContent className="p-0">
                <CardTitle className="text-2xl font-semibold text-foreground">{operator.name}</CardTitle>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
