import type { Metadata } from "next";

import "../globals.css";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: {
    default: "Legion v4",
    template: "%s · Legion v4",
  },
  description: "Komponen React berbasis token semantik dengan dokumentasi dua bahasa.",
  alternates: {
    languages: {
      en: "/",
      id: "/id",
    },
  },
};

export default function IndonesianLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        <ThemeProvider>
          <SiteHeader locale="id" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
