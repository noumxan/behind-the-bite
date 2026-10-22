"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DISCLAIMER } from "@/lib/content/seed";

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return (
    <footer className="mt-16 border-t border-line bg-cream-dark">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-ink-soft md:flex-row md:justify-between">
        <p className="max-w-xl">{DISCLAIMER}</p>
        <div className="flex flex-col gap-2">
          <Link href="/demo" className="underline">
            Presenter demo
          </Link>
          <Link href="/careers" className="underline">
            Career profiles
          </Link>
          <p>No account required to explore. Demo data stays in this browser.</p>
        </div>
      </div>
    </footer>
  );
}
