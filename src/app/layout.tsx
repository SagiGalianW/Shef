import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NextTopLoader from 'nextjs-toploader';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Proper metadata for the Chef Admin Dashboard
export const metadata: Metadata = {
  title: "Chef's Dashboard | Admin Management",
  description: "Manage catering events and leads professionally.",
};

// Viewport configuration to prevent auto-zoom on mobile inputs (< 16px font bug on iOS)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
        <NextTopLoader
            color="#f97316"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow="0 0 10px #f97316,0 0 5px #f97316"
          />

        {children}
      </body>
    </html>
  );
}