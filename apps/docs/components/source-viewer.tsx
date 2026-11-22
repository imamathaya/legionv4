export function SourceViewer({ code, title }: { code: string; title: string }) {
  return (
    <details className="rounded-md border border-border bg-card">
      <summary className="cursor-pointer px-4 py-2 text-sm font-medium text-card-foreground">
        {title}
      </summary>
      <pre className="max-h-96 overflow-auto border-t border-border p-4 text-xs">
        <code>{code}</code>
      </pre>
    </details>
  );
}
