import { NextRequest, NextResponse } from "next/server";
import { retrieveContext } from "@/lib/rag";
import { z } from "zod";

const schema = z.object({
  query: z.string().min(1).max(500),
  topK: z.number().int().min(1).max(10).optional(),
  filter: z
    .object({
      level: z.string().optional(),
      grade: z.string().optional(),
      area: z.string().optional(),
    })
    .optional(),
});

export async function POST(req: NextRequest) {
  const expectedKey = process.env.SOCRATES_API_KEY;
  if (!expectedKey) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${expectedKey}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { query, topK = 5, filter } = parsed.data;
  const { sources } = await retrieveContext(query, topK, filter);

  return NextResponse.json({ sources });
}
