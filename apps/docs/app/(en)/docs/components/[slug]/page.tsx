import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ComponentDocsPage } from "@/components/component-docs-page";

export const metadata: Metadata = {
  title: "Button",
  description: "Token-driven Button with five variants, three sizes, and accessible states.",
  alternates: {
    canonical: "/docs/components/button",
    languages: {
      en: "/docs/components/button",
      id: "/id/docs/components/button",
    },
  },
};

export function generateStaticParams() {
  return [{ slug: "button" }];
}

export default async function EnglishComponentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (slug !== "button") notFound();
  return <ComponentDocsPage locale="en" />;
}
