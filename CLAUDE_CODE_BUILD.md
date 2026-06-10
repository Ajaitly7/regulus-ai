# Regulus AI — Claude Code Build Instructions
## RAG Pipeline · Database Layer · Custody Analysis Engine

You are building **Regulus AI v2**: a production-grade regulatory intelligence platform with a real RAG (Retrieval-Augmented Generation) pipeline, a PostgreSQL + pgvector database, and a custody analysis engine purpose-built for institutional digital asset compliance.

The existing codebase is a Next.js 14 (App Router) frontend with TypeScript, Tailwind CSS, and static mock data. Your job is to replace the mock data layer with a real backend, add a RAG pipeline for document ingestion and querying, and build out the custody analysis module.

The platform's primary use case is: **a compliance team at a regulated digital asset custodian (like Fireblocks Trust Company) uploads regulatory documents (NYDFS guidance, SEC bulletins, OCC letters, FinCEN rules) and can instantly query them, get risk scores, generate compliance briefs, and analyze how new rules affect their custody operations.**

---

## Tech Stack — Do Not Deviate

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 14 (App Router) | Already in use |
| Language | TypeScript (strict) | Already in use |
| Database | PostgreSQL + pgvector | Vector similarity search for RAG |
| ORM | Prisma | Type-safe DB access |
| Embeddings | OpenAI `text-embedding-3-small` | Cost-efficient, high quality |
| LLM | Anthropic Claude claude-haiku-4-5 | Fast, cheap for RAG synthesis; Claude Sonnet for complex analysis |
| Document parsing | `pdf-parse` + `mammoth` (for .docx) | Handle regulatory PDFs and Word docs |
| File uploads | Next.js API routes + local `/uploads` folder | Keep it simple, no S3 needed |
| Auth | None for now — single-user demo mode | Interview demo |
| Styling | Tailwind CSS | Already in use |

---

## Phase 1 — Database Setup

### 1.1 Install dependencies

```bash
npm install prisma @prisma/client pg pgvector openai @anthropic-ai/sdk pdf-parse mammoth multer @types/multer @types/pdf-parse uuid @types/uuid
npm install -D prisma
npx prisma init
```

### 1.2 Environment variables

Create `.env.local` with:

```
DATABASE_URL="postgresql://postgres:password@localhost:5432/regulus_ai"
OPENAI_API_KEY="your-openai-key"
ANTHROPIC_API_KEY="your-anthropic-key"
```

Also update `prisma/.env` with the same `DATABASE_URL`.

### 1.3 Prisma schema

Create `prisma/schema.prisma` with the following complete schema:

```prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

datasource db {
  provider   = "postgresql"
  url        = env("DATABASE_URL")
  extensions = [pgvector(map: "vector")]
}

// A regulatory document uploaded by the user
model Document {
  id          String   @id @default(uuid())
  title       String
  source      String   // e.g. "NYDFS", "SEC", "OCC", "FinCEN"
  jurisdiction String  // e.g. "New York (US)", "Federal (US)", "EU"
  category    String   // e.g. "Digital Asset Custody", "AML / BSA"
  fileType    String   // "pdf" | "docx" | "txt"
  filePath    String   // local path to uploaded file
  rawText     String   // full extracted text
  pageCount   Int?
  publishedAt DateTime?
  uploadedAt  DateTime @default(now())
  updatedAt   DateTime @updatedAt

  chunks      DocumentChunk[]
  analyses    CustodyAnalysis[]
  briefs      Brief[]
}

// A chunk of a document — the unit of RAG retrieval
model DocumentChunk {
  id         String                      @id @default(uuid())
  documentId String
  document   Document                    @relation(fields: [documentId], references: [id], onDelete: Cascade)
  chunkIndex Int
  text       String
  embedding  Unsupported("vector(1536)")? // OpenAI text-embedding-3-small = 1536 dims
  createdAt  DateTime                    @default(now())

  @@index([documentId])
}

// A custody analysis run against a document
model CustodyAnalysis {
  id              String   @id @default(uuid())
  documentId      String
  document        Document @relation(fields: [documentId], references: [id], onDelete: Cascade)
  riskScore       Int      // 0-100
  riskLevel       String   // "HIGH" | "MEDIUM" | "LOW"
  affectedAssets  String[] // e.g. ["BTC", "ETH", "SOL"]
  keyObligations  String[]
  custodyImpact   String   // narrative paragraph
  regulatorBody   String   // "NYDFS" | "SEC" | "OCC" | etc.
  complianceDeadline String?
  recommendedActions String[]
  nydfsRelevance  Boolean  @default(false)
  stakingImpact   Boolean  @default(false)
  createdAt       DateTime @default(now())
}

// A generated brief
model Brief {
  id           String   @id @default(uuid())
  documentId   String?
  document     Document? @relation(fields: [documentId], references: [id], onDelete: SetNull)
  query        String?  // if brief was generated from a RAG query
  audience     String   // "legal" | "executive" | "ops" | "board" | "client"
  tone         String   // "formal" | "concise" | "technical"
  content      String   // full markdown brief
  riskScore    Int?
  createdAt    DateTime @default(now())
}

// A RAG query log — every query run against the document corpus
model QueryLog {
  id           String   @id @default(uuid())
  query        String
  answer       String
  sourceDocs   String[] // document IDs used as context
  confidence   Float?
  createdAt    DateTime @default(now())
}
```

