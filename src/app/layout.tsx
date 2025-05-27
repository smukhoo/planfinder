
"use client"; // Required because we are introducing state here

import type { Metadata } from 'next';
import { useState } from 'react'; // Import useState
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { ChatWidget } from '@/components/ai/chat-widget';

// Removing 'export' from metadata because it's a client component.
// This metadata object will be local and not used by Next.js for static generation.
// For global metadata, define it in a server component or a metadata.ts file.
const metadata: Metadata = {
  title: 'ConnectPlan AI - Smart Telecom Plan Finder',
  description: 'Easily find, compare, and get AI recommendations for prepaid mobile recharge plans from Airtel, Jio, and Vi.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col antialiased">
        <Header isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatWidget isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
        <Toaster />
      </body>
    </html>
  );
}
