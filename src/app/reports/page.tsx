"use client";

import AppShell from "@/components/layout/AppShell";
import { Download, TrendingUp, BarChart3, PieChart, FileText, Users } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

const riskByJurisdiction = [
  { name: "Federal US", high: 21, medium: 14, low: 6 },
  { name: "California", high: 7, medium: 5, low: 2 },
  { name: "EU / Intl", high: 5, medium: 9, low: 3 },
  { name: "Multi-State", high: 4, medium: 6, low: 2 },
  { name: "New York", high: 3, medium: 3, low: 1 },
];

const categoryBreakdown = [
  { name: "AI Governance", value: 28, color: "#D4A843" },
  { name: "Data Privacy", value: 22, color: "#F5C842" },
  { name: "Consumer Protection", value: 16, color: "#B8860B" },
  { name: "Climate & ESG", value: 12, color: "#8B6914" },
  { name: "Competition", value: 10, color: "#6B5011" },
  { name: "Other", value: 12, color: "#3D2D06" },
];

const workloadTrend = [
  { month: "Nov", briefs: 8, signals: 38, stakeholders: 12 },
  { month: "Dec", briefs: 11, signals: 48, stakeholders: 15 },
  { month: "Jan", briefs: 14, signals: 53, stakeholders: 18 },
  { month: "Feb", briefs: 17, signals: 67, stakeholders: 22 },
  { month: "Mar", briefs: 23, signals: 82, stakeholders: 29 },
  { month: "Apr", briefs: 31, signals: 103, stakeholders: 37 },
];

