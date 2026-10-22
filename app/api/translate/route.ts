import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  text: z.string().min(1).max(2000),
  from: z.string().min(2).max(8),
  to: z.string().min(2).max(8),
  consent: z.literal(true),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid translation request." }, { status: 400 });
  }
  const key = process.env.TRANSLATE_API_KEY;
  if (!key) {
    return NextResponse.json({
      status: "unavailable",
      message: "Live translation is not configured. Your original message is available.",
    });
  }
  return NextResponse.json({
    status: "unavailable",
    message: "A translation provider is named but not wired in this prototype.",
  });
}
