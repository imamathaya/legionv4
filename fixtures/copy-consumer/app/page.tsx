import { Search } from "lucide-react";

import { Button as PackageButton } from "@legionv4/ui";

import { Button as CopyButton } from "@/components/ui/button";

const VARIANTS = ["default", "secondary", "destructive", "outline", "ghost"] as const;
const SIZES = ["sm", "default", "lg"] as const;

export default function Page() {
  return (
    <main className="min-h-screen bg-background p-6 text-foreground">
      <h1 className="text-xl font-semibold">Copy vs package parity</h1>

      <section data-source="package" className="mt-6 space-y-3">
        <h2 className="font-medium">Package</h2>
        {VARIANTS.map((variant) => (
          <div key={variant} className="flex flex-wrap items-center gap-3">
            {SIZES.map((size) => (
              <PackageButton
                key={size}
                variant={variant}
                size={size}
                data-testid={`matrix-${variant}-${size}`}
              >
                {variant} {size}
              </PackageButton>
            ))}
          </div>
        ))}
        <div className="flex flex-wrap items-center gap-3">
          <PackageButton data-testid="loading" loading loadingLabel="Loading">
            Saving
          </PackageButton>
          <PackageButton data-testid="disabled" disabled>
            Disabled
          </PackageButton>
          <PackageButton data-testid="icon" size="sm" className="size-8" aria-label="Search">
            <Search aria-hidden="true" />
          </PackageButton>
          <PackageButton data-testid="link" variant="outline" asChild>
            <a href="#copy">Link</a>
          </PackageButton>
        </div>
      </section>

      <section data-source="copy" className="mt-10 space-y-3">
        <h2 className="font-medium">Copy</h2>
        {VARIANTS.map((variant) => (
          <div key={variant} className="flex flex-wrap items-center gap-3">
            {SIZES.map((size) => (
              <CopyButton
                key={size}
                variant={variant}
                size={size}
                data-testid={`matrix-${variant}-${size}`}
              >
                {variant} {size}
              </CopyButton>
            ))}
          </div>
        ))}
        <div className="flex flex-wrap items-center gap-3">
          <CopyButton data-testid="loading" loading loadingLabel="Loading">
            Saving
          </CopyButton>
          <CopyButton data-testid="disabled" disabled>
            Disabled
          </CopyButton>
          <CopyButton data-testid="icon" size="sm" className="size-8" aria-label="Search">
            <Search aria-hidden="true" />
          </CopyButton>
          <CopyButton data-testid="link" variant="outline" asChild>
            <a href="#copy">Link</a>
          </CopyButton>
        </div>
      </section>
    </main>
  );
}
