"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { cn } from "@legionv4/ui";

type ModeToggleProps = {
  label: string;
  lightLabel: string;
  darkLabel: string;
};

export function ModeToggle({ label, lightLabel, darkLabel }: ModeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const dark = mounted && resolvedTheme === "dark";
  const visible = dark ? darkLabel : lightLabel;

  return (
    <button
      type="button"
      aria-label={`${label}: ${visible}`}
      title={label}
      data-testid="mode-toggle"
      data-theme-state={dark ? "dark" : "light"}
      onClick={() => setTheme(dark ? "light" : "dark")}
      className={cn(
        "inline-flex min-h-9 items-center gap-2 rounded-md border border-input bg-background px-3 text-sm text-foreground",
        "hover:bg-accent hover:text-accent-foreground",
      )}
    >
      {dark ? <Moon aria-hidden="true" className="size-4" /> : <Sun aria-hidden="true" className="size-4" />}
      <span>{visible}</span>
    </button>
  );
}
