
import Link from 'next/link';
import { Smartphone, MessageSquareText, Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <Smartphone className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold text-foreground">ConnectPlan AI</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Button asChild variant="ghost" className="text-sm sm:text-base px-2 sm:px-3">
            <Link href="/plans">Find Plans</Link>
          </Button>
          <Button asChild variant="ghost" className="text-sm sm:text-base px-2 sm:px-3">
            <Link href="/roaming-advisor" className="flex items-center">
              <Plane className="h-4 w-4 sm:mr-1" />
              <span>Roaming</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" className="text-sm sm:text-base px-2 sm:px-3">
            <Link href="/forum" className="flex items-center">
              <MessageSquareText className="h-4 w-4 sm:mr-1" />
              <span>Forum</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
