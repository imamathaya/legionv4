"use client";

import { Button } from "@legionv4/ui";
import { Search } from "lucide-react";
import { dictionary, type Locale } from "../i18n";

const variants = ["default", "secondary", "destructive", "outline", "ghost"] as const;
const sizes = ["sm", "default", "lg"] as const;

export function ButtonShowcase({ locale }: { locale: Locale }) {
  const copy = dictionary[locale];
  const labels =
    locale === "en"
      ? { variants: "Variants", sizes: "Sizes", states: "States", long: "A long label that wraps instead of clipping" }
      : { variants: "Varian", sizes: "Ukuran", states: "State", long: "Label panjang yang membungkus, bukan terpotong" };

  return (
    <div className="space-y-8" data-testid="button-showcase">
      <div>
        <h3 className="mb-3 font-medium text-foreground">{labels.variants}</h3>
        <div className="flex flex-wrap items-center gap-2">
          {variants.map((variant) => (
            <Button key={variant} variant={variant}>
              {variant === "default" ? copy.button : variant}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-medium text-foreground">{labels.sizes}</h3>
        <div className="flex flex-wrap items-end gap-2">
          {sizes.map((size) => (
            <Button key={size} size={size}>
              {size === "default" ? "Default" : size.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-medium text-foreground">{labels.states}</h3>
        <div className="flex flex-wrap items-center gap-2">
          <Button disabled>Disabled</Button>
          <Button loading loadingLabel={locale === "id" ? "Menyimpan" : "Saving"}>
            {locale === "id" ? "Simpan" : "Save"}
          </Button>
          <Button variant="outline" asChild>
            <a href={locale === "id" ? "/id/docs/components/button" : "/docs/components/button"}>Link</a>
          </Button>
          <Button className="size-9 px-0" aria-label="Search">
            <Search aria-hidden="true" className="size-4 shrink-0" />
          </Button>
        </div>
      </div>

      <div className="max-w-40">
        <Button className="w-full">{labels.long}</Button>
      </div>
    </div>
  );
}
