import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { dictionary, type Locale } from "../i18n";
import { ButtonShowcase } from "./button-showcase";
import { loadComponentMetadata, loadProse } from "./load-component";
import { SiteHeader } from "./site-header";
import { SourceViewer } from "./source-viewer";
import { UsageExamples } from "./usage-examples";

type Token = "PREVIEW" | "EXAMPLES" | "PROPS" | "DEPENDENCIES" | "SOURCE";
const tokenPattern = /(\[\[(?:PREVIEW|EXAMPLES|PROPS|DEPENDENCIES|SOURCE)\]\])/g;

export function ComponentDocsPage({ locale, slug }: { locale: Locale; slug: string }) {
  const copy = dictionary[locale];
  const metadata = loadComponentMetadata(slug);
  const prose = loadProse(`content/components/${slug}.${locale}.md`);
  const segments = prose.split(tokenPattern).filter((segment) => segment.length > 0);

  return (
    <>
      <SiteHeader locale={locale} />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <p className="text-sm text-muted-foreground">{copy.components}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{copy.button}</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">{copy.componentIntro}</p>

        <article className="mt-10">
          {segments.map((segment, index) => {
            if (segment.startsWith("[[") && segment.endsWith("]]")) {
              const token = segment.slice(2, -2) as Token;
              switch (token) {
                case "PREVIEW":
                  return <ButtonShowcase key={index} locale={locale} />;
                case "EXAMPLES":
                  return <UsageExamples key={index} />;
                case "PROPS":
                  return <PropsTable key={index} locale={locale} props={metadata.props} />;
                case "DEPENDENCIES":
                  return (
                    <ul key={index} className="my-4 list-inside list-disc text-sm text-muted-foreground">
                      {metadata.dependencies.map((dependency) => (
                        <li key={dependency}>
                          <code className="rounded-sm bg-muted px-1 py-0.5 text-foreground">{dependency}</code>
                        </li>
                      ))}
                    </ul>
                  );
                case "SOURCE":
                  return <SourceViewer key={index} path="packages/ui/src/components/ui/button.tsx" />;
                default:
                  return null;
              }
            }

            return (
              <ReactMarkdown
                key={index}
                remarkPlugins={[remarkGfm]}
                components={{
                  h2: ({ children }) => (
                    <h2 className="mt-10 mb-3 border-b border-border pb-2 text-xl font-semibold text-foreground">
                      {children}
                    </h2>
                  ),
                  p: ({ children }) => <p className="my-3 leading-7 text-foreground">{children}</p>,
                  ul: ({ children }) => <ul className="my-3 list-inside list-disc text-foreground">{children}</ul>,
                  li: ({ children }) => <li className="my-1">{children}</li>,
                  a: ({ children, href }) => (
                    <a className="text-primary underline underline-offset-4" href={href}>
                      {children}
                    </a>
                  ),
                  code: ({ children }) => (
                    <code className="rounded-sm bg-muted px-1 py-0.5 text-sm text-foreground">{children}</code>
                  ),
                }}
              >
                {segment}
              </ReactMarkdown>
            );
          })}
        </article>
      </main>
    </>
  );
}

function PropsTable({ locale, props }: { locale: Locale; props: Array<{ name: string; type: string; required: boolean; defaultValue?: string | null; descriptions: Record<Locale, string> }> }) {
  return (
    <div className="my-4 overflow-x-auto rounded-md border border-border">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-muted text-left">
          <tr>
            <th className="px-3 py-2 font-medium">Prop</th>
            <th className="px-3 py-2 font-medium">Type</th>
            <th className="px-3 py-2 font-medium">Default</th>
            <th className="px-3 py-2 font-medium">{locale === "en" ? "Description" : "Keterangan"}</th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop) => (
            <tr key={prop.name} className="border-t border-border">
              <td className="px-3 py-2 font-mono text-xs text-foreground">{prop.name}</td>
              <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{prop.type}</td>
              <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{prop.defaultValue ?? "—"}</td>
              <td className="px-3 py-2 text-foreground">{prop.descriptions[locale]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
