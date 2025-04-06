import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from './components/layout/Navbar';
import { Analytics } from "@vercel/analytics/react"
import MobileHeader from './components/ui/MobileHeader';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dishee - Discover the Best Dishes",
  description: "AI-powered restaurant dish recommendations based on reviews",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MobileHeader />
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  );
}
