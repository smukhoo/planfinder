import type { Metadata } from 'next';
// Removed: import { GeistSans } from 'geist/font/sans';
// Removed: import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { ChatWidget } from '@/components/ai/chat-widget';

export const metadata: Metadata = {
  title: 'ConnectPlan AI - Smart Telecom Plan Finder',
  description: 'Easily find, compare, and get AI recommendations for prepaid mobile recharge plans from Airtel, Jio, and Vi.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatWidget />
        <Toaster />
      </body>
    </html>
  );
}
