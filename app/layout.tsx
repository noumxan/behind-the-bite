import type { Metadata } from "next";
import { Fraunces, Figtree, IBM_Plex_Mono } from "next/font/google";
import { AppStateProvider } from "@/components/providers/AppState";
import { DemoBanner } from "@/components/ui/DemoBanner";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Onboarding } from "@/components/profile/Onboarding";
import { AskComposer } from "@/components/inbox/AskComposer";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Figtree({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Behind the Bite",
    template: "%s · Behind the Bite",
  },
  description:
    "Discover the engineering behind familiar snacks and find a way into food manufacturing that works for you.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-cream text-ink antialiased" suppressHydrationWarning>
        <AppStateProvider>
          <DemoBanner />
          <SiteHeader />
          <Onboarding />
          <main id="main">{children}</main>
          <SiteFooter />
          <AskComposer />
        </AppStateProvider>
      </body>
    </html>
  );
}
