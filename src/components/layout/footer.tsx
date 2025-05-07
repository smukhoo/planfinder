export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto flex flex-col items-center justify-center gap-1 px-4 py-8 text-center md:px-6 md:flex-row md:justify-between">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} ConnectPlan AI. All rights reserved.
        </p>
        <p className="text-sm text-muted-foreground">
          Your Smart Telecom Plan Finder.
        </p>
      </div>
    </footer>
  );
}
