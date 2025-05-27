
// src/components/network-coverage/operator-coverage-card.tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, SignalIcon } from 'lucide-react'; // Using SignalIcon as a generic placeholder

export interface OperatorInfo {
  name: string;
  logoDataAiHint: string;
  description: string;
  mapUrl: string;
  technologies: string[];
}

interface OperatorCoverageCardProps {
  operator: OperatorInfo;
}

export function OperatorCoverageCard({ operator }: OperatorCoverageCardProps) {
  return (
    <Card className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-primary/10 rounded-full" data-ai-hint={operator.logoDataAiHint}>
            <SignalIcon className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">{operator.name}</CardTitle>
        </div>
        <CardDescription className="text-sm text-muted-foreground h-12"> 
          {operator.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="mb-3">
          <p className="text-xs font-medium text-muted-foreground mb-1">Supports:</p>
          <div className="flex flex-wrap gap-2">
            {operator.technologies.map(tech => (
              <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
          <a href={operator.mapUrl} target="_blank" rel="noopener noreferrer">
            View Official Coverage Map
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
