import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export function SourceViewer({ path }: { path: string }) {
  const source = readFileSync(resolve(process.cwd(), "../../", path), "utf8");
  return (
    <pre tabIndex={0} className="overflow-x-auto rounded-md border border-border bg-muted p-4 text-xs leading-relaxed text-foreground">
      <code>{source}</code>
    </pre>
  );
}
