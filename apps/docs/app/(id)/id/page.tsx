import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export default function HomePage() {
  return (
    <>
      <SiteHeader locale="id" />
      <main className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Legion v4</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Design system React berbasis token. Mulai dari komponen referensi Button.
        </p>
        <Link
          className="mt-6 inline-flex min-h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
          href="/id/docs/components/button"
        >
          Buka dokumentasi Button
        </Link>
      </main>
    </>
  );
}
