"use client";

import Link from "next/link";
import { useAppState } from "@/components/providers/AppState";

export default function ExploreIndexPage() {
  const { cms } = useAppState();
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-4xl text-aubergine sm:text-5xl">Explore a product</h1>
      <p className="mt-4 max-w-prose text-ink-soft">
        Start with something familiar. Each map shows what happens on a line, what an engineer
        might investigate, and a related mission.
      </p>
      <ul className="mt-8 grid gap-4">
        {cms.products.map((product) => (
          <li key={product.id}>
            <Link
              href={`/explore/${product.id}`}
              className="block rounded-3xl border border-line bg-paper p-6 hover:shadow-md"
            >
              <h2 className="text-2xl">{product.name}</h2>
              <p className="mt-2 text-ink-soft">{product.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
