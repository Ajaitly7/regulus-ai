import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";
import { queryDocuments } from "@/lib/rag";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const AUDIENCE_INSTRUCTIONS: Record<string, string> = {
  executive:
    "Write for a C-suite executive. Lead with business impact and risk exposure. Keep technical details minimal. Focus on decisions that need to be made.",
  legal:
    "Write for in-house legal counsel. Include specific statutory references, enforcement risk, liability exposure, and regulatory citations. Be precise.",
  ops: "Write for a custody operations team. Focus on workflow changes, system requirements, procedural updates, and operational deadlines. Be actionable.",
  board:
    "Write for a board of directors. Emphasize fiduciary risk, regulatory exposure, and strategic implications. Use plain language with clear risk framing.",
  client:
    "Write for an institutional client. Explain how regulatory changes affect their custody arrangement, what actions they need to take, and what Fireblocks Trust is doing to ensure compliance.",
};

const TONE_INSTRUCTIONS: Record<string, string> = {
  formal: "Use formal, professional language appropriate for regulatory filings or board presentations.",
  concise: "Be extremely concise. Bullet points preferred. Maximum 400 words total.",
  technical:
    "Use precise technical and legal terminology. Include regulatory citations and specific compliance thresholds.",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      documentId,
      query,
      audience = "ops",
      tone = "formal",
    } = body as {
      documentId?: string;
      query?: string;
      audience?: string;
      tone?: string;
    };

    let context = "";
    let docTitle = "";
    let riskScore: number | null = null;

    if (documentId) {
      const doc = await prisma.document.findUnique({
        where: { id: documentId },
        include: { analyses: { orderBy: { createdAt: "desc" }, take: 1 } },
      });
      if (!doc) return NextResponse.json({ error: "Document not found" }, { status: 404 });
      context = doc.rawText.slice(0, 5000);
      docTitle = doc.title;
      riskScore = doc.analyses[0]?.riskScore ?? null;
    } else if (query) {
      const ragResult = await queryDocuments(query);
      context = ragResult.sources.map((s) => s.chunkText).join("\n\n");
      docTitle = `Query: "${query}"`;
    } else {
      return NextResponse.json({ error: "Provide documentId or query" }, { status: 400 });
    }

    const systemPrompt = `You are a senior regulatory intelligence analyst at Fireblocks Trust Company, a NYDFS-regulated qualified digital asset custodian.
You generate compliance briefs from regulatory documents.
${AUDIENCE_INSTRUCTIONS[audience] ?? AUDIENCE_INSTRUCTIONS.ops}
${TONE_INSTRUCTIONS[tone] ?? TONE_INSTRUCTIONS.formal}`;

    const userPrompt = `Generate a compliance brief for the following regulatory content.

DOCUMENT: ${docTitle}
${riskScore !== null ? `RISK SCORE: ${riskScore}/100` : ""}

CONTENT:
${context}

Structure the brief with these sections:
## Summary
## Why This Matters
## Key Obligations
## Compliance Deadline
## Recommended Actions
## Affected Teams

Generate the brief now:`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      messages: [{ role: "user", content: userPrompt }],
      system: systemPrompt,
    });

    const content = response.content[0].type === "text" ? response.content[0].text : "";

    const brief = await prisma.brief.create({
      data: {
        documentId: documentId ?? null,
        query: query ?? null,
        audience,
        tone,
        content,
        riskScore,
      },
    });

    return NextResponse.json({ briefId: brief.id, content, riskScore });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Brief generation error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
