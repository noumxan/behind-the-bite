"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/lib/cn";
import { useAppState } from "@/components/providers/AppState";
import { AdminFilterProvider, useAdminFilter } from "./AdminFilters";

const nav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/inbox", label: "Inbox" },
  { href: "/admin/content", label: "Content" },
  { href: "/admin/missions", label: "Mission insights" },
  { href: "/admin/audience", label: "Audience" },
  { href: "/admin/resources", label: "Resources" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { resetDemo, clearLocalActivity, unreadAdmin, inbox } = useAppState();
  const latest = inbox.notifications.find((item) => item.audience === "admin" && !item.readAt);
  const [open, setOpen] = useState(false);

  return (
    <AdminFilterProvider>
    <div className="min-h-screen bg-cream-dark text-ink">
      <div className="border-b border-line bg-aubergine px-4 py-3 text-cream">
        <p className="text-sm">
          Demo admin workspace — passwordless on purpose, not secure, synthetic visitors plus this
          browser’s demo activity. Changes stay on this device.
        </p>
      </div>
      <div className="flex">
        <aside className="hidden min-h-[calc(100vh-48px)] w-56 shrink-0 border-r border-line bg-paper p-4 md:block">
          <Link href="/" className="font-display text-lg text-aubergine">
            Behind the Bite
          </Link>
          <p className="mt-1 text-xs text-ink-soft">Outreach dashboard</p>
          <nav className="mt-6 grid gap-2" aria-label="Admin">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm",
                  pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
                    ? "bg-yellow text-aubergine"
                    : "hover:bg-cream",
                )}
              >
                {item.label}
                {item.href === "/admin/inbox" && unreadAdmin > 0 ? ` (${unreadAdmin})` : ""}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3 border-b border-line bg-paper px-4 py-3">
            <Dialog.Root open={open} onOpenChange={setOpen}>
              <Dialog.Trigger asChild>
                <button type="button" className="min-h-11 md:hidden" aria-label="Open admin menu">
                  <Menu />
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-aubergine/40" />
                <Dialog.Content className="fixed inset-y-0 left-0 w-64 bg-paper p-4">
                  <Dialog.Title className="font-display text-xl">Admin</Dialog.Title>
                  <nav className="mt-4 grid gap-2">
                    {nav.map((item) => (
                      <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
            <span className="rounded-full bg-yellow px-3 py-1 text-xs font-semibold text-aubergine">
              Demo mode
            </span>
            {latest ? (
              <Link href={latest.href} className="rounded-full bg-mint-soft px-3 py-1 text-xs">
                {latest.title}
              </Link>
            ) : null}
            <RangeSelect />
            <button type="button" className="text-sm underline" onClick={clearLocalActivity}>
              Clear local activity
            </button>
            <button type="button" className="text-sm underline" onClick={resetDemo}>
              Reset demo
            </button>
            <Link href="/demo" className="ml-auto text-sm underline">
              Presenter
            </Link>
          </div>
          <div className="p-4 sm:p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
    </AdminFilterProvider>
  );
}

function RangeSelect() {
  const { range, setRange } = useAdminFilter();
  return (
    <label className="text-sm">
      Date filter
      <select
        className="ml-2 min-h-10 rounded-lg border border-line bg-cream px-2"
        value={range}
        onChange={(e) => setRange(e.target.value as "all" | "7" | "30")}
      >
        <option value="all">All demo dates</option>
        <option value="7">Last 7 days</option>
        <option value="30">Last 30 days</option>
      </select>
    </label>
  );
}
