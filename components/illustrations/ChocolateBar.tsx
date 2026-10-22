"use client";

import { cn } from "@/lib/cn";

const stages = ["Automation", "Mechanical", "Engineering", "Packaging", "Software"];

export function ChocolateBar({
  reduced,
  exploded,
}: {
  reduced: boolean;
  exploded: boolean;
}) {
  return (
    <div className="w-full max-w-xl">
      <div
        className={cn(
          "grid grid-cols-5 items-end",
          exploded ? "gap-3 sm:gap-5" : "gap-1",
        )}
        role="img"
        aria-label="Chocolate bar opening into Automation, Mechanical, Engineering, Packaging and Software"
      >
        {stages.map((label) => (
          <div key={label} className="flex min-w-0 flex-col items-center">
            <p
              className={cn(
                "mb-2 h-8 w-full px-0.5 text-center font-mono text-[10px] leading-tight text-aubergine sm:text-[11px]",
                exploded ? "opacity-100" : "opacity-0",
                !reduced && "transition-opacity duration-300",
              )}
            >
              {label}
            </p>
            <div
              className="h-16 w-full max-w-[4.5rem] rounded-lg border border-aubergine bg-cocoa sm:h-[4.25rem]"
              style={{
                backgroundImage:
                  "linear-gradient(#f2c014, #f2c014), linear-gradient(#8a5a42, #8a5a42)",
                backgroundSize: "1px 100%, 100% 1px",
                backgroundPosition: "center, 0 38%",
                backgroundRepeat: "no-repeat",
              }}
            />
          </div>
        ))}
      </div>
      <div className="relative mt-4 h-3 overflow-hidden rounded-full bg-cocoa">
        <div
          className={cn(
            "absolute inset-y-0.5 left-0 flex gap-8 px-3",
            reduced ? undefined : "animate-conveyor",
          )}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="h-2 w-6 shrink-0 rounded-sm bg-yellow" />
          ))}
        </div>
      </div>
    </div>
  );
}
