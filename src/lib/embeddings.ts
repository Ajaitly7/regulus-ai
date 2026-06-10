import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function embedText(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text.slice(0, 8000),
  });
  return response.data[0].embedding;
}

export async function embedBatch(texts: string[]): Promise<number[][]> {
  const results: number[][] = [];
  for (let i = 0; i < texts.length; i += 20) {
    const batch = texts.slice(i, i + 20);
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: batch.map((t) => t.slice(0, 8000)),
    });
    results.push(...response.data.map((d) => d.embedding));
    if (i + 20 < texts.length) await new Promise((r) => setTimeout(r, 200));
  }
  return results;
}
