
import * as React from 'react';
import Link from 'next/link';
import { Smartphone, Settings, Globe, Users, HelpCircle, Menu, UserCircle, Sparkles, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface NavLinkItem {
  href: string;
  label: string;
  icon: JSX.Element;
  action?: () => void;
  isAnimated?: boolean;
}

interface HeaderProps {
  isChatOpen: boolean;
  setIsChatOpen: (isOpen: boolean) => void;
}

export function Header({ setIsChatOpen }: HeaderProps) {
  const navLinks: NavLinkItem[] = [
    { href: '/plans', label: 'Plans', icon: <Smartphone className="h-4 w-4 sm:mr-1" /> },
    { href: '/roaming-advisor', label: 'Roaming', icon: <Globe className="h-4 w-4 sm:mr-1" /> },
    { href: '/network-coverage', label: 'Coverage', icon: <Map className="h-4 w-4 sm:mr-1" /> },
    { href: '/forum', label: 'Forum', icon: <Users className="h-4 w-4 sm:mr-1" /> },
    {
      href: '#',
      label: 'Ask AI',
      icon: <Sparkles className="h-4 w-4 sm:mr-1" />,
      action: () => setIsChatOpen(true),
      isAnimated: true
    },
    { href: '#', label: 'Help', icon: <HelpCircle className="h-4 w-4 sm:mr-1" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="hsl(var(--primary))" xmlns="http://www.w3.org/2000/svg" className="h-7 w-7">
            <circle cx="12" cy="12" r="10" stroke="hsl(var(--primary))" strokeWidth="1.5" fill="none"/>
            <path d="M12 6V12L16 14" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 10L14 14M14 10L10 14" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-xl font-bold text-foreground">Recharge Finder</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 sm:gap-2 md:flex">
          {navLinks.map(link => {
            const buttonClasses = cn(
              "text-sm sm:text-base px-2 sm:px-3",
              link.isAnimated && "animate-pulse-glow"
            );
            if (link.action) {
              return (
                <Button key={link.label} variant="ghost" className={buttonClasses} onClick={link.action}>
                  {link.icon}
                  <span className="hidden sm:inline">{link.label}</span>
                </Button>
              );
            }
            return (
              <Button key={link.label} asChild variant="ghost" className={buttonClasses}>
                <Link href={link.href} className="flex items-center">
                  {link.icon}
                  <span className="hidden sm:inline">{link.label}</span>
                </Link>
              </Button>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
            <UserCircle className="h-6 w-6" />
            <span className="sr-only">User Profile</span>
          </Button>
        </div>

        {/* Mobile Navigation Trigger */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="grid gap-4 p-4 text-lg font-medium">
                <Link href="/" className="flex items-center gap-2 pb-4 border-b mb-2">
                   <svg width="28" height="28" viewBox="0 0 24 24" fill="hsl(var(--primary))" xmlns="http://www.w3.org/2000/svg" className="h-7 w-7">
                     <circle cx="12" cy="12" r="10" stroke="hsl(var(--primary))" strokeWidth="1.5" fill="none"/>
                     <path d="M12 6V12L16 14" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                     <path d="M10 10L14 14M14 10L10 14" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                   </svg>
                  <span className="text-xl font-bold text-foreground">Recharge Finder</span>
                </Link>
                {navLinks.map(link => {
                  if (link.action) {
                    return (
                      <Button
                        key={link.label}
                        variant="ghost"
                        onClick={() => {
                          link.action!();
                          // Optionally close sheet after action
                          // document.querySelector('[data-radix-sheet-close]')?.click();
                        }}
                        className={cn("text-muted-foreground hover:text-foreground py-2 flex items-center justify-start text-base", link.isAnimated && "animate-pulse-glow")}
                      >
                        {React.cloneElement(link.icon, { className: 'h-5 w-5 mr-3' })}
                        {link.label}
                      </Button>
                    );
                  }
                  return (
                    <Link key={link.label} href={link.href} className="text-muted-foreground hover:text-foreground py-2 flex items-center text-base">
                      {React.cloneElement(link.icon, { className: 'h-5 w-5 mr-3' })}
                      {link.label}
                    </Link>
                  );
                })}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground flex-1 justify-start">
                    <UserCircle className="mr-2 h-5 w-5" /> Profile
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
