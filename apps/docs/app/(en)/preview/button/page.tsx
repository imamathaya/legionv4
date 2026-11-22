import { ButtonShowcase } from "@/components/button-showcase";
import { SiteHeader } from "@/components/site-header";

export default function ButtonPreviewPage() {
  return (
    <>
      <SiteHeader locale="en" />
      <main className="mx-auto max-w-5xl px-6 py-10" data-testid="button-preview">
        <h1 className="mb-6 text-2xl font-semibold text-foreground">Button preview</h1>
        <h2 className="mb-4 text-lg font-medium text-foreground">Variants and states</h2>
        <ButtonShowcase locale="en" />
      </main>
    </>
  );
}
