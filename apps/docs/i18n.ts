export const locales = ["en", "id"] as const;

export type Locale = (typeof locales)[number];

export const dictionary = {
  en: {
    docs: "Docs",
    components: "Components",
    button: "Button",
    preview: "Preview and variants",
    installPackage: "Install as package",
    installCopy: "Install as copy",
    usage: "Usage",
    props: "Props",
    dependencies: "Dependencies",
    accessibility: "Accessibility",
    source: "Source",
    language: "Bahasa Indonesia",
    light: "Light",
    dark: "Dark",
    system: "System",
    toggleTheme: "Toggle theme",
    componentIntro:
      "A token-driven action control with five variants, three sizes, and six states.",
    packageCommand: "pnpm add @legionv4/ui",
    copyCommand: "npx shadcn@latest add http://localhost:3000/r/button.json",
    accessibilityIntro:
      "Button targets WCAG 2.2 AA. The automated axe suite and the manual checklist cover keyboard, focus, target size, contrast, loading announcements, zoom, and reduced motion.",
  },
  id: {
    docs: "Dokumentasi",
    components: "Komponen",
    button: "Button",
    preview: "Pratinjau dan varian",
    installPackage: "Pasang sebagai paket",
    installCopy: "Pasang sebagai salinan",
    usage: "Pemakaian",
    props: "Props",
    dependencies: "Dependensi",
    accessibility: "Aksesibilitas",
    source: "Sumber",
    language: "English",
    light: "Terang",
    dark: "Gelap",
    system: "Sistem",
    toggleTheme: "Ganti tema",
    componentIntro:
      "Kontrol aksi berbasis token dengan lima varian, tiga ukuran, dan enam state.",
    packageCommand: "pnpm add @legionv4/ui",
    copyCommand: "npx shadcn@latest add http://localhost:3000/r/button.json",
    accessibilityIntro:
      "Button menargetkan WCAG 2.2 AA. Suite axe otomatis dan daftar periksa manual mencakup keyboard, fokus, ukuran target, kontras, pengumuman loading, zoom, dan kurangi gerakan.",
  },
} satisfies Record<Locale, Record<string, string>>;

export function docsPath(locale: Locale, slug: string): string {
  return locale === "en" ? `/docs/components/${slug}` : `/id/docs/components/${slug}`;
}
