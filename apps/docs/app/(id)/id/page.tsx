import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@legionv4/ui";

export default function IndonesianHomePage() {
  return (
    <main className="mx-auto max-w-4xl space-y-8 px-4 py-16 sm:px-6">
      <p className="text-sm font-medium text-muted-foreground">Based Asset · Legion v4</p>
      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight">
        Design system yang bisa dibaca manusia dan agen AI.
      </h1>
      <p className="max-w-2xl text-lg text-muted-foreground">
        Token semantik, Button yang hanya memakai token, dan dokumentasi yang dibangkitkan dari
        sumber yang sama dengan paket serta item salin.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link href="/id/docs/components/button">
            Baca dokumentasi Button
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/preview/button">Buka pratinjau</Link>
        </Button>
      </div>
      <section className="grid gap-4 sm:grid-cols-3">
        {[
          ["Token", "19 warna semantik + radius, terang dan gelap, diperiksa kontrasnya."],
          ["Button", "Lima varian, tiga ukuran, enam state, siap keyboard dan pembaca layar."],
          ["Distribusi", "Satu sumber untuk paket dan item salin shadcn."],
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
