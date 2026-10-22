import { DEMO_BANNER } from "@/lib/content/seed";

export function DemoBanner({ extra }: { extra?: string }) {
  return (
    <p className="border-b border-line bg-aubergine text-cream px-4 py-2 text-center text-xs sm:text-sm">
      {DEMO_BANNER}
      {extra ? ` ${extra}` : ""}
    </p>
  );
}
