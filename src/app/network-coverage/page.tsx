
// src/app/network-coverage/page.tsx
import { OperatorCoverageCard, type OperatorInfo } from '@/components/network-coverage/operator-coverage-card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert, MapPinned } from 'lucide-react';

const operatorsData: OperatorInfo[] = [
  {
    name: 'Jio',
    logoDataAiHint: 'Jio logo',
    description: 'Check Jio\'s official network map for detailed 4G and 5G coverage across India.',
    mapUrl: 'https://www.jio.com/selfcare/network/jio-network-coverage-map/',
    technologies: ['4G', '5G']
  },
  {
    name: 'Airtel',
    logoDataAiHint: 'Airtel logo',
    description: 'Explore Airtel\'s Open Network initiative to view their 4G and 5G coverage status.',
    mapUrl: 'https://www.airtel.in/opennetwork/',
    technologies: ['4G', '5G', '3G']
  },
  {
    name: 'Vi (Vodafone Idea)',
    logoDataAiHint: 'Vi logo',
    description: 'View Vi\'s network coverage map for 4G and 5G services in your area.',
    mapUrl: 'https://www.myvi.in/network-coverage', // Updated based on common patterns, verify actual link
    technologies: ['4G', '5G', '3G']
  },
  {
    name: 'BSNL',
    logoDataAiHint: 'BSNL logo',
    description: 'Check BSNL\'s official website for information on their network coverage, including 3G and 4G services.',
    mapUrl: 'https://www.bsnl.co.in/opencms/bsnl/BSNL/about_us/network/network.html', // General network page, specific map might be harder to find
    technologies: ['3G', '4G']
  }
];

export default function NetworkCoveragePage() {
  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <header className="mb-12 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
            <MapPinned className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Mobile Network Coverage Explorer
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-muted-foreground md:text-lg">
          Find links to official network coverage maps from major Indian telecom operators. Select an operator below to view their map and check coverage in your area.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
            You can usually filter by network type (3G, 4G, 5G) and search for specific locations on the operator's map.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
        {operatorsData.map((operator) => (
          <OperatorCoverageCard key={operator.name} operator={operator} />
        ))}
      </div>

      <Alert className="mt-12 bg-muted/50">
        <ShieldAlert className="h-5 w-5" />
        <AlertTitle className="font-semibold">Important Disclaimer</AlertTitle>
        <AlertDescription className="text-sm space-y-1">
          <p>
            Coverage maps provide approximate outdoor coverage. Actual network experience may vary due to factors like terrain, weather, buildings, network congestion, device type, and indoor locations.
          </p>
          <p>
            Data is sourced from official telecom operator maps/websites and is subject to change. Users are advised to verify with operators for critical needs. ConnectPlan AI provides these links for convenience and is not responsible for the accuracy of the external maps.
          </p>
        </AlertDescription>
      </Alert>
    </div>
  );
}
