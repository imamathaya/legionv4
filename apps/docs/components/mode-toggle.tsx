"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ModeToggle({ label, lightLabel, darkLabel }: { label: string; lightLabel: string; darkLabel: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={`${label}: ${isDark ? lightLabel : darkLabel}`}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex min-h-9 items-center gap-2 rounded-md border border-input bg-background px-3 text-sm text-foreground"
    >
      {isDark ? <Sun aria-hidden="true" className="size-4" /> : <Moon aria-hidden="true" className="size-4" />}
      <span>{isDark ? lightLabel : darkLabel}</span>
    </button>
  );
}
