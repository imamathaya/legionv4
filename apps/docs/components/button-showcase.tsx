import { Search } from "lucide-react";
import { Button } from "@legionv4/ui";

import type { Locale } from "../i18n";
import { DICTIONARIES } from "../i18n";

const VARIANTS = ["default", "secondary", "destructive", "outline", "ghost"] as const;
const SIZES = ["sm", "default", "lg"] as const;

export function ButtonShowcase({ locale }: { locale: Locale }) {
  const dictionary = DICTIONARIES[locale];

  return (
    <div className="space-y-10" data-testid="button-showcase">
      <section aria-labelledby="matrix-heading" className="space-y-4">
        <h2 id="matrix-heading" className="text-xl font-semibold tracking-tight">
          {dictionary.matrixLabel}
        </h2>
        <div className="space-y-3">
          {VARIANTS.map((variant) => (
            <div key={variant} className="flex flex-wrap items-center gap-3">
              <span className="w-24 shrink-0 text-sm font-medium">{variant}</span>
              {SIZES.map((size) => (
                <Button
                  key={size}
                  variant={variant}
                  size={size}
                  data-testid={`matrix-${variant}-${size}`}
                >
                  {variant} {size}
                </Button>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="states-heading" className="space-y-4">
        <h2 id="states-heading" className="text-xl font-semibold tracking-tight">
          {dictionary.statesLabel}
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button data-testid="state-default">Default</Button>
          <Button data-testid="state-loading" loading loadingLabel={locale === "id" ? "Memuat" : "Loading"}>
            {locale === "id" ? "Menyimpan" : "Saving"}
          </Button>
          <Button data-testid="state-disabled" disabled>
            Disabled
          </Button>
          <Button data-testid="state-link" variant="outline" asChild>
            <a href="#states-heading">Link</a>
          </Button>
          <Button data-testid="state-destructive" variant="destructive">
            Destructive
          </Button>
        </div>
      </section>

      <section aria-labelledby="targets-heading" className="space-y-4">
        <h2 id="targets-heading" className="text-xl font-semibold tracking-tight">
          {dictionary.targetsLabel}
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm" className="size-8" aria-label="Search" data-testid="icon-button">
            <Search aria-hidden="true" />
          </Button>
          <Button data-testid="icon-text-button">
            <Search aria-hidden="true" />
            Search
          </Button>
          <Button data-testid="long-label" className="max-w-full">
            A deliberately long label that must wrap instead of being clipped on narrow screens
          </Button>
        </div>
      </section>
    </div>
  );
}
