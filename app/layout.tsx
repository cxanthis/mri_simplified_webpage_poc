import type { Metadata } from "next";
import {
  ClerkProvider
} from '@clerk/nextjs'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer"; 
import Navbar from "../components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MRI Simplified",
  description: "Deep dive with insights on MRI technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  // Toggle this flag to enable/disable the ribbon
  const showAnnouncement = false; // Change to false to hide the ribbon

  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Navbar />
          {/* Container for alignment */}
          {showAnnouncement && (
            <div className="w-full flex justify-center mt-6">
              <div className="w-full max-w-screen-lg px-2 sm:px-6 lg:px-12 bg-black text-white text-center py-2 mb-0 animate-flash">
                🚀 Exciting updates coming soon! Stay tuned!
              </div>
            </div>
          )}
          <main className="container mx-auto px-4 md:px-6 min-h-screen">{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}