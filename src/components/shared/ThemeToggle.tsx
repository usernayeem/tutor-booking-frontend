"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Toggle theme"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Sun className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </button>

      {open && (
        <>
          {/* backdrop to close on outside click */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 z-50 mt-1 w-36 rounded-md border border-border bg-popover p-1 shadow-md">
            {(["light", "dark", "system"] as const).map((t) => (
              <button
                key={t}
                type="button"
                className={`w-full rounded-sm px-3 py-1.5 text-left text-sm capitalize transition-colors hover:bg-muted ${theme === t ? "text-primary font-medium" : "text-foreground"}`}
                onClick={() => { setTheme(t); setOpen(false); }}
              >
                {t}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
