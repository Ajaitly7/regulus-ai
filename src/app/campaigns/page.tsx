"use client";

import AppShell from "@/components/layout/AppShell";
import { Briefcase, FileText, Users, CheckSquare, Plus, ChevronRight, Clock, User } from "lucide-react";

const campaigns = [
  {
    id: 1,
    name: "AI Accountability Monitoring",
    description: "Track all AI-related federal and state regulatory developments. Coordinate comment submissions and internal compliance preparation.",
    status: "Active",
    riskLevel: "HIGH",
    progress: 62,
    documents: 8,
    stakeholders: 5,
    tasks: 12,
    tasksCompleted: 7,
    briefingStatus: "2 briefs drafted",
    dueDate: "Sep 30, 2026",
    owner: "Policy Team",
    tags: ["AI Governance", "Federal", "California"],
  },
  {
    id: 2,
    name: "Data Privacy Rule Response",
    description: "Coordinate public comment submission and internal compliance preparation for the FTC's federal data privacy Notice of Proposed Rulemaking.",
    status: "Active",
    riskLevel: "HIGH",
    progress: 38,
    documents: 5,
    stakeholders: 4,
    tasks: 9,
    tasksCompleted: 3,
    briefingStatus: "1 brief drafted",
    dueDate: "Jun 15, 2026",
    owner: "Legal & Government Affairs",
    tags: ["Data Privacy", "FTC", "NPRM"],
  },
  {
    id: 3,
    name: "Climate Disclosure Readiness",
    description: "Prepare SEC Scope 1/2 emissions reporting infrastructure and draft climate risk disclosure narrative for FY2025 10-K filing.",
    status: "In Progress",
    riskLevel: "MEDIUM",
    progress: 71,
    documents: 4,
    stakeholders: 4,
    tasks: 15,
    tasksCompleted: 11,
    briefingStatus: "3 briefs completed",
    dueDate: "Mar 1, 2027",
    owner: "Legal & Finance",
    tags: ["ESG", "SEC", "Climate"],
  },
  {
    id: 4,
    name: "Consumer Protection Watch",
    description: "Monitor multi-state AG enforcement priorities and state legislative developments targeting dark patterns, algorithmic transparency, and consumer data practices.",
    status: "Active",
    riskLevel: "MEDIUM",
    progress: 44,
    documents: 6,
    stakeholders: 3,
    tasks: 10,
    tasksCompleted: 4,
    briefingStatus: "1 brief drafted",
    dueDate: "Jun 30, 2026",
    owner: "Public Affairs",
    tags: ["Consumer Protection", "State AG", "Multi-State"],
  },
  {
    id: 5,
    name: "Healthcare Data Compliance Review",
    description: "Assess HHS proposed updates to HIPAA information-blocking rules and prepare consent framework for AI analytics applications using patient-derived data.",
    status: "Planning",
    riskLevel: "HIGH",
    progress: 21,
    documents: 3,
    stakeholders: 3,
    tasks: 11,
    tasksCompleted: 2,
    briefingStatus: "Not started",
    dueDate: "Jul 31, 2026",
    owner: "Legal & Clinical Ops",
    tags: ["Healthcare", "HIPAA", "HHS"],
  },
  {
    id: 6,
    name: "Public Procurement AI Standards",
    description: "Review OMB draft AI vendor assurance framework and align product documentation for government sales pipeline. Coordinate public comment engagement.",
    status: "Planning",
    riskLevel: "LOW",
    progress: 18,
    documents: 2,
    stakeholders: 2,
    tasks: 6,
    tasksCompleted: 1,
    briefingStatus: "Not started",
    dueDate: "May 31, 2026",
    owner: "Government Affairs",
    tags: ["Procurement", "OMB", "Government Sales"],
  },
];

const riskColors: Record<string, string> = {
  HIGH: "text-red-400 bg-red-900/20 border-red-700/30",
  MEDIUM: "text-amber-400 bg-amber-900/20 border-amber-700/30",
  LOW: "text-emerald-400 bg-emerald-900/20 border-emerald-700/30",
};

