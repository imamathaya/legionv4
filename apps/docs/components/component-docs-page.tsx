import { readFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { DICTIONARIES, SECTION_KEYS, docsHref, type Locale, type SectionKey } from "../i18n";
import { REPOSITORY_ROOT, readProse, type ProseSection } from "../lib/content";
import metadata from "../generated/metadata/button.json";
import { ButtonShowcase } from "./button-showcase";
import { SourceViewer } from "./source-viewer";
import { BasicButtonExample } from "../examples/button/basic";
import { ButtonIconExample } from "../examples/button/icon";
import { ButtonLinkExample } from "../examples/button/link";
import { ButtonLoadingExample } from "../examples/button/loading";
import { ButtonSizesExample } from "../examples/button/sizes";
import { ButtonVariantsExample } from "../examples/button/variants";

const EXAMPLES = {
  "basic.tsx": BasicButtonExample,
  "variants.tsx": ButtonVariantsExample,
  "sizes.tsx": ButtonSizesExample,
  "loading.tsx": ButtonLoadingExample,
  "icon.tsx": ButtonIconExample,
  "link.tsx": ButtonLinkExample,
} as const;

function Markdown({ body }: { body: string }) {
  return (
    <div className="docs-prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
    </div>
  );
}

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-24 text-xl font-semibold tracking-tight">
      {children}
    </h2>
  );
}

function sectionAt(sections: ProseSection[], key: SectionKey): ProseSection {
  const index = SECTION_KEYS.indexOf(key);
  const section = sections[index];
  if (!section) throw new Error(`missing prose section ${key}`);
  return section;
}

