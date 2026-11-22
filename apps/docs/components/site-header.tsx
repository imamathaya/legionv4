import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@legionv4/ui";
import { DICTIONARIES, docsHref, type Locale } from "../i18n";
import { ModeToggle } from "./mode-toggle";

type SiteHeaderProps = {
  locale: Locale;
  active?: "docs" | "preview";
};

export function SiteHeader({ locale, active }: SiteHeaderProps) {
  const dictionary = DICTIONARIES[locale];
  const other: Locale = locale === "en" ? "id" : "en";
  const otherHref = other === "en" ? "/docs/components/button" : "/id/docs/components/button";

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link href={locale === "en" ? "/" : "/id"} className="text-base font-semibold tracking-tight">
            {dictionary.siteTitle}
          </Link>
          <span className="rounded-sm bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
            {dictionary.componentLabel}
          </span>
        </div>
        <nav aria-label={dictionary.docsNav} className="flex flex-wrap items-center gap-2">
          <Link
            href={docsHref(locale, "button")}
            aria-current={active === "docs" ? "page" : undefined}
            className={cn(
              "inline-flex min-h-9 items-center rounded-md px-3 text-sm hover:bg-accent hover:text-accent-foreground",
              active === "docs" && "bg-accent text-accent-foreground",
            )}
          >
            {dictionary.docsNav}
          </Link>
          <Link
            href="/preview/button"
            aria-current={active === "preview" ? "page" : undefined}
            className={cn(
              "inline-flex min-h-9 items-center rounded-md px-3 text-sm hover:bg-accent hover:text-accent-foreground",
              active === "preview" && "bg-accent text-accent-foreground",
            )}
          >
            {dictionary.previewNav}
          </Link>
          <Link
            href={otherHref}
            hrefLang={other}
            className="inline-flex min-h-9 items-center gap-1 rounded-md px-3 text-sm hover:bg-accent hover:text-accent-foreground"
          >
            {dictionary.switchTo}
            <ArrowRight aria-hidden="true" className="size-3" />
          </Link>
          <ModeToggle
            label={dictionary.themeLabel}
            lightLabel={dictionary.light}
            darkLabel={dictionary.dark}
          />
        </nav>
      </div>
    </header>
  );
}
