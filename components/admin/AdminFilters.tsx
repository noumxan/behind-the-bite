"use client";

import { createContext, useContext, useState } from "react";

type Range = "all" | "7" | "30";

const Ctx = createContext<{
  range: Range;
  setRange: (range: Range) => void;
}>({ range: "all", setRange: () => {} });

export function AdminFilterProvider({ children }: { children: React.ReactNode }) {
  const [range, setRange] = useState<Range>("all");
  return <Ctx.Provider value={{ range, setRange }}>{children}</Ctx.Provider>;
}

export function useAdminFilter() {
  return useContext(Ctx);
}
