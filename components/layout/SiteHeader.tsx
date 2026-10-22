"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Pause, Play } from "lucide-react";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/lib/cn";
import { useAppState } from "@/components/providers/AppState";

const links = [
  { href: "/explore", label: "Explore" },
  { href: "/missions", label: "Try a shift" },
  { href: "/find-your-route", label: "Find your route" },
  { href: "/next-steps", label: "My next steps" },
  { href: "/profile", label: "My Bite" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { pauseMotion, setPauseMotion, reducedMotion, unreadUser, openComposer } = useAppState();
  const [open, setOpen] = useState(false);
  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="border-b border-line bg-paper/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="font-display text-xl text-aubergine">
          Behind the Bite
        </Link>
        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm text-ink-soft hover:text-aubergine",
                pathname.startsWith(link.href) && "text-aubergine font-semibold",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="hidden min-h-10 items-center gap-1 rounded-full border border-line px-3 text-xs text-ink-soft sm:inline-flex"
            onClick={() => setPauseMotion(!pauseMotion)}
            aria-pressed={pauseMotion || reducedMotion}
          >
            {pauseMotion || reducedMotion ? <Play size={14} /> : <Pause size={14} />}
            {pauseMotion || reducedMotion ? "Play motion" : "Pause motion"}
          </button>
          <button
            type="button"
            className="hidden min-h-10 rounded-full border border-line px-3 text-xs md:inline"
            onClick={() => openComposer(null)}
          >
            Ask the team
          </button>
          {unreadUser > 0 ? (
            <Link href="/profile/messages" className="text-xs text-mint">
              {unreadUser} new
            </Link>
          ) : null}
          <Link href="/admin" className="hidden text-xs text-cocoa-soft underline md:inline">
            Employer demo
          </Link>
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <button type="button" className="inline-flex min-h-11 min-w-11 items-center justify-center md:hidden" aria-label="Open menu">
                <Menu />
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-aubergine-deep/40" />
              <Dialog.Content className="fixed inset-y-0 right-0 w-[min(100%,20rem)] bg-paper p-6 shadow-xl">
                <Dialog.Title className="font-display text-2xl">Menu</Dialog.Title>
                <nav className="mt-6 grid gap-4">
                  {links.map((link) => (
                    <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="text-lg">
                      {link.label}
                    </Link>
                  ))}
                  <button type="button" className="text-left" onClick={() => { setOpen(false); openComposer(null); }}>
                    Ask the team
                  </button>
                  <Link href="/admin" onClick={() => setOpen(false)} className="text-sm text-cocoa-soft">
                    Employer demo
                  </Link>
                </nav>
                <Dialog.Close className="mt-8 text-sm underline">Close</Dialog.Close>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
