"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import {
  Database,
  Search,
  Loader2,
  Zap,
  FileText,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface DocumentRecord {
  id: string;
  title: string;
  source: string;
  jurisdiction: string;
  category: string;
  fileType: string;
  uploadedAt: string;
  _count: { chunks: number };
  analyses: Array<{
    id: string;
    riskScore: number;
    riskLevel: string;
    nydfsRelevance: boolean;
    stakingImpact: boolean;
  }>;
}

function riskBadge(level: string) {
  if (level === "HIGH") return "text-red-400 bg-red-400/10 border-red-400/20";
  if (level === "MEDIUM") return "text-[#D4A843] bg-[#D4A843]/10 border-[#D4A843]/20";
  return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
}

function riskScoreColor(score: number) {
  if (score >= 75) return "text-red-400";
  if (score >= 50) return "text-[#D4A843]";
  return "text-emerald-400";
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [analyzingIds, setAnalyzingIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState("");

  const fetchDocuments = useCallback(async () => {
    try {
      const res = await fetch("/api/documents");
      if (!res.ok) throw new Error("Failed to fetch documents");
      const data = await res.json();
      setDocuments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load documents");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  async function runAnalysis(docId: string) {
    setAnalyzingIds((prev) => new Set(prev).add(docId));
    try {
      const res = await fetch(`/api/documents/${docId}/analyze`, { method: "POST" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Analysis failed");
      }
      await fetchDocuments();
    } catch (err) {
      console.error("Analysis error:", err);
    } finally {
      setAnalyzingIds((prev) => {
        const next = new Set(prev);
        next.delete(docId);
        return next;
      });
    }
  }

  const filtered = documents.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.source.toLowerCase().includes(search.toLowerCase()) ||
      d.jurisdiction.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell>
      <div className="p-8">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1">RAG Corpus</div>
            <h1 className="text-2xl font-black text-white">Document Library</h1>
            <p className="text-sm text-zinc-500 mt-1">
              {documents.length} document{documents.length !== 1 ? "s" : ""} indexed
            </p>
          </div>
          <Link
            href="/upload"
            className="flex items-center gap-2 bg-[#D4A843] text-black font-bold text-sm px-4 py-2.5 rounded-xl hover:bg-[#F5C842] transition-all"
          >
            <Database className="w-4 h-4" />
            Upload Document
          </Link>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents..."
            className="w-full bg-[#0D0D0E] border border-white/8 text-sm text-white rounded-lg pl-9 pr-4 py-2.5 outline-none focus:border-[#D4A843]/50 transition-all"
          />
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 bg-red-900/20 border border-red-600/30 rounded-lg px-4 py-3 text-sm text-red-300">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error} — is the database running?
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-[#D4A843] animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Database className="w-12 h-12 text-zinc-700 mb-4" />
            <div className="text-sm text-zinc-500 mb-1">No documents yet</div>
            <div className="text-xs text-zinc-700">
              <Link href="/upload" className="text-[#D4A843] hover:underline">Upload a document</Link> to get started
            </div>
          </div>
        ) : (
          <div className="bg-[#0D0D0E] border border-white/5 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-4 py-3 text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
                    Document
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
                    Source
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
                    Chunks
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
                    Risk Score
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
                    Uploaded
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((doc) => {
                  const analysis = doc.analyses[0];
                  const isAnalyzing = analyzingIds.has(doc.id);
                  return (
                    <tr
                      key={doc.id}
                      className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <FileText className="w-4 h-4 text-zinc-600 flex-shrink-0" />
                          <div>
                            <div className="text-sm text-white font-medium leading-tight">{doc.title}</div>
                            <div className="text-[10px] text-zinc-500 mt-0.5">
                              {doc.jurisdiction} · {doc.category} · .{doc.fileType}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-zinc-400 font-mono">{doc.source}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-mono text-zinc-400">{doc._count.chunks}</span>
                      </td>
                      <td className="px-4 py-3">
                        {analysis ? (
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${riskBadge(analysis.riskLevel)}`}
                            >
                              {analysis.riskLevel}
                            </span>
                            <span className={`text-sm font-mono font-bold ${riskScoreColor(analysis.riskScore)}`}>
                              {analysis.riskScore}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-zinc-600">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-zinc-500">
                          {new Date(doc.uploadedAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          {isAnalyzing ? (
                            <div className="flex items-center gap-1.5 text-xs text-[#D4A843]">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Analyzing...
                            </div>
                          ) : analysis ? (
                            <span className="flex items-center gap-1 text-[10px] text-emerald-500">
                              <CheckCircle2 className="w-3 h-3" /> Analyzed
                            </span>
                          ) : (
                            <button
                              onClick={() => runAnalysis(doc.id)}
                              className="flex items-center gap-1.5 text-xs bg-[#D4A843]/10 border border-[#D4A843]/30 text-[#D4A843] px-2.5 py-1 rounded hover:bg-[#D4A843]/20 transition-all"
                            >
                              <Zap className="w-3 h-3" /> Analyze
                            </button>
                          )}
                          <Link
                            href={`/briefs?documentId=${doc.id}`}
                            className="text-xs bg-white/5 border border-white/10 text-zinc-400 px-2.5 py-1 rounded hover:bg-white/10 transition-all"
                          >
                            Brief
                          </Link>
                          <Link
                            href={`/query?documentId=${doc.id}`}
                            className="flex items-center gap-1 text-xs bg-white/5 border border-white/10 text-zinc-400 px-2.5 py-1 rounded hover:bg-white/10 transition-all"
                          >
                            <ExternalLink className="w-3 h-3" /> Query
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
}
