import Link from 'next/link';
import { Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <Smartphone className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold text-foreground">ConnectPlan AI</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Button asChild variant="ghost">
            <Link href="/plans">Find Plans</Link>
          </Button>
          {/* Future navigation links can be added here */}
        </nav>
      </div>
    </header>
  );
}
