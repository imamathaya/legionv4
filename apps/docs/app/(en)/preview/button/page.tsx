import type { Metadata } from "next";

import { ButtonShowcase } from "@/components/button-showcase";
import { DICTIONARIES } from "@/i18n";

export const metadata: Metadata = {
  title: "Button preview",
  description: "Every Button variant, size, and state rendered for visual and accessibility checks.",
  alternates: {
    canonical: "/preview/button",
  },
};

export default function ButtonPreviewPage() {
  const dictionary = DICTIONARIES.en;

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6">
      <header className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">{dictionary.componentLabel}</p>
        <h1 className="text-3xl font-semibold tracking-tight">Button preview</h1>
        <p className="max-w-2xl text-muted-foreground">
          The matrix below is the package Button. Switch the theme from the header and every cell
          follows without a component-level override.
        </p>
      </header>
      <ButtonShowcase locale="en" />
    </main>
  );
}
