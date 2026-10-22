"use client";

import Link from "next/link";
import { useAppState } from "@/components/providers/AppState";
import { publishedOnly } from "@/lib/content/repository";

export default function CareersPage() {
  const { cms } = useAppState();
  const careers = publishedOnly(cms.careers);
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-4xl text-aubergine sm:text-5xl">Career explorer</h1>
      <p className="mt-4 max-w-prose text-ink-soft">
        Six illustrative roles in food manufacturing engineering. These are not live vacancies and
        do not include salaries or official requirements.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {careers.map((career) => (
          <Link
            key={career.id}
            href={`/careers/${career.id}`}
            className="rounded-3xl border border-line bg-paper p-6 hover:shadow-md"
          >
            <h2 className="text-2xl">{career.title}</h2>
            <p className="mt-2 text-ink-soft">{career.purpose}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
