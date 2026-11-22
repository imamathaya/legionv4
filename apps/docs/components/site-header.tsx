import Link from "next/link";
import { dictionary, docsPath, type Locale } from "../i18n";
import { ModeToggle } from "./mode-toggle";

export function SiteHeader({ locale }: { locale: Locale }) {
  const copy = dictionary[locale];
  const otherLocale: Locale = locale === "en" ? "id" : "en";
  const otherHref = locale === "en" ? "/id/docs/components/button" : "/docs/components/button";

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <nav className="flex items-center gap-4 text-sm" aria-label={copy.docs}>
          <Link className="font-semibold text-foreground" href={locale === "en" ? "/" : "/id"}>
            Legion v4
          </Link>
          <Link className="text-muted-foreground" href={docsPath(locale, "button")}>
            {copy.components}
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            className="text-sm text-muted-foreground underline underline-offset-4"
            href={otherHref}
            hrefLang={otherLocale}
          >
            {copy.language}
          </Link>
          <ModeToggle label={copy.toggleTheme} lightLabel={copy.light} darkLabel={copy.dark} />
        </div>
      </div>
    </header>
  );
}
