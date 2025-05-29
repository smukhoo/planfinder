"use client";

import type { Metadata } from 'next';
import { useState, useEffect } from 'react';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { ChatWidget } from '@/components/ai/chat-widget';

// This metadata object will be local and not used by Next.js for static generation.
// For global metadata, define it in a server component or a metadata.ts file.
// const metadata: Metadata = {
//   title: 'ConnectPlan AI - Smart Telecom Plan Finder',
//   description: 'Easily find, compare, and get AI recommendations for prepaid mobile recharge plans from Airtel, Jio, and Vi.',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => { // Ensure registration happens after page load
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => console.log('[ServiceWorker] Registration successful with scope: ', registration.scope))
          .catch((err) => console.log('[ServiceWorker] Registration failed: ', err));
      });
    }
  }, []);

  return (
    <html lang="en">
      <head>
        <meta name="application-name" content="ConnectPlan AI" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ConnectPlan AI" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#4080BF" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#4080BF" />

        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        {/* Add more sizes if needed */}
        {/* <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" /> */}
        {/* <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180x180.png" /> */}
        {/* <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-167x167.png" /> */}

        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />

        {/* Script to read and log the 'data' query parameter */}
        <script>
          {`
            console.log("App loaded. Hello"); // Existing log
            const urlParams = new URLSearchParams(window.location.search);
            const dataParam = urlParams.get('data');
            if (dataParam) {
              console.log('Data from query parameter:', dataParam);
              // You can add more logic here to use the dataParam
            }
          `}
        </script>

      </head>
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
