import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { NavBar } from "@/components/nav-bar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MediaMonitor — Media Monitoring Platform",
  description:
    "Search global media coverage and subscribe to keyword alerts across places, languages, and media types.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <Providers>
          <NavBar />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400">
            MediaMonitor — demo media monitoring platform running on seeded sample data.
          </footer>
        </Providers>
      </body>
    </html>
  );
}
