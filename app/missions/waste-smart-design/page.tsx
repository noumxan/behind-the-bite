"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useAppState } from "@/components/providers/AppState";
import { PACK_OPTIONS, comparePacks } from "@/lib/simulation/packaging-options";

export default function WasteSmartPage() {
  const { track } = useAppState();
  const [selected, setSelected] = useState("balanced");
  const comparison = comparePacks(selected);

  useEffect(() => {
    track("mission_start", { mission: "waste-smart-design" });
  }, [track]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-4xl text-aubergine">Waste-Smart Design</h1>
      <p className="mt-4 max-w-prose">
        Compare three fictional packaging configurations. There is no universal winner. Actual
        decisions need validated materials and product data.
      </p>
      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[40rem] text-sm">
          <thead>
            <tr className="text-left border-b border-line">
              <th className="py-2">Option</th>
              <th>Material (g)</th>
              <th>Protection</th>
              <th>Recyclability note</th>
              <th>Illustrative cost</th>
            </tr>
          </thead>
          <tbody>
            {PACK_OPTIONS.map((option) => (
              <tr key={option.id} className="border-b border-line">
                <td className="py-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="pack"
                      checked={selected === option.id}
                      onChange={() => setSelected(option.id)}
                    />
                    {option.name}
                  </label>
                </td>
                <td className="mono">{option.materialGrams.toFixed(1)}</td>
                <td className="mono">{Math.round(option.protection * 100)}%</td>
                <td>{option.recyclability}</td>
                <td className="mono">£{option.illustrativeCost.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-6">{comparison.selected.notes}</p>
      <p className="mt-2">{comparison.tradeoff}</p>
      <Button
        className="mt-6"
        onClick={() => track("mission_complete", { mission: "waste-smart-design" })}
      >
        Save this comparison
      </Button>
      <div className="mt-4">
        <Button href="/careers/packaging" variant="ghost">
          Packaging engineer profile
        </Button>
      </div>
    </div>
  );
}
