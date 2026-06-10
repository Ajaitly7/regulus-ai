"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronDown,
  ArrowRight,
  X,
} from "lucide-react";

const SOURCES = ["NYDFS", "SEC", "OCC", "FinCEN", "CFTC", "IRS", "EBA", "Other"];
const JURISDICTIONS = [
  "New York (US)",
  "Federal (US)",
  "EU / International",
  "UK",
  "Singapore",
  "Other",
];
const CATEGORIES = [
  "Digital Asset Custody",
  "AML / BSA Compliance",
  "Cybersecurity",
  "Tax & Reporting",
  "Consumer Protection",
  "Market Structure",
  "Other",
];

type Stage = "idle" | "extracting" | "chunking" | "embedding" | "done" | "error";

const STAGE_LABELS: Record<Stage, string> = {
  idle: "",
  extracting: "Extracting text from document...",
  chunking: "Chunking document into segments...",
  embedding: "Generating embeddings...",
  done: "Ingestion complete",
  error: "Error during ingestion",
};

export default function UploadPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [source, setSource] = useState(SOURCES[0]);
  const [jurisdiction, setJurisdiction] = useState(JURISDICTIONS[0]);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [publishedAt, setPublishedAt] = useState("");
  const [stage, setStage] = useState<Stage>("idle");
  const [chunkCount, setChunkCount] = useState<number | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) selectFile(dropped);
  }

  function selectFile(f: File) {
    setFile(f);
    if (!title) setTitle(f.name.replace(/\.[^.]+$/, ""));
    setStage("idle");
    setErrorMsg("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setStage("extracting");
    setErrorMsg("");

    const fd = new FormData();
    fd.append("file", file);
    fd.append("title", title);
    fd.append("source", source);
    fd.append("jurisdiction", jurisdiction);
    fd.append("category", category);
    if (publishedAt) fd.append("publishedAt", publishedAt);

    // Simulate chunking stage after a short delay
    const chunkTimer = setTimeout(() => setStage("chunking"), 800);
    const embedTimer = setTimeout(() => setStage("embedding"), 1600);

    try {
      const res = await fetch("/api/documents/upload", { method: "POST", body: fd });
      clearTimeout(chunkTimer);
      clearTimeout(embedTimer);

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setStage("done");
      setChunkCount(data.chunkCount);
      setDocumentId(data.documentId);
    } catch (err) {
      clearTimeout(chunkTimer);
      clearTimeout(embedTimer);
      setStage("error");
      setErrorMsg(err instanceof Error ? err.message : "Upload failed");
    }
  }

  const isLoading = stage === "extracting" || stage === "chunking" || stage === "embedding";

  return (
    <AppShell>
      <div className="p-8 max-w-2xl">
        <div className="mb-6">
          <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1">RAG Pipeline</div>
          <h1 className="text-2xl font-black text-white">Upload Regulatory Document</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Upload a PDF, DOCX, or TXT file to ingest it into the RAG corpus.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-all ${
              dragOver
                ? "border-[#D4A843] bg-[#D4A843]/5"
                : file
                ? "border-[#D4A843]/40 bg-[#D4A843]/5"
                : "border-white/10 hover:border-white/20 bg-[#0D0D0E]"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && selectFile(e.target.files[0])}
            />
            {file ? (
              <>
                <FileText className="w-8 h-8 text-[#D4A843]" />
                <div className="text-center">
                  <div className="text-sm font-semibold text-white">{file.name}</div>
                  <div className="text-xs text-zinc-500 mt-0.5">
                    {(file.size / 1024).toFixed(1)} KB · {file.type || file.name.split(".").pop()?.toUpperCase()}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setFile(null); setTitle(""); setStage("idle"); }}
                  className="text-xs text-zinc-500 hover:text-white flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Remove
                </button>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8 text-zinc-600" />
                <div className="text-center">
                  <div className="text-sm text-zinc-400">Drag & drop or click to select</div>
                  <div className="text-xs text-zinc-600 mt-0.5">PDF, DOCX, or TXT</div>
                </div>
              </>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-1.5">
              Document Title
            </label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#0D0D0E] border border-white/8 text-sm text-white rounded-lg px-3 py-2.5 outline-none focus:border-[#D4A843]/50 focus:ring-1 focus:ring-[#D4A843]/20 transition-all"
              placeholder="e.g. NYDFS BitLicense Guidance Update 2026"
            />
          </div>

          {/* Source / Jurisdiction row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-1.5">
                Regulatory Source
              </label>
              <div className="relative">
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full appearance-none bg-[#0D0D0E] border border-white/8 text-sm text-white rounded-lg px-3 py-2.5 pr-8 outline-none focus:border-[#D4A843]/50 cursor-pointer transition-all"
                >
                  {SOURCES.map((s) => (
                    <option key={s} value={s} className="bg-[#0D0D0E]">{s}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-1.5">
                Jurisdiction
              </label>
              <div className="relative">
                <select
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value)}
                  className="w-full appearance-none bg-[#0D0D0E] border border-white/8 text-sm text-white rounded-lg px-3 py-2.5 pr-8 outline-none focus:border-[#D4A843]/50 cursor-pointer transition-all"
                >
                  {JURISDICTIONS.map((j) => (
                    <option key={j} value={j} className="bg-[#0D0D0E]">{j}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Category / Published date row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-1.5">
                Category
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full appearance-none bg-[#0D0D0E] border border-white/8 text-sm text-white rounded-lg px-3 py-2.5 pr-8 outline-none focus:border-[#D4A843]/50 cursor-pointer transition-all"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} className="bg-[#0D0D0E]">{c}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-1.5">
                Published Date (optional)
              </label>
              <input
                type="date"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full bg-[#0D0D0E] border border-white/8 text-sm text-white rounded-lg px-3 py-2.5 outline-none focus:border-[#D4A843]/50 transition-all [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Progress indicator */}
          {isLoading && (
            <div className="bg-[#0D0D0E] border border-[#D4A843]/20 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <Loader2 className="w-4 h-4 text-[#D4A843] animate-spin" />
                <span className="text-sm text-[#D4A843]">{STAGE_LABELS[stage]}</span>
              </div>
              <div className="flex gap-2">
                {(["extracting", "chunking", "embedding"] as const).map((s) => {
                  const stageOrder = ["extracting", "chunking", "embedding"];
                  const currentIdx = stageOrder.indexOf(stage);
                  const thisIdx = stageOrder.indexOf(s);
                  const done = thisIdx < currentIdx;
                  const active = thisIdx === currentIdx;
                  return (
                    <div
                      key={s}
                      className={`flex-1 h-1 rounded-full transition-all ${
                        done
                          ? "bg-[#D4A843]"
                          : active
                          ? "bg-[#D4A843]/50 animate-pulse"
                          : "bg-zinc-800"
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Success state */}
          {stage === "done" && (
            <div className="bg-emerald-900/20 border border-emerald-600/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-emerald-300">Document ingested successfully</div>
                  <div className="text-xs text-emerald-500 mt-0.5">
                    {chunkCount} chunks embedded into the RAG corpus
                  </div>
                  <div className="flex gap-3 mt-3">
                    <Link
                      href={`/documents`}
                      className="text-xs bg-[#D4A843] text-black font-bold px-3 py-1.5 rounded-lg hover:bg-[#F5C842] transition-all flex items-center gap-1.5"
                    >
                      View in Library <ArrowRight className="w-3 h-3" />
                    </Link>
                    <Link
                      href={`/query`}
                      className="text-xs bg-white/5 border border-white/10 text-zinc-300 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all"
                    >
                      Query Engine
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error state */}
          {stage === "error" && (
            <div className="bg-red-900/20 border border-red-600/30 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-red-300">Upload failed</div>
                <div className="text-xs text-red-500 mt-0.5">{errorMsg}</div>
              </div>
            </div>
          )}

          {/* Submit button */}
          {stage !== "done" && (
            <button
              type="submit"
              disabled={!file || !title || isLoading}
              className={`w-full flex items-center justify-center gap-2 font-bold text-sm px-6 py-3.5 rounded-xl transition-all ${
                !file || !title || isLoading
                  ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                  : "bg-[#D4A843] text-black hover:bg-[#F5C842] shadow-lg shadow-[#D4A843]/20"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Ingest Document
                </>
              )}
            </button>
          )}
        </form>
      </div>
    </AppShell>
  );
}
