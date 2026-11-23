export const LOCALES = ["en", "id"] as const;

export type Locale = (typeof LOCALES)[number];

export const SECTION_KEYS = [
  "preview",
  "package",
  "copy",
  "usage",
  "props",
  "dependencies",
  "accessibility",
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

type Dictionary = {
  htmlLang: string;
  siteTitle: string;
  siteTagline: string;
  componentLabel: string;
  docsNav: string;
  previewNav: string;
  languageLabel: string;
  switchTo: string;
  themeLabel: string;
  light: string;
  dark: string;
  onThisPage: string;
  sourceTitle: string;
  examplesTitle: string;
  dependenciesTitle: string;
  packageName: string;
  nativeAttributes: string;
  propColumn: string;
  typeColumn: string;
  defaultColumn: string;
  requiredColumn: string;
  descriptionColumn: string;
  registryLabel: string;
  variantsLabel: string;
  sizesLabel: string;
  matrixLabel: string;
  statesLabel: string;
  targetsLabel: string;
  notRequired: string;
  sections: Record<SectionKey, string>;
};

export const DICTIONARIES: Record<Locale, Dictionary> = {
  en: {
    htmlLang: "en",
    siteTitle: "Legion v4",
    siteTagline: "Semantic tokens, accessible components, one source of truth.",
    componentLabel: "Component",
    docsNav: "Docs",
    previewNav: "Preview",
    languageLabel: "Language",
    switchTo: "Bahasa Indonesia",
    themeLabel: "Theme",
    light: "Light",
    dark: "Dark",
    onThisPage: "On this page",
    sourceTitle: "Source",
    examplesTitle: "Examples",
    dependenciesTitle: "Dependencies",
    packageName: "Package",
    nativeAttributes: "Native button attributes are forwarded unchanged.",
    propColumn: "Prop",
    typeColumn: "Type",
    defaultColumn: "Default",
    requiredColumn: "Required",
    descriptionColumn: "Description",
    registryLabel: "Registry",
    variantsLabel: "variants",
    sizesLabel: "sizes",
    matrixLabel: "Variant and size matrix",
    statesLabel: "States",
    targetsLabel: "Icon and long label",
    notRequired: "No",
    sections: {
      preview: "Preview and variants",
      package: "Install as a package",
      copy: "Install as a copy",
      usage: "Usage",
      props: "Props",
      dependencies: "Dependencies",
      accessibility: "Accessibility",
    },
  },
  id: {
    htmlLang: "id",
    siteTitle: "Legion v4",
    siteTagline: "Token semantik, komponen aksesibel, satu sumber kebenaran.",
    componentLabel: "Komponen",
    docsNav: "Dokumentasi",
    previewNav: "Pratinjau",
    languageLabel: "Bahasa",
    switchTo: "English",
    themeLabel: "Tema",
    light: "Terang",
    dark: "Gelap",
    onThisPage: "Di halaman ini",
    sourceTitle: "Sumber",
    examplesTitle: "Contoh",
    dependenciesTitle: "Dependensi",
    packageName: "Paket",
    nativeAttributes: "Atribut native tombol diteruskan tanpa perubahan.",
    propColumn: "Prop",
    typeColumn: "Tipe",
    defaultColumn: "Default",
    requiredColumn: "Wajib",
    descriptionColumn: "Deskripsi",
    registryLabel: "Registry",
    variantsLabel: "varian",
    sizesLabel: "ukuran",
    matrixLabel: "Matriks varian dan ukuran",
    statesLabel: "State",
    targetsLabel: "Ikon dan label panjang",
    notRequired: "Tidak",
    sections: {
      preview: "Pratinjau dan varian",
      package: "Pasang sebagai paket",
      copy: "Pasang sebagai salinan",
      usage: "Pemakaian",
      props: "Props",
      dependencies: "Dependensi",
      accessibility: "Aksesibilitas",
    },
  },
};

export function docsHref(locale: Locale, slug: string): string {
  return locale === "en" ? `/docs/components/${slug}` : `/id/docs/components/${slug}`;
}

export function markdownHref(locale: Locale, slug: string): string {
  return locale === "en" ? `/docs/components/${slug}.md` : `/id/docs/components/${slug}.md`;
}