const statusColors: Record<string, string> = {
  Active: "text-emerald-400 bg-emerald-900/20 border-emerald-700/30",
  "In Progress": "text-sky-400 bg-sky-900/20 border-sky-700/30",
  Planning: "text-zinc-400 bg-zinc-800/50 border-zinc-600/30",
};

export default function CampaignsPage() {
  const totalTasks = campaigns.reduce((s, c) => s + c.tasks, 0);
  const completedTasks = campaigns.reduce((s, c) => s + c.tasksCompleted, 0);

  return (
    <AppShell>
      <div className="p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Workflow</div>
            <h1 className="text-2xl font-black text-white">Campaign Workspace</h1>
            <p className="text-sm text-zinc-500 mt-1 max-w-xl">
              Coordinate regulatory response campaigns across government affairs, legal, public affairs, and compliance teams.
            </p>
          </div>
          <button className="flex items-center gap-2 text-sm bg-[#D4A843] text-black font-bold px-4 py-2 rounded hover:bg-[#F5C842] transition-all">
            <Plus className="w-4 h-4" />
            New Campaign
          </button>
        </div>

        {/* Summary bar */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          {[
            { label: "Active Campaigns", value: campaigns.filter((c) => c.status === "Active").length, color: "text-emerald-400" },
            { label: "In Planning", value: campaigns.filter((c) => c.status === "Planning").length, color: "text-zinc-400" },
            { label: "Total Documents", value: campaigns.reduce((s, c) => s + c.documents, 0), color: "text-[#D4A843]" },
            { label: "Open Tasks", value: totalTasks - completedTasks, color: "text-amber-400" },
            { label: "High Risk", value: campaigns.filter((c) => c.riskLevel === "HIGH").length, color: "text-red-400" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-[#0D0D0E] border border-white/5 rounded-xl p-4 text-center">
              <div className={`text-2xl font-black ${color}`}>{value}</div>
              <div className="text-xs text-zinc-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Campaigns grid */}
        <div className="grid grid-cols-2 gap-4">
          {campaigns.map((c) => (
            <div
              key={c.id}
              className="bg-[#0D0D0E] border border-white/5 rounded-xl p-5 hover:border-[#D4A843]/25 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 pr-3">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${riskColors[c.riskLevel]}`}>
                      {c.riskLevel} RISK
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${statusColors[c.status]}`}>
                      {c.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">{c.name}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">{c.description}</p>
                </div>
                <Briefcase className="w-5 h-5 text-[#D4A843]/30 flex-shrink-0 group-hover:text-[#D4A843]/60 transition-colors" />
              </div>

              {/* Progress */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] text-zinc-500">Campaign Progress</span>
                  <span className="text-[10px] font-mono text-[#D4A843]">{c.progress}%</span>
                </div>
                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      c.riskLevel === "HIGH"
                        ? "bg-gradient-to-r from-[#D4A843] to-amber-500"
                        : "bg-[#D4A843]"
                    }`}
                    style={{ width: `${c.progress}%` }}
                  />
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[
                  { icon: FileText, label: "Documents", value: c.documents },
                  { icon: Users, label: "Stakeholders", value: c.stakeholders },
                  {
                    icon: CheckSquare,
                    label: "Tasks",
                    value: `${c.tasksCompleted}/${c.tasks}`,
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-[#111112] rounded-lg p-2 text-center">
                    <Icon className="w-3.5 h-3.5 text-zinc-600 mx-auto mb-1" />
                    <div className="text-xs font-bold text-white">{value}</div>
                    <div className="text-[9px] text-zinc-600">{label}</div>
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {c.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[9px] bg-zinc-800/80 border border-zinc-700/50 text-zinc-500 px-1.5 py-0.5 rounded"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-[10px] text-zinc-600">
                    <User className="w-3 h-3" />
                    {c.owner}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-zinc-600">
                    <Clock className="w-3 h-3" />
                    Due {c.dueDate}
                  </div>
                </div>
                <button className="flex items-center gap-1 text-[10px] text-[#D4A843] hover:text-[#F5C842] transition-colors">
                  View Details <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
