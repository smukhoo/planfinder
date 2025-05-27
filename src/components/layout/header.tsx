
import Link from 'next/link';
import { Smartphone, Search, Globe, UserCircle, Menu, Users, Settings, HelpCircle, MapPin } from 'lucide-react'; // Added Users, Settings, HelpCircle, MapPin
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navLinks = [
  { href: '/plans', label: 'Plans', icon: <Smartphone className="h-4 w-4 sm:mr-1" /> },
  { href: '#', label: 'Offers', icon: <Settings className="h-4 w-4 sm:mr-1" /> }, // Placeholder, using Settings as example
  { href: '/roaming-advisor', label: 'Roaming', icon: <Globe className="h-4 w-4 sm:mr-1" /> },
  // { href: '/network-coverage', label: 'Coverage', icon: <MapPin className="h-4 w-4 sm:mr-1" /> }, // Removed
  { href: '/forum', label: 'Forum', icon: <Users className="h-4 w-4 sm:mr-1" /> },
  { href: '#', label: 'Help', icon: <HelpCircle className="h-4 w-4 sm:mr-1" /> },   // Placeholder
];

export function Header() {
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
          {navLinks.map(link => (
            <Button key={link.label} asChild variant="ghost" className="text-sm sm:text-base px-2 sm:px-3">
              {
                <Link href={link.href} className="flex items-center">
                  {link.icon}
                  <span className="hidden sm:inline">{link.label}</span>
                </Link>
              }
            </Button>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="h-9 w-full rounded-md bg-muted pl-8 pr-2 md:w-[200px] lg:w-[250px]"
            />
          </div>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Globe className="h-5 w-5" />
            <span className="sr-only">Language</span>
          </Button>
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
                {navLinks.map(link => (
                   <Link key={link.label} href={link.href} className="text-muted-foreground hover:text-foreground py-2 flex items-center">
                    {React.cloneElement(link.icon, { className: 'h-5 w-5 mr-3' })} {/* Ensure mobile icons are consistently sized */}
                    {link.label}
                  </Link>
                ))}
                 <div className="relative mt-4">
                  <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="h-9 w-full rounded-md bg-muted pl-8 pr-2"
                  />
                </div>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                   <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground flex-1 justify-start">
                    <Globe className="mr-2 h-5 w-5" /> Language
                  </Button>
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