### 1.4 Enable pgvector and run migrations

```bash
# First, enable pgvector in your PostgreSQL instance:
# psql -U postgres -c "CREATE EXTENSION IF NOT EXISTS vector;"

npx prisma migrate dev --name init
npx prisma generate
```

### 1.5 Create the Prisma client singleton

Create `src/lib/prisma.ts`:

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

---

## Phase 2 — Document Ingestion Pipeline

### 2.1 Text extraction utilities

Create `src/lib/extraction.ts`:

```typescript
import fs from "fs";
import path from "path";

export async function extractText(filePath: string, fileType: string): Promise<string> {
  if (fileType === "pdf") {
    const pdfParse = (await import("pdf-parse")).default;
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    return data.text;
  }

  if (fileType === "docx") {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  if (fileType === "txt") {
    return fs.readFileSync(filePath, "utf-8");
  }

  throw new Error(`Unsupported file type: ${fileType}`);
}

export function chunkText(text: string, chunkSize = 800, overlap = 150): string[] {
  const chunks: string[] = [];
  const sentences = text.split(/(?<=[.!?])\s+/);
  let current = "";

  for (const sentence of sentences) {
    if ((current + " " + sentence).length > chunkSize && current.length > 0) {
      chunks.push(current.trim());
      // keep last `overlap` characters as context for next chunk
      current = current.slice(-overlap) + " " + sentence;
    } else {
      current = current ? current + " " + sentence : sentence;
    }
  }

  if (current.trim()) chunks.push(current.trim());
  return chunks.filter((c) => c.length > 50); // drop tiny fragments
}
```

### 2.2 Embeddings utility

Create `src/lib/embeddings.ts`:

```typescript
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function embedText(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text.slice(0, 8000), // max token safety
  });
  return response.data[0].embedding;
}

export async function embedBatch(texts: string[]): Promise<number[][]> {
  // Batch in groups of 20 to avoid rate limits
  const results: number[][] = [];
  for (let i = 0; i < texts.length; i += 20) {
    const batch = texts.slice(i, i + 20);
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: batch.map((t) => t.slice(0, 8000)),
    });
    results.push(...response.data.map((d) => d.embedding));
    if (i + 20 < texts.length) await new Promise((r) => setTimeout(r, 200)); // rate limit
  }
  return results;
}
```

### 2.3 Document upload API route

