"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import {
  Search,
  Filter,
  FileText,
  X,
  ChevronDown,
  ExternalLink,
  AlertCircle,
  Clock,
  Users,
  ArrowRight,
} from "lucide-react";
import {
  regulatoryUpdates,
  jurisdictions,
  categories,
  riskLevels,
  statuses,
  type RegulatoryUpdate,
} from "@/data/regulatoryUpdates";
import { riskColor, statusColor, formatDate } from "@/lib/utils";

export default function IntelligencePage() {
  const [search, setSearch] = useState("");
  const [filterJurisdiction, setFilterJurisdiction] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterRisk, setFilterRisk] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selected, setSelected] = useState<RegulatoryUpdate | null>(null);

  const filtered = useMemo(() => {
    return regulatoryUpdates.filter((r) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        r.title.toLowerCase().includes(q) ||
        r.summary.toLowerCase().includes(q) ||
        r.source.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q);
      const matchJurisdiction = !filterJurisdiction || r.jurisdiction === filterJurisdiction;
      const matchCategory = !filterCategory || r.category === filterCategory;
      const matchRisk = !filterRisk || r.riskLevel === filterRisk;
      const matchStatus = !filterStatus || r.status === filterStatus;
      return matchSearch && matchJurisdiction && matchCategory && matchRisk && matchStatus;
    });
  }, [search, filterJurisdiction, filterCategory, filterRisk, filterStatus]);

  const activeFilters = [filterJurisdiction, filterCategory, filterRisk, filterStatus].filter(Boolean).length;

  return (
    <AppShell>
      <div className="p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Live Feed</div>
          <h1 className="text-2xl font-black text-white">Regulatory Intelligence Feed</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Monitoring {regulatoryUpdates.length} regulatory signals across {jurisdictions.length} jurisdictions
          </p>
        </div>

        {/* Search + Filters */}
        <div className="bg-[#0D0D0E] border border-white/5 rounded-xl p-4 mb-5">
          <div className="flex gap-3 mb-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search regulations, sources, summaries..."
                className="w-full bg-[#111112] border border-white/8 text-sm text-white placeholder:text-zinc-600 rounded-lg pl-9 pr-4 py-2.5 outline-none focus:border-[#D4A843]/50 focus:ring-1 focus:ring-[#D4A843]/20 transition-all"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-3.5 h-3.5 text-zinc-500 hover:text-white" />
                </button>
              )}
            </div>
            {activeFilters > 0 && (
              <button
                onClick={() => {
                  setFilterJurisdiction("");
                  setFilterCategory("");
                  setFilterRisk("");
                  setFilterStatus("");
                }}
                className="flex items-center gap-1.5 text-xs text-red-400 border border-red-400/30 bg-red-400/5 px-3 py-2 rounded-lg hover:bg-red-400/10 transition-all"
              >
                <X className="w-3 h-3" />
                Clear ({activeFilters})
              </button>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 mr-1">
              <Filter className="w-3.5 h-3.5" />
              Filters:
            </div>
            {[
              {
                label: "Jurisdiction",
                value: filterJurisdiction,
                setter: setFilterJurisdiction,
                options: jurisdictions,
              },
              {
                label: "Category",
                value: filterCategory,
                setter: setFilterCategory,
                options: categories,
              },
              {
                label: "Risk Level",
                value: filterRisk,
                setter: setFilterRisk,
                options: riskLevels,
              },
              {
                label: "Status",
                value: filterStatus,
                setter: setFilterStatus,
                options: statuses,
              },
            ].map(({ label, value, setter, options }) => (
              <div key={label} className="relative">
                <select
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  className={`appearance-none text-xs rounded-lg px-3 py-1.5 pr-7 border outline-none cursor-pointer transition-all ${
                    value
                      ? "bg-[#D4A843]/10 border-[#D4A843]/40 text-[#D4A843]"
                      : "bg-[#111112] border-white/8 text-zinc-400 hover:border-white/20"
                  }`}
                >
                  <option value="">{label}</option>
                  {options.map((o) => (
                    <option key={o} value={o} className="bg-[#111112] text-white">
                      {o}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none" />
              </div>
            ))}

            <div className="ml-auto text-xs text-zinc-500 flex items-center">
              <span className="text-[#D4A843] font-semibold">{filtered.length}</span>
              <span className="ml-1">of {regulatoryUpdates.length} results</span>
            </div>
          </div>
        </div>

        <div className={`flex gap-5 ${selected ? "h-[calc(100vh-280px)]" : ""}`}>
          {/* Feed */}
          <div className={`${selected ? "w-[55%] overflow-y-auto" : "w-full"} space-y-3`}>
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-zinc-600">
                <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <div className="text-sm">No results match your filters.</div>
              </div>
            ) : (
              filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelected(selected?.id === item.id ? null : item)}
                  className={`bg-[#0D0D0E] border rounded-xl p-4 cursor-pointer transition-all hover:border-[#D4A843]/30 ${
                    selected?.id === item.id ? "border-[#D4A843]/50 bg-[#D4A843]/5" : "border-white/5"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${riskColor(item.riskLevel)}`}>
                          {item.riskLevel}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${statusColor(item.status)}`}>
                          {item.status}
                        </span>
                        <span className="text-[10px] text-zinc-500 bg-zinc-800/60 px-1.5 py-0.5 rounded">
                          {item.category}
                        </span>
                        <span className="text-[10px] text-zinc-600">{item.jurisdiction}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-white mb-1 leading-snug">{item.title}</h3>
                      <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">{item.summary}</p>
                      <div className="flex items-center gap-3 mt-2.5">
                        <span className="flex items-center gap-1 text-[10px] text-zinc-600">
                          <Clock className="w-3 h-3" />
                          {formatDate(item.date)}
                        </span>
                        <span className="text-[10px] text-zinc-600">{item.source}</span>
                        <div className="flex -space-x-1 ml-1">
                          {item.affectedTeams.slice(0, 3).map((t) => (
                            <span
                              key={t}
                              className="text-[9px] bg-zinc-800 border border-zinc-700 px-1.5 py-0.5 rounded text-zinc-400"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0 ml-2">
                      <div className="text-2xl font-black text-[#D4A843] font-mono leading-none">
                        {item.riskScore}
                      </div>
                      <div className="text-[9px] text-zinc-600 text-right">risk score</div>
                      <Link
                        href={`/briefs?documentId=${item.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 text-[10px] bg-[#D4A843]/10 border border-[#D4A843]/30 text-[#D4A843] px-2 py-1 rounded hover:bg-[#D4A843]/20 transition-all whitespace-nowrap"
                      >
                        <FileText className="w-3 h-3" />
                        Brief
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Detail panel */}
          {selected && (
            <div className="w-[45%] bg-[#0D0D0E] border border-[#D4A843]/30 rounded-xl overflow-y-auto flex-shrink-0">
              <div className="p-5 border-b border-white/5 flex items-start justify-between sticky top-0 bg-[#0D0D0E] z-10">
                <div className="flex-1 pr-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${riskColor(selected.riskLevel)}`}>
                      {selected.riskLevel}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${statusColor(selected.status)}`}>
                      {selected.status}
                    </span>
                  </div>
                  <h2 className="text-sm font-bold text-white leading-snug">{selected.title}</h2>
                  <div className="text-xs text-zinc-500 mt-1">
                    {selected.source} · {formatDate(selected.date)}
                  </div>
                </div>
                <button onClick={() => setSelected(null)}>
                  <X className="w-4 h-4 text-zinc-500 hover:text-white transition-colors" />
                </button>
              </div>

              <div className="p-5 space-y-5">
                {/* Risk score */}
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-4xl font-black text-[#D4A843] font-mono">{selected.riskScore}</div>
                    <div className="text-[10px] text-zinc-600">Risk Score</div>
                  </div>
                  <div className="flex-1">
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          selected.riskScore >= 80
                            ? "bg-red-500"
                            : selected.riskScore >= 60
                            ? "bg-[#D4A843]"
                            : "bg-emerald-500"
                        }`}
                        style={{ width: `${selected.riskScore}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[9px] text-zinc-600">0</span>
                      <span className="text-[9px] text-zinc-600">100</span>
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-1">
                      Confidence: <span className="text-[#D4A843]">{selected.confidence}%</span>
                    </div>
                  </div>
                </div>

                <Section title="Summary">{selected.summary}</Section>
                <Section title="Why It Matters">{selected.whyItMatters}</Section>

                <div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">Key Obligations</div>
                  <ul className="space-y-1.5">
                    {selected.keyObligations.map((o) => (
                      <li key={o} className="flex items-start gap-2 text-xs text-zinc-300">
                        <span className="w-1 h-1 rounded-full bg-[#D4A843] mt-1.5 flex-shrink-0" />
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">Affected Teams</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.affectedTeams.map((t) => (
                      <span key={t} className="text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 px-2 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">Recommended Actions</div>
                  <ul className="space-y-1.5">
                    {selected.recommendedActions.map((a, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                        <span className="text-[#D4A843] font-mono text-[10px] mt-0.5 flex-shrink-0">{i + 1}.</span>
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">Timeline</div>
                  <div className="text-xs text-zinc-300 bg-[#D4A843]/5 border border-[#D4A843]/20 rounded-lg px-3 py-2">
                    {selected.timeline}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Link
                    href={`/briefs?documentId=${selected.id}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#D4A843] text-black font-bold text-xs px-4 py-2.5 rounded-lg hover:bg-[#F5C842] transition-all"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Generate AI Brief
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <a
                    href={selected.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs border border-white/10 text-zinc-400 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-all"
                  >
                    Source <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function Section({ title, children }: { title: string; children: string }) {
  return (
    <div>
      <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">{title}</div>
      <p className="text-xs text-zinc-300 leading-relaxed">{children}</p>
    </div>
  );
}
