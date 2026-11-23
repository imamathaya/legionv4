import type { Metadata } from "next";

import "../globals.css";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: {
    default: "Legion v4",
    template: "%s · Legion v4",
  },
  description: "Semantic-token React components with bilingual documentation.",
  alternates: {
    languages: {
      en: "/",
      id: "/id",
    },
  },
};

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        <ThemeProvider>
          <SiteHeader locale="en" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