Create `src/app/api/documents/upload/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/prisma";
import { extractText, chunkText } from "@/lib/extraction";
import { embedBatch } from "@/lib/embeddings";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const source = formData.get("source") as string;
    const jurisdiction = formData.get("jurisdiction") as string;
    const category = formData.get("category") as string;
    const publishedAt = formData.get("publishedAt") as string | null;

    if (!file || !title || !source || !jurisdiction || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Determine file type
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["pdf", "docx", "txt"].includes(ext || "")) {
      return NextResponse.json({ error: "Only PDF, DOCX, and TXT files supported" }, { status: 400 });
    }

    // Save file to disk
    const uploadsDir = path.join(process.cwd(), "uploads");
    await mkdir(uploadsDir, { recursive: true });
    const fileName = `${uuidv4()}.${ext}`;
    const filePath = path.join(uploadsDir, fileName);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    // Extract text
    const rawText = await extractText(filePath, ext!);

    // Create document record
    const document = await prisma.document.create({
      data: {
        title,
        source,
        jurisdiction,
        category,
        fileType: ext!,
        filePath,
        rawText,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
      },
    });

    // Chunk the text
    const chunks = chunkText(rawText);

    // Embed all chunks
    const embeddings = await embedBatch(chunks);

    // Store chunks with embeddings using raw SQL for pgvector
    for (let i = 0; i < chunks.length; i++) {
      const embedding = embeddings[i];
      const vectorStr = `[${embedding.join(",")}]`;
      await prisma.$executeRaw`
        INSERT INTO "DocumentChunk" (id, "documentId", "chunkIndex", text, embedding, "createdAt")
        VALUES (${uuidv4()}, ${document.id}, ${i}, ${chunks[i]}, ${vectorStr}::vector, NOW())
      `;
    }

    return NextResponse.json({
      success: true,
      documentId: document.id,
      chunkCount: chunks.length,
      message: `Document ingested: ${chunks.length} chunks embedded`,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

### 2.4 Documents list API

Create `src/app/api/documents/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const documents = await prisma.document.findMany({
    orderBy: { uploadedAt: "desc" },
    include: {
      _count: { select: { chunks: true } },
      analyses: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
  return NextResponse.json(documents);
}
```

---

## Phase 3 — RAG Query Engine

### 3.1 Vector similarity search

Create `src/lib/rag.ts`:

```typescript
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
  documentIds?: string[] // optionally scope to specific docs
): Promise<RAGResult> {
  // 1. Embed the query
  const queryEmbedding = await embedText(query);
  const vectorStr = `[${queryEmbedding.join(",")}]`;

  // 2. Find top-K similar chunks via pgvector cosine similarity
  const similarChunks = await prisma.$queryRaw<
    Array<{
      id: string;
      documentId: string;
      text: string;
      similarity: number;
    }>
  >`
    SELECT 
      dc.id,
      dc."documentId",
      dc.text,
      1 - (dc.embedding <=> ${vectorStr}::vector) as similarity
    FROM "DocumentChunk" dc
    ${documentIds && documentIds.length > 0
      ? prisma.$queryRaw`WHERE dc."documentId" = ANY(${documentIds}::text[])`
      : prisma.$queryRaw``
    }
    ORDER BY dc.embedding <=> ${vectorStr}::vector
    LIMIT ${topK}
  `;

  if (similarChunks.length === 0) {
    return {
      answer: "No relevant documents found. Please upload regulatory documents first.",
      sources: [],
      confidence: 0,
    };
  }

  // 3. Fetch document titles for context
  const docIds = [...new Set(similarChunks.map((c) => c.documentId))];
  const documents = await prisma.document.findMany({
    where: { id: { in: docIds } },
    select: { id: true, title: true, source: true, jurisdiction: true },
  });
  const docMap = Object.fromEntries(documents.map((d) => [d.id, d]));

  // 4. Build context string for LLM
  const context = similarChunks
    .map((chunk, i) => {
      const doc = docMap[chunk.documentId];
      return `[SOURCE ${i + 1}: ${doc?.title} — ${doc?.source}, ${doc?.jurisdiction}]\n${chunk.text}`;
    })
    .join("\n\n---\n\n");

  // 5. Synthesize answer with Claude
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

  // Extract confidence from answer text
  const confidenceMatch = answer.match(/confidence[:\s]+(high|medium|low)/i);
  const confidence =
    confidenceMatch?.[1]?.toLowerCase() === "high"
      ? 0.9
      : confidenceMatch?.[1]?.toLowerCase() === "medium"
      ? 0.65
      : 0.4;

  // Log query
  await prisma.queryLog.create({
    data: {
      query,
      answer,
      sourceDocs: docIds,
      confidence,
    },
  });

  return {
    answer,
    sources: similarChunks.map((chunk) => ({
      documentId: chunk.documentId,
      documentTitle: docMap[chunk.documentId]?.title ?? "Unknown",
      chunkText: chunk.text,
      similarity: chunk.similarity,
    })),
    confidence,
  };
}
```

### 3.2 RAG query API route

Create `src/app/api/query/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { queryDocuments } from "@/lib/rag";

export async function POST(req: NextRequest) {
  try {
    const { query, documentIds } = await req.json();
    if (!query || query.trim().length < 3) {
      return NextResponse.json({ error: "Query too short" }, { status: 400 });
    }
    const result = await queryDocuments(query.trim(), 8, documentIds);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Query error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

---

## Phase 4 — Custody Analysis Engine

This is the highest-value feature for the Fireblocks interview. When a regulatory document is uploaded, the system automatically runs a custody analysis that extracts: which digital assets are affected, what the NYDFS/custody impact is, what the compliance deadline is, and what operations actions are needed.

### 4.1 Custody analysis logic

Create `src/lib/custodyAnalysis.ts`:

```typescript
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "./prisma";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const KNOWN_ASSETS = ["BTC", "ETH", "SOL", "USDC", "USDT", "DOT", "AVAX", "LINK", "NEAR", "XRP", "ADA", "MATIC"];
const CUSTODY_REGULATORS = ["NYDFS", "SEC", "OCC", "FinCEN", "CFTC", "IRS", "EBA", "MiCA", "FATF"];

export async function runCustodyAnalysis(documentId: string): Promise<string> {
  // Fetch document
  const document = await prisma.document.findUnique({
    where: { id: documentId },
    select: { id: true, title: true, source: true, rawText: true, jurisdiction: true },
  });

  if (!document) throw new Error("Document not found");

  // Use first 6000 chars for analysis (cost control)
  const textSample = document.rawText.slice(0, 6000);

  const systemPrompt = `You are a senior custody operations analyst at Fireblocks Trust Company, a NYDFS-regulated qualified digital asset custodian. 
You specialize in extracting compliance obligations from regulatory documents and assessing their impact on:
- Digital asset custody operations
- Asset eligibility and listing processes  
- NYDFS charter compliance
- Staking and yield operations
- Client onboarding and KYC/AML workflows
- Cold storage and key management infrastructure

Be precise and operational. Extract specific numbers, deadlines, and thresholds when present.`;

  const prompt = `Analyze this regulatory document for custody operations impact. Return a JSON object with EXACTLY this structure:

{
  "riskScore": <integer 0-100, where 100 = most impactful for custody ops>,
  "riskLevel": <"HIGH" | "MEDIUM" | "LOW">,
  "affectedAssets": <array of crypto asset tickers affected, e.g. ["BTC", "ETH"] or [] if not asset-specific>,
  "keyObligations": <array of 3-6 specific compliance obligations extracted from the document>,
  "custodyImpact": <2-3 sentence paragraph describing the direct operational impact on custody workflows>,
  "regulatorBody": <primary regulator: "NYDFS" | "SEC" | "OCC" | "FinCEN" | "CFTC" | "IRS" | "EBA" | "Other">,
  "complianceDeadline": <deadline string if found, e.g. "July 1, 2026" or null>,
  "recommendedActions": <array of 3-5 specific operational actions the custody ops team should take>,
  "nydfsRelevance": <true if this directly affects NYDFS charter/BitLicense compliance, false otherwise>,
  "stakingImpact": <true if this affects staking operations or yield generation, false otherwise>
}

DOCUMENT TITLE: ${document.title}
SOURCE: ${document.source}
JURISDICTION: ${document.jurisdiction}

DOCUMENT TEXT:
${textSample}

Return ONLY the JSON object, no other text.`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6", // Use Sonnet for accuracy on analysis
    max_tokens: 1000,
    messages: [{ role: "user", content: prompt }],
    system: systemPrompt,
  });

  const raw = response.content[0].type === "text" ? response.content[0].text : "{}";
  
  // Parse and validate
  let parsed: any;
  try {
    // Handle potential markdown code blocks
    const cleaned = raw.replace(/```json\n?|\n?```/g, "").trim();
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("Failed to parse custody analysis response");
  }

  // Save analysis
  const analysis = await prisma.custodyAnalysis.create({
    data: {
      documentId,
      riskScore: Math.min(100, Math.max(0, Number(parsed.riskScore) || 50)),
      riskLevel: ["HIGH", "MEDIUM", "LOW"].includes(parsed.riskLevel) ? parsed.riskLevel : "MEDIUM",
      affectedAssets: Array.isArray(parsed.affectedAssets) ? parsed.affectedAssets : [],
      keyObligations: Array.isArray(parsed.keyObligations) ? parsed.keyObligations : [],
      custodyImpact: parsed.custodyImpact ?? "",
      regulatorBody: parsed.regulatorBody ?? document.source,
      complianceDeadline: parsed.complianceDeadline ?? null,
      recommendedActions: Array.isArray(parsed.recommendedActions) ? parsed.recommendedActions : [],
      nydfsRelevance: Boolean(parsed.nydfsRelevance),
      stakingImpact: Boolean(parsed.stakingImpact),
    },
  });

  return analysis.id;
}
```

### 4.2 Custody analysis API route

Create `src/app/api/documents/[id]/analyze/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { runCustodyAnalysis } from "@/lib/custodyAnalysis";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const analysisId = await runCustodyAnalysis(params.id);
    const analysis = await prisma.custodyAnalysis.findUnique({ where: { id: analysisId } });
    return NextResponse.json({ success: true, analysis });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const analyses = await prisma.custodyAnalysis.findMany({
    where: { documentId: params.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(analyses);
}
```

---

## Phase 5 — Brief Generation API

Replace the mock brief generator with a real LLM-powered one.

Create `src/app/api/briefs/generate/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";
import { queryDocuments } from "@/lib/rag";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const AUDIENCE_INSTRUCTIONS: Record<string, string> = {
  executive: "Write for a C-suite executive. Lead with business impact and risk exposure. Keep technical details minimal. Focus on decisions that need to be made.",
  legal: "Write for in-house legal counsel. Include specific statutory references, enforcement risk, liability exposure, and regulatory citations. Be precise.",
  ops: "Write for a custody operations team. Focus on workflow changes, system requirements, procedural updates, and operational deadlines. Be actionable.",
  board: "Write for a board of directors. Emphasize fiduciary risk, regulatory exposure, and strategic implications. Use plain language with clear risk framing.",
  client: "Write for an institutional client. Explain how regulatory changes affect their custody arrangement, what actions they need to take, and what Fireblocks Trust is doing to ensure compliance.",
};

const TONE_INSTRUCTIONS: Record<string, string> = {
  formal: "Use formal, professional language appropriate for regulatory filings or board presentations.",
  concise: "Be extremely concise. Bullet points preferred. Maximum 400 words total.",
  technical: "Use precise technical and legal terminology. Include regulatory citations and specific compliance thresholds.",
};

export async function POST(req: NextRequest) {
  try {
    const { documentId, query, audience = "ops", tone = "formal" } = await req.json();

    let context = "";
    let docTitle = "";
    let riskScore: number | null = null;

    if (documentId) {
      // Brief from a specific document
      const doc = await prisma.document.findUnique({
        where: { id: documentId },
        include: { analyses: { orderBy: { createdAt: "desc" }, take: 1 } },
      });
      if (!doc) return NextResponse.json({ error: "Document not found" }, { status: 404 });

      context = doc.rawText.slice(0, 5000);
      docTitle = doc.title;
      riskScore = doc.analyses[0]?.riskScore ?? null;
    } else if (query) {
      // Brief from a RAG query across all documents
      const ragResult = await queryDocuments(query);
      context = ragResult.sources.map((s) => s.chunkText).join("\n\n");
      docTitle = `Query: "${query}"`;
    } else {
      return NextResponse.json({ error: "Provide documentId or query" }, { status: 400 });
    }

    const systemPrompt = `You are a senior regulatory intelligence analyst at Fireblocks Trust Company, a NYDFS-regulated qualified digital asset custodian.
You generate compliance briefs from regulatory documents.
${AUDIENCE_INSTRUCTIONS[audience] || AUDIENCE_INSTRUCTIONS.ops}
${TONE_INSTRUCTIONS[tone] || TONE_INSTRUCTIONS.formal}`;

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

    // Save brief
    const brief = await prisma.brief.create({
      data: {
        documentId: documentId || null,
        query: query || null,
        audience,
        tone,
        content,
        riskScore,
      },
    });

    return NextResponse.json({ briefId: brief.id, content, riskScore });
  } catch (error: any) {
    console.error("Brief generation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

---

## Phase 6 — Frontend Pages to Build

### 6.1 Document Upload Page — `/src/app/upload/page.tsx`

Build a full-page document uploader with:
- Drag-and-drop file upload (PDF/DOCX/TXT)
- Form fields: Title, Source (dropdown: NYDFS/SEC/OCC/FinCEN/CFTC/IRS/EBA/Other), Jurisdiction (dropdown), Category (dropdown matching existing categories), Published Date
- Progress indicator showing: "Extracting text → Chunking → Embedding → Done"
- On success: show chunk count and link to run custody analysis
- Call `POST /api/documents/upload` with FormData

### 6.2 Document Library Page — `/src/app/documents/page.tsx`

Build a searchable table of all uploaded documents with:
- Columns: Title, Source, Jurisdiction, Category, Chunks, Risk Score (from latest analysis), Upload Date, Actions
- Actions per row: "Analyze" (POST to `/api/documents/[id]/analyze`), "Brief" (link to brief generator), "Query" (link to RAG query scoped to this doc)
- Call `GET /api/documents` to populate
- Show loading spinner while analysis is running (poll every 2s)

### 6.3 RAG Query Interface — `/src/app/query/page.tsx`

Build an intelligent query interface with:
- Large search/query input box with placeholder examples like:
  - "What are the NYDFS cold storage requirements for qualified custodians?"
  - "How does the SEC no-action letter affect RIA custody arrangements?"
  - "What staking activities are permitted under current custody regulations?"
- "Scope to document" optional selector (multi-select dropdown of uploaded docs)
- Results section showing:
  - The LLM-synthesized answer (render as markdown)
  - Source cards below: document title, similarity score, excerpt preview
  - Confidence badge (High/Medium/Low)
- Quick query chips for common custody questions
- "Generate Brief from this answer" button that passes the answer to brief generator
- Call `POST /api/query`

### 6.4 Update Custody Page — `/src/app/custody/page.tsx`

Extend the existing custody page to:
- Add a third tab: "Document Analysis" 
- In the Document Analysis tab, show all documents with custody analyses
- Each document card shows: risk score, affected assets, NYDFS relevance badge, staking impact badge, compliance deadline, key obligations summary
- "Run Analysis" button for documents without analysis yet
- "Ask a question about this document" button linking to `/query?documentId=xxx`
- Fetch from `GET /api/documents` and `GET /api/documents/[id]/analyze`

### 6.5 Update Sidebar — `/src/components/layout/Sidebar.tsx`

Add these nav items:
- "Document Library" → `/documents` (icon: `Database`)
- "Upload Document" → `/upload` (icon: `Upload`, badge: "RAG")  
- "Query Engine" → `/query` (icon: `Search`, badge: "AI")

---

## Phase 7 — Wiring the Brief Generator

Update the existing `/src/app/briefs/page.tsx` to:
1. Load documents from `GET /api/documents` for the document selector
2. When generating, call `POST /api/briefs/generate` with `{ documentId, audience, tone }`
3. Render the returned markdown content using a markdown renderer (install `react-markdown`)
4. Show real risk score from the database
5. Add a "Copy" button and a "Save" button

---

## Phase 8 — Seed Data (Important for Demo)

Create `prisma/seed.ts` to pre-populate the database with the 8 custody regulations from `src/data/custodyRegulations.ts` as text documents, so the RAG pipeline has content to query against from day one. Run:

```bash
npx ts-node prisma/seed.ts
```

The seed script should:
1. For each regulation in `custodyRegulations`, create a `Document` record with `rawText` = concatenated title + summary + whyItMatters + keyObligations + recommendedActions
2. Chunk and embed each document
3. Run `runCustodyAnalysis` on each one

---

## Phase 9 — Demo Script for Interview

Once built, the demo flow should be:

1. **Show the landing page** — explain Regulus AI's purpose
2. **Navigate to Document Library** — show pre-seeded NYDFS and SEC documents with risk scores already calculated
3. **Upload a new document** — upload any PDF from https://www.dfs.ny.gov (download any recent BitLicense guidance) — show real-time ingestion
4. **Run Custody Analysis** — click Analyze on the newly uploaded doc — show the AI extracting obligations, affected assets, deadline
5. **Query the document corpus** — ask "What does NYDFS require for cold storage of digital assets?" — show RAG finding relevant chunks and synthesizing an answer with sources
6. **Generate a brief** — generate an "Ops team" + "Concise" brief from the NYDFS document — show the LLM producing a structured compliance brief
7. **Show the Custody Intelligence tab** — walk through the asset evaluation matrix (BTC, ETH, SOL) and explain the scoring methodology

---

## Notes for Claude Code

- **Do not modify** `src/data/regulatoryUpdates.ts` or `src/data/custodyAssets.ts` — keep the mock data as fallback for UI development
- **Always handle errors gracefully** — if the DB or OpenAI is unavailable, fall back to the static mock data rather than crashing
- **Keep the existing UI design** — dark theme, `#D4A843` gold accent color, same component patterns
- **Environment check** — at the top of each API route, return a helpful error if `DATABASE_URL` or API keys are missing
- **TypeScript strict mode** — all new files must be fully typed, no `any` except where unavoidable with raw SQL results
- **Run `npx tsc --noEmit` after each phase** — fix all type errors before moving to the next phase
