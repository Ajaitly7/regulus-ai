import { prisma } from "./prisma";
import { embedText } from "./embeddings";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface RAGResult {
  answer: string;
  sources: Array<{
    documentId: string;
    documentTitle: string;
    chunkText: string;
    similarity: number;
  }>;
  confidence: number;
}

export async function queryDocuments(
  query: string,
  topK = 8,
  documentIds?: string[]
): Promise<RAGResult> {
  const queryEmbedding = await embedText(query);
  const vectorStr = `[${queryEmbedding.join(",")}]`;

  let similarChunks: Array<{ id: string; documentId: string; text: string; similarity: number }>;

  if (documentIds && documentIds.length > 0) {
    similarChunks = await prisma.$queryRaw<typeof similarChunks>`
      SELECT
        dc.id,
        dc."documentId",
        dc.text,
        1 - (dc.embedding <=> ${vectorStr}::vector) as similarity
      FROM "DocumentChunk" dc
      WHERE dc."documentId" = ANY(${documentIds}::text[])
      ORDER BY dc.embedding <=> ${vectorStr}::vector
      LIMIT ${topK}
    `;
  } else {
    similarChunks = await prisma.$queryRaw<typeof similarChunks>`
      SELECT
        dc.id,
        dc."documentId",
        dc.text,
        1 - (dc.embedding <=> ${vectorStr}::vector) as similarity
      FROM "DocumentChunk" dc
      ORDER BY dc.embedding <=> ${vectorStr}::vector
      LIMIT ${topK}
    `;
  }

  if (similarChunks.length === 0) {
    return {
      answer: "No relevant documents found. Please upload regulatory documents first.",
      sources: [],
      confidence: 0,
    };
  }

  const docIds = [...new Set(similarChunks.map((c) => c.documentId))];
  const documents = await prisma.document.findMany({
    where: { id: { in: docIds } },
    select: { id: true, title: true, source: true, jurisdiction: true },
  });
  const docMap = Object.fromEntries(documents.map((d: { id: string; title: string; source: string; jurisdiction: string }) => [d.id, d]));

  const context = similarChunks
    .map((chunk, i) => {
      const doc = docMap[chunk.documentId];
      return `[SOURCE ${i + 1}: ${doc?.title} — ${doc?.source}, ${doc?.jurisdiction}]\n${chunk.text}`;
    })
    .join("\n\n---\n\n");

  const systemPrompt = `You are a regulatory intelligence analyst specializing in digital asset custody compliance.
You work for Fireblocks Trust Company, a NYDFS-regulated qualified custodian.
Your job is to answer compliance questions accurately based only on the provided regulatory document excerpts.
Be precise, cite specific obligations, and flag anything with direct custody operations impact.
Format your answer in clear sections. If something is unclear or not covered, say so explicitly.`;

  const userPrompt = `Based on the following regulatory document excerpts, answer this question:

QUESTION: ${query}

REGULATORY CONTEXT:
${context}

Provide a structured answer with:
1. Direct answer to the question
2. Specific obligations or requirements identified
3. Impact on custody operations (if applicable)
4. Recommended actions
5. Confidence level (High/Medium/Low) based on how directly the sources address the question`;

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 1500,
    messages: [{ role: "user", content: userPrompt }],
    system: systemPrompt,
  });

  const answer = response.content[0].type === "text" ? response.content[0].text : "";

  const confidenceMatch = answer.match(/confidence[:\s]+(high|medium|low)/i);
  const confidence =
    confidenceMatch?.[1]?.toLowerCase() === "high"
      ? 0.9
      : confidenceMatch?.[1]?.toLowerCase() === "medium"
      ? 0.65
      : 0.4;

  await prisma.queryLog.create({
    data: { query, answer, sourceDocs: docIds, confidence },
  });

  return {
    answer,
    sources: similarChunks.map((chunk) => ({
      documentId: chunk.documentId,
      documentTitle: docMap[chunk.documentId]?.title ?? "Unknown",
      chunkText: chunk.text,
      similarity: Number(chunk.similarity),
    })),
    confidence,
  };
}