export function ComponentDocsPage({ locale }: { locale: Locale }) {
  const dictionary = DICTIONARIES[locale];
  const sections = readProse(locale);
  const other: Locale = locale === "en" ? "id" : "en";
  const source = readFileSync(
    resolve(REPOSITORY_ROOT, "packages/ui/src/components/ui/button.tsx"),
    "utf8",
  );

  const preview = sectionAt(sections, "preview");
  const pkg = sectionAt(sections, "package");
  const copy = sectionAt(sections, "copy");
  const usage = sectionAt(sections, "usage");
  const props = sectionAt(sections, "props");
  const dependencies = sectionAt(sections, "dependencies");
  const accessibility = sectionAt(sections, "accessibility");

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)]">
      <aside className="hidden lg:block">
        <nav aria-label={dictionary.onThisPage} className="sticky top-6 space-y-2 text-sm">
          <p className="font-medium text-muted-foreground">{dictionary.onThisPage}</p>
          {SECTION_KEYS.map((key) => (
            <a
              key={key}
              href={`#section-${key}`}
              className="block rounded-sm py-1 text-muted-foreground hover:text-foreground"
            >
              {dictionary.sections[key]}
            </a>
          ))}
        </nav>
      </aside>

      <main className="min-w-0 space-y-12">
        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium text-muted-foreground">{dictionary.componentLabel}</p>
            <span className="rounded-sm bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
              v{metadata.version}
            </span>
            <span className="rounded-sm bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {metadata.variants.length} {dictionary.variantsLabel} · {metadata.sizes.length}{" "}
              {dictionary.sizesLabel}
            </span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">{metadata.title}</h1>
          <p className="max-w-2xl text-muted-foreground">{metadata.description}</p>
          <Link
            href={docsHref(other, "button")}
            hrefLang={other}
            data-testid="language-switch"
            className="inline-flex min-h-9 items-center rounded-md border border-input px-3 text-sm hover:bg-accent hover:text-accent-foreground"
          >
            {dictionary.switchTo}
          </Link>
        </header>

        <section
          id="section-preview"
          data-testid="docs-section-preview"
          aria-labelledby="heading-preview"
          className="space-y-4"
        >
          <SectionHeading id="heading-preview">{dictionary.sections.preview}</SectionHeading>
          <Markdown body={preview.body} />
          <ButtonShowcase locale={locale} />
        </section>

        <section
          id="section-package"
          data-testid="docs-section-package"
          aria-labelledby="heading-package"
          className="space-y-4"
        >
          <SectionHeading id="heading-package">{dictionary.sections.package}</SectionHeading>
          <Markdown body={pkg.body} />
        </section>

        <section
          id="section-copy"
          data-testid="docs-section-copy"
          aria-labelledby="heading-copy"
          className="space-y-4"
        >
          <SectionHeading id="heading-copy">{dictionary.sections.copy}</SectionHeading>
          <Markdown body={copy.body} />
        </section>

        <section
          id="section-usage"
          data-testid="docs-section-usage"
          aria-labelledby="heading-usage"
          className="space-y-4"
        >
          <SectionHeading id="heading-usage">{dictionary.sections.usage}</SectionHeading>
          <Markdown body={usage.body} />
          <h3 className="text-sm font-semibold">{dictionary.examplesTitle}</h3>
          <div className="grid gap-4">
            {metadata.examples.map((example) => {
              const file = basename(example.codePath);
              const Example = EXAMPLES[file as keyof typeof EXAMPLES];
              const code = readFileSync(resolve(REPOSITORY_ROOT, example.codePath), "utf8");
              return (
                <article key={example.codePath} className="space-y-3 rounded-lg border border-border p-4">
                  <div>
                    <h4 className="font-medium">{example.title}</h4>
                    <p className="text-sm text-muted-foreground">{example.description}</p>
                  </div>
                  {Example ? (
                    <div className="rounded-md border border-border bg-card p-4">
                      <Example />
                    </div>
                  ) : null}
                  <SourceViewer code={code} title={dictionary.sourceTitle} />
                </article>
              );
            })}
          </div>
        </section>

        <section
          id="section-props"
          data-testid="docs-section-props"
          aria-labelledby="heading-props"
          className="space-y-4"
        >
          <SectionHeading id="heading-props">{dictionary.sections.props}</SectionHeading>
          <Markdown body={props.body} />
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  {[
                    dictionary.propColumn,
                    dictionary.typeColumn,
                    dictionary.defaultColumn,
                    dictionary.requiredColumn,
                  ].map((label) => (
                    <th
                      key={label}
                      scope="col"
                      className="border border-border bg-muted px-3 py-2 text-start font-medium text-muted-foreground"
                    >
                      {label}
                    </th>
                  ))}
                  <th
                    scope="col"
                    className="border border-border bg-muted px-3 py-2 text-start font-medium text-muted-foreground"
                  >
                    {dictionary.descriptionColumn}
                  </th>
                </tr>
              </thead>
              <tbody>
                {metadata.props.map((prop) => (
                  <tr key={prop.name}>
                    <th scope="row" className="border border-border px-3 py-2 text-start font-mono">
                      {prop.name}
                    </th>
                    <td className="border border-border px-3 py-2 font-mono text-xs">{prop.type}</td>
                    <td className="border border-border px-3 py-2 font-mono text-xs">
                      {prop.defaultValue ?? "—"}
                    </td>
                    <td className="border border-border px-3 py-2">
                      {prop.required ? dictionary.requiredColumn : dictionary.notRequired}
                    </td>
                    <td className="border border-border px-3 py-2">{prop.descriptions[locale]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground">{dictionary.nativeAttributes}</p>
        </section>

        <section
          id="section-dependencies"
          data-testid="docs-section-dependencies"
          aria-labelledby="heading-dependencies"
          className="space-y-4"
        >
          <SectionHeading id="heading-dependencies">{dictionary.sections.dependencies}</SectionHeading>
          <Markdown body={dependencies.body} />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-md border border-border p-4">
              <p className="text-sm font-medium">{dictionary.packageName}</p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {metadata.dependencies.map((dependency) => (
                  <li key={dependency}>
                    <code>{dependency}</code>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-md border border-border p-4">
              <p className="text-sm font-medium">{dictionary.registryLabel}</p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {metadata.registryDependencies.map((dependency) => (
                  <li key={dependency}>
                    <a className="underline" href={dependency}>
                      {dependency}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section
          id="section-accessibility"
          data-testid="docs-section-accessibility"
          aria-labelledby="heading-accessibility"
          className="space-y-4"
        >
          <SectionHeading id="heading-accessibility">
            {dictionary.sections.accessibility}
          </SectionHeading>
          <Markdown body={accessibility.body} />
          <div className="rounded-md border border-border p-4">
            <p className="text-sm font-medium">{metadata.a11y.standard}</p>
            <p className="mt-1 text-sm text-muted-foreground">{metadata.a11y.notes}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {metadata.a11y.criteria.map((criterion) => (
                <li
                  key={criterion}
                  className="rounded-sm bg-secondary px-2 py-1 text-xs text-secondary-foreground"
                >
                  {criterion}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">{metadata.a11y.checklistPath}</p>
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeading id="heading-source">{dictionary.sourceTitle}</SectionHeading>
          <SourceViewer code={source} title="packages/ui/src/components/ui/button.tsx" />
        </section>
      </main>
    </div>
  );
}
