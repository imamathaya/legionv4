import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@legionv4/ui";

export default function EnglishHomePage() {
  return (
    <main className="mx-auto max-w-4xl space-y-8 px-4 py-16 sm:px-6">
      <p className="text-sm font-medium text-muted-foreground">Based Asset · Legion v4</p>
      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight">
        A design system that AI and people can both read.
      </h1>
      <p className="max-w-2xl text-lg text-muted-foreground">
        Semantic tokens, a token-only Button, and documentation generated from the same source that
        ships in the package and the copy registry.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link href="/docs/components/button">
            Read the Button docs
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/preview/button">Open the preview</Link>
        </Button>
      </div>
      <section className="grid gap-4 sm:grid-cols-3">
        {[
          ["Tokens", "19 semantic colours + radius, light and dark, checked for contrast."],
          ["Button", "Five variants, three sizes, six states, keyboard and screen-reader ready."],
          ["Distribution", "One source powers the package and the shadcn copy item."],
        ].map(([title, body]) => (
          <article key={title} className="rounded-lg border border-border p-4">
            <h2 className="font-medium">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{body}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
