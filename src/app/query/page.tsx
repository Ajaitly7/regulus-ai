"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import {
  Search,
  Loader2,
  AlertCircle,
  FileText,
  ChevronDown,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Document {
  id: string;
  title: string;
  source: string;
}

interface Source {
  documentId: string;
  documentTitle: string;
  chunkText: string;
  similarity: number;
}

interface RAGResult {
  answer: string;
  sources: Source[];
  confidence: number;
}

const QUICK_QUERIES = [
  "What are the NYDFS cold storage requirements for qualified custodians?",
  "How does the SEC no-action letter affect RIA custody arrangements?",
  "What staking activities are permitted under current custody regulations?",
  "What are the AML/BSA requirements for digital asset custodians?",
  "What cybersecurity attestations does NYDFS require annually?",
];

function confidenceBadge(confidence: number) {
  if (confidence >= 0.8) return { label: "High", cls: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" };
  if (confidence >= 0.5) return { label: "Medium", cls: "text-[#D4A843] bg-[#D4A843]/10 border-[#D4A843]/20" };
  return { label: "Low", cls: "text-red-400 bg-red-400/10 border-red-400/20" };
}

function QueryContent() {
  const searchParams = useSearchParams();
  const preselectedDocId = searchParams.get("documentId");

  const [query, setQuery] = useState("");
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>(
    preselectedDocId ? [preselectedDocId] : []
  );
  const [documents, setDocuments] = useState<Document[]>([]);
  const [result, setResult] = useState<RAGResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDocSelector, setShowDocSelector] = useState(false);

  useEffect(() => {
    fetch("/api/documents")
      .then((r) => r.json())
      .then((data: Document[]) => setDocuments(data))
      .catch(() => {});
  }, []);

  async function handleQuery(q?: string) {
    const finalQuery = q ?? query;
    if (!finalQuery.trim()) return;
    if (q) setQuery(q);

    setLoading(true);
    setResult(null);
    setError("");

    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: finalQuery.trim(),
          documentIds: selectedDocIds.length > 0 ? selectedDocIds : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Query failed");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Query failed");
    } finally {
      setLoading(false);
    }
  }

  function toggleDoc(id: string) {
    setSelectedDocIds((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  }

  const confidence = result ? confidenceBadge(result.confidence) : null;

  return (
    <AppShell>
      <div className="p-8">
        <div className="mb-6">
          <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1">RAG Pipeline</div>
          <h1 className="text-2xl font-black text-white">Query Engine</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Ask questions across your entire regulatory document corpus.
          </p>
        </div>

        <div className="grid grid-cols-[1fr_380px] gap-6">
          {/* Left: query + results */}
          <div className="space-y-4">
            {/* Query input */}
            <div className="bg-[#0D0D0E] border border-white/8 rounded-xl p-4">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleQuery();
                }}
                placeholder="Ask a regulatory compliance question..."
                rows={3}
                className="w-full bg-transparent text-sm text-white placeholder-zinc-600 outline-none resize-none"
              />
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                <span className="text-[10px] text-zinc-600">⌘ + Enter to submit</span>
                <button
                  onClick={() => handleQuery()}
                  disabled={!query.trim() || loading}
                  className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg transition-all ${
                    !query.trim() || loading
                      ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                      : "bg-[#D4A843] text-black hover:bg-[#F5C842]"
                  }`}
                >
                  {loading ? (
                    <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Searching...</>
                  ) : (
                    <><Search className="w-3.5 h-3.5" /> Search</>
                  )}
                </button>
              </div>
            </div>

            {/* Quick queries */}
            <div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">Quick queries</div>
              <div className="flex flex-wrap gap-2">
                {QUICK_QUERIES.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleQuery(q)}
                    className="text-xs bg-[#0D0D0E] border border-white/8 text-zinc-400 px-3 py-1.5 rounded-lg hover:border-[#D4A843]/30 hover:text-zinc-200 transition-all text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-900/20 border border-red-600/30 rounded-lg px-4 py-3 text-sm text-red-300">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {loading && (
              <div className="bg-[#0D0D0E] border border-[#D4A843]/20 rounded-xl p-8 flex flex-col items-center gap-3 text-center">
                <Loader2 className="w-8 h-8 text-[#D4A843] animate-spin" />
                <div className="text-sm text-[#D4A843]">Searching corpus...</div>
                <div className="text-xs text-zinc-600">Finding relevant chunks · Synthesizing answer</div>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                {/* Answer */}
                <div className="bg-[#0D0D0E] border border-[#D4A843]/20 rounded-xl overflow-hidden">
                  <div className="px-5 py-3 border-b border-white/5 bg-[#D4A843]/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#D4A843]" />
                      <span className="text-xs text-[#D4A843] font-semibold">AI Answer</span>
                    </div>
                    {confidence && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${confidence.cls}`}
                      >
                        {confidence.label} Confidence
                      </span>
                    )}
                  </div>
                  <div className="p-5 text-sm text-zinc-300 leading-relaxed prose prose-invert prose-sm max-w-none prose-headings:text-white prose-headings:font-bold prose-strong:text-zinc-200">
                    <ReactMarkdown>{result.answer}</ReactMarkdown>
                  </div>
                  <div className="px-5 pb-4">
                    <Link
                      href={`/briefs?query=${encodeURIComponent(query)}`}
                      className="inline-flex items-center gap-1.5 text-xs bg-[#D4A843]/10 border border-[#D4A843]/30 text-[#D4A843] px-3 py-1.5 rounded-lg hover:bg-[#D4A843]/20 transition-all"
                    >
                      <FileText className="w-3 h-3" /> Generate Brief from this answer <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                {/* Sources */}
                {result.sources.length > 0 && (
                  <div>
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">
                      {result.sources.length} source chunk{result.sources.length !== 1 ? "s" : ""}
                    </div>
                    <div className="space-y-2">
                      {result.sources.map((src, i) => (
                        <div
                          key={i}
                          className="bg-[#0D0D0E] border border-white/5 rounded-lg p-3"
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <FileText className="w-3 h-3 text-zinc-600" />
                              <span className="text-xs text-zinc-300 font-medium">{src.documentTitle}</span>
                            </div>
                            <span className="text-[10px] font-mono text-zinc-600">
                              {(src.similarity * 100).toFixed(1)}% match
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-500 leading-relaxed line-clamp-3">
                            {src.chunkText}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: document scope selector */}
          <div className="space-y-4">
            <div className="bg-[#0D0D0E] border border-white/5 rounded-xl p-4">
              <button
                onClick={() => setShowDocSelector(!showDocSelector)}
                className="w-full flex items-center justify-between text-left"
              >
                <div>
                  <div className="text-xs text-zinc-500 uppercase tracking-widest mb-0.5">Document scope</div>
                  <div className="text-sm text-white font-medium">
                    {selectedDocIds.length === 0
                      ? "All documents"
                      : `${selectedDocIds.length} selected`}
                  </div>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-zinc-500 transition-transform ${showDocSelector ? "rotate-180" : ""}`}
                />
              </button>

              {showDocSelector && (
                <div className="mt-3 pt-3 border-t border-white/5 space-y-1 max-h-64 overflow-y-auto">
                  <button
                    onClick={() => setSelectedDocIds([])}
                    className={`w-full text-left text-xs px-2 py-1.5 rounded transition-colors ${
                      selectedDocIds.length === 0
                        ? "text-[#D4A843] bg-[#D4A843]/10"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                    }`}
                  >
                    All documents
                  </button>
                  {documents.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => toggleDoc(doc.id)}
                      className={`w-full text-left text-xs px-2 py-1.5 rounded transition-colors ${
                        selectedDocIds.includes(doc.id)
                          ? "text-[#D4A843] bg-[#D4A843]/10"
                          : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                      }`}
                    >
                      <div className="font-medium">{doc.title}</div>
                      <div className="text-zinc-600 text-[10px]">{doc.source}</div>
                    </button>
                  ))}
                  {documents.length === 0 && (
                    <div className="text-xs text-zinc-600 px-2 py-2">
                      No documents yet.{" "}
                      <Link href="/upload" className="text-[#D4A843] hover:underline">Upload one</Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Corpus stats */}
            <div className="bg-[#0D0D0E] border border-white/5 rounded-xl p-4">
              <div className="text-xs text-zinc-500 uppercase tracking-widest mb-3">Corpus</div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Documents</span>
                  <span className="text-white font-mono">{documents.length}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Scope</span>
                  <span className="text-white font-mono">
                    {selectedDocIds.length === 0 ? "All" : selectedDocIds.length}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Model</span>
                  <span className="text-white font-mono">claude-haiku-4-5</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Embeddings</span>
                  <span className="text-white font-mono">text-embedding-3-small</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default function QueryPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen text-zinc-500"><Loader2 className="w-5 h-5 animate-spin" /></div>}>
      <QueryContent />
    </Suspense>
  );
}
