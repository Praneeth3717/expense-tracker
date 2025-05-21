import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import './lib/fontawesome';
import SessionWrapper from "@/components/SessionWrapper";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "TrackMyCash - Personal Finance Tracker",
  description: "Track your income and expenses with ease",
};

export const viewport = {
  width: 'device-width',
  initialScale: 0.8,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}