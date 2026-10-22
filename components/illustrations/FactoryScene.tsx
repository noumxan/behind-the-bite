"use client";

import type { Station } from "@/lib/content/types";
import { cn } from "@/lib/cn";

const layout: Record<string, { x: number; y: number }> = {
  mixing: { x: 24, y: 70 },
  thermal: { x: 118, y: 36 },
  automation: { x: 210, y: 70 },
  quality: { x: 300, y: 36 },
  packaging: { x: 390, y: 70 },
};

export function FactoryScene({
  stations,
  selected,
  onSelect,
  reduced,
}: {
  stations: Station[];
  selected: string;
  onSelect: (id: Station["id"]) => void;
  reduced: boolean;
}) {
  return (
    <svg viewBox="0 0 520 210" className="w-full" role="img" aria-label="Factory stations">
      <rect x="8" y="8" width="504" height="194" rx="18" fill="#fffbf4" stroke="#5b3426" strokeWidth="0.6" />
      <path
        d="M48 110 C 120 110, 140 76, 200 76 S 280 110, 340 76 S 430 110, 470 110"
        fill="none"
        stroke="#3b1238"
        strokeWidth="2"
        strokeDasharray="6 6"
      />
      <rect x="30" y="128" width="460" height="14" rx="7" fill="#3b1238" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <rect
          key={i}
          x={40 + i * 48}
          y="132"
          width="22"
          height="6"
          fill="#f2c014"
          className={reduced ? undefined : "animate-conveyor"}
        />
      ))}
      {stations.map((station) => {
        const pos = layout[station.id] ?? { x: 40, y: 70 };
        const isOn = selected === station.id;
        return (
          <g key={station.id}>
            <circle
              cx={pos.x + 36}
              cy={pos.y + 28}
              r="28"
              fill={isOn ? "#f2c014" : "#f6f0e4"}
              stroke="#3b1238"
              strokeWidth="1.5"
            />
            <foreignObject x={pos.x} y={pos.y + 58} width="84" height="40">
              <button
                type="button"
                onClick={() => onSelect(station.id)}
                className={cn(
                  "w-full rounded-md px-1 py-1 text-[11px] leading-tight text-aubergine underline-offset-2",
                  isOn && "font-semibold",
                )}
              >
                {station.title}
              </button>
            </foreignObject>
          </g>
        );
      })}
    </svg>
  );
}
