import type { Metadata } from "next";
import { ComponentDocsPage } from "@/components/component-docs-page";

export const metadata: Metadata = {
  title: "Button · Legion v4",
  alternates: {
    languages: {
      en: "/docs/components/button",
      id: "/id/docs/components/button",
    },
  },
};

export default function ButtonPage() {
  return <ComponentDocsPage locale="id" slug="button" />;
}