const stakeholderEngagement = [
  { type: "Legislators", engaged: 6, total: 12, lastContact: "Apr 25" },
  { type: "Federal Agencies", engaged: 5, total: 8, lastContact: "Apr 20" },
  { type: "Trade Associations", engaged: 4, total: 6, lastContact: "Apr 18" },
  { type: "Civil Society", engaged: 2, total: 5, lastContact: "Mar 28" },
  { type: "State Authorities", engaged: 3, total: 7, lastContact: "Apr 12" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[#111112] border border-white/10 rounded-lg px-3 py-2 text-xs">
        <div className="font-semibold text-white mb-1">{label}</div>
        {payload.map((p: any) => (
          <div key={p.name} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-zinc-400 capitalize">{p.name}:</span>
            <span className="text-white font-medium">{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const reports = [
  {
    title: "Q1 2026 Regulatory Landscape Summary",
    date: "Apr 1, 2026",
    type: "Quarterly",
    pages: 24,
    status: "Published",
  },
  {
    title: "AI Governance Risk Assessment — Federal Pipeline",
    date: "Mar 15, 2026",
    type: "Thematic",
    pages: 16,
    status: "Published",
  },
  {
    title: "Data Privacy Compliance Gap Analysis",
    date: "Feb 28, 2026",
    type: "Internal",
    pages: 11,
    status: "Draft",
  },
  {
    title: "Stakeholder Engagement Summary — Q1 2026",
    date: "Apr 5, 2026",
    type: "Public Affairs",
    pages: 8,
    status: "Published",
  },
];

export default function ReportsPage() {
  return (
    <AppShell>
      <div className="p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Analytics</div>
            <h1 className="text-2xl font-black text-white">Reports & Analytics</h1>
            <p className="text-sm text-zinc-500 mt-1">
              Regulatory trend analysis, risk metrics, stakeholder engagement, and compliance workload across your portfolio.
            </p>
          </div>
          <button className="flex items-center gap-2 text-sm border border-[#D4A843]/40 text-[#D4A843] font-semibold px-4 py-2 rounded hover:bg-[#D4A843]/10 transition-all">
            <Download className="w-4 h-4" />
            Export All
          </button>
        </div>

        {/* Executive summary cards */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: "Regulatory items this quarter", value: "103", icon: TrendingUp, delta: "+34% vs Q4 2025" },
            { label: "AI briefs generated", value: "31", icon: FileText, delta: "+11 this month" },
            { label: "Avg. risk score", value: "74.2", icon: BarChart3, delta: "↑ 6.3 pts MoM" },
            { label: "Stakeholders engaged", value: "20", icon: Users, delta: "5 types tracked" },
          ].map(({ label, value, icon: Icon, delta }) => (
            <div key={label} className="bg-[#0D0D0E] border border-white/5 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest leading-tight max-w-[75%]">
                  {label}
                </span>
                <Icon className="w-4 h-4 text-[#D4A843]/50" />
              </div>
              <div className="text-2xl font-black text-white">{value}</div>
              <div className="text-[10px] text-[#D4A843] mt-0.5">{delta}</div>
            </div>
          ))}
        </div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Workload trend */}
          <div className="bg-[#0D0D0E] border border-white/5 rounded-xl p-5">
            <div className="text-sm font-semibold text-white mb-1">Policy Activity Trend</div>
            <div className="text-xs text-zinc-500 mb-4">Monthly signals, briefs, and stakeholder touches</div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={workloadTrend} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="signals" stroke="#D4A843" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="briefs" stroke="#F5C842" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
                <Line type="monotone" dataKey="stakeholders" stroke="#9ca3af" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-5 mt-2">
              {[
                { label: "Policy Signals", color: "bg-[#D4A843]" },
                { label: "Briefs Generated", color: "bg-[#F5C842]" },
                { label: "Stakeholder Touches", color: "bg-zinc-400" },
              ].map(({ label, color }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${color}`} />
                  <span className="text-[11px] text-zinc-500">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Risk by jurisdiction */}
          <div className="bg-[#0D0D0E] border border-white/5 rounded-xl p-5">
            <div className="text-sm font-semibold text-white mb-1">Risk by Jurisdiction</div>
            <div className="text-xs text-zinc-500 mb-4">Signal distribution across geographies</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={riskByJurisdiction} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="high" stackId="a" fill="#ef4444" opacity={0.8} />
                <Bar dataKey="medium" stackId="a" fill="#D4A843" opacity={0.8} />
                <Bar dataKey="low" stackId="a" fill="#10b981" opacity={0.7} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts row 2 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Category pie */}
          <div className="bg-[#0D0D0E] border border-white/5 rounded-xl p-5">
            <div className="text-sm font-semibold text-white mb-1">Policy Category Breakdown</div>
            <div className="text-xs text-zinc-500 mb-3">Signal distribution by policy area</div>
            <ResponsiveContainer width="100%" height={140}>
              <RPieChart>
                <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryBreakdown.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </RPieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {categoryBreakdown.slice(0, 5).map(({ name, value, color }) => (
                <div key={name} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                  <span className="text-[10px] text-zinc-400 flex-1">{name}</span>
                  <span className="text-[10px] font-mono text-zinc-500">{value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stakeholder engagement */}
          <div className="bg-[#0D0D0E] border border-white/5 rounded-xl p-5">
            <div className="text-sm font-semibold text-white mb-1">Stakeholder Engagement</div>
            <div className="text-xs text-zinc-500 mb-4">Coverage by stakeholder type</div>
            <div className="space-y-3">
              {stakeholderEngagement.map(({ type, engaged, total, lastContact }) => (
                <div key={type}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-zinc-400">{type}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">{engaged}/{total}</span>
                  </div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#D4A843] rounded-full"
                      style={{ width: `${(engaged / total) * 100}%` }}
                    />
                  </div>
                  <div className="text-[9px] text-zinc-700 mt-0.5">Last: {lastContact}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Reports list */}
          <div className="bg-[#0D0D0E] border border-white/5 rounded-xl p-5">
            <div className="text-sm font-semibold text-white mb-1">Published Reports</div>
            <div className="text-xs text-zinc-500 mb-4">Exported regulatory intelligence reports</div>
            <div className="space-y-2">
              {reports.map((r) => (
                <div
                  key={r.title}
                  className="flex items-center gap-3 bg-[#111112] border border-white/5 rounded-lg p-2.5 hover:border-white/10 transition-all"
                >
                  <div className="w-7 h-7 rounded bg-[#D4A843]/10 border border-[#D4A843]/20 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-3.5 h-3.5 text-[#D4A843]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-white leading-snug truncate">{r.title}</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">
                      {r.type} · {r.pages}p · {r.date}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border flex-shrink-0 ${r.status === "Published" ? "text-emerald-400 bg-emerald-900/20 border-emerald-700/30" : "text-zinc-400 bg-zinc-800/50 border-zinc-600/30"}`}>
                      {r.status}
                    </span>
                    <button className="flex items-center gap-0.5 text-[10px] text-zinc-600 hover:text-[#D4A843] transition-colors">
                      <Download className="w-2.5 h-2.5" /> Export
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
