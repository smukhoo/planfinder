"use client"; 

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center gap-6 p-8 text-center bg-background">
      <div className="p-4 bg-destructive/10 rounded-full">
        <AlertTriangle className="h-16 w-16 text-destructive" />
      </div>
      <h2 className="text-3xl font-bold text-destructive">Oops! Something went wrong.</h2>
      <p className="max-w-md text-muted-foreground">
        We encountered an unexpected issue. Please try again, or if the problem persists, contact support.
      </p>
      <p className="text-xs text-muted-foreground/70">Error: {error.message}</p>
      <Button
        onClick={() => reset()}
        variant="destructive"
        className="bg-accent text-accent-foreground hover:bg-accent/90"
      >
        Try Again
      </Button>
    </div>
  );
}
