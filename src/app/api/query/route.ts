import { NextRequest, NextResponse } from "next/server";
import { queryDocuments } from "@/lib/rag";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, documentIds } = body as { query: string; documentIds?: string[] };

    if (!query || query.trim().length < 3) {
      return NextResponse.json({ error: "Query too short" }, { status: 400 });
    }

    const result = await queryDocuments(query.trim(), 8, documentIds);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Query error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
