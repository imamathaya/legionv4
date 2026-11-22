import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ComponentDocsPage } from "@/components/component-docs-page";

export const metadata: Metadata = {
  title: "Button",
  description: "Button berbasis token dengan lima varian, tiga ukuran, dan state aksesibel.",
  alternates: {
    canonical: "/id/docs/components/button",
    languages: {
      en: "/docs/components/button",
      id: "/id/docs/components/button",
    },
  },
};

export function generateStaticParams() {
  return [{ slug: "button" }];
}

export default async function IndonesianComponentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (slug !== "button") notFound();
  return <ComponentDocsPage locale="id" />;
}
