
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 text-center md:px-6 md:flex-row">
        <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                FAQs
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Contact Us
            </Link>
        </div>
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Recharge Finder. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
