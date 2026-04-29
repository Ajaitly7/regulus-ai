"use client";

import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import {
  AlertTriangle,
  Globe,
  Zap,
  TrendingUp,
  FileText,
  ChevronRight,
  ArrowUpRight,
  MapPin,
  Bell,
  Users,
  Briefcase,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { regulatoryUpdates } from "@/data/regulatoryUpdates";
import { riskColor, statusColor, formatDate } from "@/lib/utils";

const trendData = [
  { month: "Nov", high: 12, medium: 18, low: 8 },
  { month: "Dec", high: 15, medium: 22, low: 11 },
  { month: "Jan", high: 19, medium: 25, low: 9 },
  { month: "Feb", high: 24, medium: 20, low: 13 },
  { month: "Mar", high: 29, medium: 28, low: 10 },
  { month: "Apr", high: 37, medium: 32, low: 14 },
];

const jurisdictionData = [
  { name: "Federal US", count: 21 },
  { name: "California", count: 8 },
  { name: "EU / Intl", count: 6 },
  { name: "Multi-State", count: 5 },
  { name: "New York", count: 4 },
  { name: "Other", count: 7 },
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

export default function DashboardPage() {
  const topItems = regulatoryUpdates.slice(0, 7);

  return (
    <AppShell>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Public Affairs · Command Center</div>
            <h1 className="text-2xl font-black text-white">Regulatory Intelligence Dashboard</h1>
            <p className="text-sm text-zinc-500 mt-1">
              Policy signals, risk trends, and compliance workload across all monitored jurisdictions.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/intelligence"
              className="flex items-center gap-1.5 text-xs border border-white/10 text-zinc-400 px-3 py-2 rounded hover:bg-white/5 transition-all"
            >
              <Bell className="w-3.5 h-3.5" /> View All Signals
            </Link>
            <div className="flex items-center gap-2 bg-[#D4A843]/10 border border-[#D4A843]/30 rounded px-3 py-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4A843] animate-pulse" />
              <span className="text-xs text-[#D4A843] font-medium">Live · Updated 2 min ago</span>
            </div>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Monitored Updates",
              value: "248",
              delta: "+14 today",
              sub: "Bills, rules & guidance",
              icon: Globe,
              color: "text-[#D4A843]",
              bg: "bg-[#D4A843]/10",
              border: "border-[#D4A843]/20",
            },
            {
              label: "High-Priority Signals",
              value: "37",
              delta: "+3 this week",
              sub: "Require immediate action",
              icon: AlertTriangle,
              color: "text-red-400",
              bg: "bg-red-400/10",
              border: "border-red-400/20",
            },
            {
              label: "Jurisdictions Tracked",
              value: "15",
              delta: "Federal + State + Intl",
              sub: "Active monitoring",
              icon: MapPin,
              color: "text-sky-400",
              bg: "bg-sky-400/10",
              border: "border-sky-400/20",
            },
            {
              label: "Briefing Time Saved",
              value: "91%",
              delta: "vs. manual research",
              sub: "AI-generated briefs",
              icon: Zap,
              color: "text-emerald-400",
              bg: "bg-emerald-400/10",
              border: "border-emerald-400/20",
            },
          ].map(({ label, value, delta, sub, icon: Icon, color, bg, border }) => (
            <div
              key={label}
              className={`bg-[#0D0D0E] border ${border} rounded-xl p-5 hover:brightness-110 transition-all`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs text-zinc-500 uppercase tracking-widest leading-tight max-w-[75%]">
                  {label}
                </span>
                <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
              </div>
              <div className="text-3xl font-black text-white mb-0.5">{value}</div>
              <div className={`text-xs ${color} font-medium`}>{delta}</div>
              <div className="text-[10px] text-zinc-600 mt-0.5">{sub}</div>
            </div>
          ))}
        </div>

        {/* Quick-action bar */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {[
            { icon: Bell, label: "New Signals Today", value: "14", href: "/intelligence" },
            { icon: FileText, label: "Briefs Generated", value: "31 this month", href: "/briefs" },
            { icon: Users, label: "Stakeholders Tracked", value: "6 active", href: "/stakeholders" },
            { icon: Briefcase, label: "Active Campaigns", value: "4 in progress", href: "/campaigns" },
          ].map(({ icon: Icon, label, value, href }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-3 bg-[#0D0D0E] border border-white/5 rounded-xl px-4 py-3 hover:border-[#D4A843]/30 hover:bg-[#D4A843]/5 transition-all group"
            >
              <Icon className="w-4 h-4 text-zinc-600 group-hover:text-[#D4A843] transition-colors flex-shrink-0" />
              <div>
                <div className="text-xs text-zinc-500">{label}</div>
                <div className="text-sm font-semibold text-white">{value}</div>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-700 group-hover:text-[#D4A843] ml-auto transition-colors" />
            </Link>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Risk trend */}
          <div className="col-span-2 bg-[#0D0D0E] border border-white/5 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm font-semibold text-white">Policy Risk Signal Trend</div>
                <div className="text-xs text-zinc-500 mt-0.5">Monthly signals by priority — federal, state & international</div>
              </div>
              <span className="text-xs text-zinc-600 bg-zinc-800/50 px-2 py-1 rounded">6 months</span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={trendData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="highGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="medGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4A843" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#D4A843" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="lowGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="high" stroke="#ef4444" strokeWidth={2} fill="url(#highGrad)" />
                <Area type="monotone" dataKey="medium" stroke="#D4A843" strokeWidth={2} fill="url(#medGrad)" />
                <Area type="monotone" dataKey="low" stroke="#10b981" strokeWidth={1.5} fill="url(#lowGrad)" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-5 mt-3">
              {[
                { label: "High Priority", color: "bg-red-400" },
                { label: "Medium Priority", color: "bg-[#D4A843]" },
                { label: "Monitor", color: "bg-emerald-400" },
              ].map(({ label, color }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${color}`} />
                  <span className="text-[11px] text-zinc-500">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Jurisdiction chart */}
          <div className="bg-[#0D0D0E] border border-white/5 rounded-xl p-5">
            <div className="text-sm font-semibold text-white mb-1">Signals by Jurisdiction</div>
            <div className="text-xs text-zinc-500 mb-4">Active regulatory activity</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={jurisdictionData} layout="vertical" margin={{ left: -10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fill: "#9ca3af", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={68}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#D4A843" radius={[0, 3, 3, 0]} opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Policy coverage + heat map */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-[#0D0D0E] border border-white/5 rounded-xl p-5">
            <div className="text-sm font-semibold text-white mb-1">Policy Category Coverage</div>
            <div className="text-xs text-zinc-500 mb-4">Compliance readiness by area</div>
            <div className="space-y-3">
              {[
                { label: "AI Governance", pct: 34, color: "bg-red-400" },
                { label: "Data Privacy", pct: 58, color: "bg-[#D4A843]" },
                { label: "Consumer Protection", pct: 65, color: "bg-[#D4A843]" },
                { label: "Climate & ESG", pct: 71, color: "bg-amber-500" },
                { label: "Competition & Trade", pct: 48, color: "bg-sky-400" },
                { label: "Employment & Labor", pct: 42, color: "bg-emerald-400" },
              ].map(({ label, pct, color }) => (
                <div key={label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-zinc-400">{label}</span>
                    <span className="text-xs text-zinc-500 font-mono">{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk heat map */}
          <div className="col-span-2 bg-[#0D0D0E] border border-white/5 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm font-semibold text-white">Regulatory Risk Heat Map</div>
                <div className="text-xs text-zinc-500 mt-0.5">Policy category × urgency horizon</div>
              </div>
              <span className="text-xs text-zinc-600 bg-zinc-800/50 px-2 py-1 rounded">Risk score 0–100</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[
                { label: "AI Gov.", q1: 87, q2: 71, q3: 44 },
                { label: "Privacy", q1: 91, q2: 75, q3: 52 },
                { label: "Consumer", q1: 69, q2: 55, q3: 32 },
                { label: "Climate", q1: 83, q2: 62, q3: 38 },
                { label: "Labor", q1: 71, q2: 50, q3: 28 },
              ].map(({ label, q1, q2, q3 }) => (
                <div key={label} className="space-y-1.5">
                  <div className="text-[10px] text-zinc-500 text-center mb-2">{label}</div>
                  {[
                    { score: q1, horizon: "Imminent" },
                    { score: q2, horizon: "Near-term" },
                    { score: q3, horizon: "Watch" },
                  ].map(({ score, horizon }) => {
                    const opacity = score >= 80 ? "opacity-100" : score >= 60 ? "opacity-70" : "opacity-40";
                    const bg = score >= 80 ? "bg-red-500" : score >= 60 ? "bg-[#D4A843]" : "bg-emerald-500";
                    return (
                      <div
                        key={horizon}
                        className={`${bg} ${opacity} rounded p-2 text-center cursor-default`}
                        title={`${label} — ${horizon}: ${score}`}
                      >
                        <div className="text-[11px] font-bold text-black">{score}</div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-5 mt-4">
              {["Imminent", "Near-term", "Watch"].map((l) => (
                <span key={l} className="text-[10px] text-zinc-600">↕ {l}</span>
              ))}
              <div className="ml-auto flex items-center gap-3">
                {[
                  { label: "≥80 High", color: "bg-red-500" },
                  { label: "60–80 Med", color: "bg-[#D4A843]" },
                  { label: "<60 Low", color: "bg-emerald-500" },
                ].map(({ label, color }) => (
                  <div key={label} className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded ${color} opacity-80`} />
                    <span className="text-[10px] text-zinc-600">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Signal tracker table */}
        <div className="bg-[#0D0D0E] border border-white/5 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-white">Recent High-Priority Policy Signals</div>
              <div className="text-xs text-zinc-500 mt-0.5">
                Latest legislative and regulatory updates — click to generate a brief
              </div>
            </div>
            <Link
              href="/intelligence"
              className="flex items-center gap-1.5 text-xs text-[#D4A843] hover:text-[#F5C842] transition-colors"
            >
              View all signals <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {topItems.map((item) => (
              <div
                key={item.id}
                className="px-5 py-3.5 flex items-center gap-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
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
                  <div className="text-sm text-white font-medium truncate">{item.title}</div>
                  <div className="text-xs text-zinc-500 mt-0.5">
                    {item.source} · {formatDate(item.date)}
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <div className="text-xl font-black text-[#D4A843] font-mono leading-none">{item.riskScore}</div>
                    <div className="text-[10px] text-zinc-600">risk score</div>
                  </div>
                  <Link
                    href={`/briefs?documentId=${item.id}`}
                    className="flex items-center gap-1.5 text-xs bg-[#D4A843]/10 border border-[#D4A843]/30 text-[#D4A843] px-3 py-1.5 rounded hover:bg-[#D4A843]/20 transition-all whitespace-nowrap"
                  >
                    <FileText className="w-3 h-3" />
                    Generate Brief
                  </Link>
                  <Link href="/intelligence">
                    <ChevronRight className="w-4 h-4 text-zinc-600 hover:text-white transition-colors" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
            <span className="text-xs text-zinc-600">Showing 7 of {regulatoryUpdates.length} signals</span>
            <Link href="/intelligence" className="text-xs text-[#D4A843] hover:text-[#F5C842] transition-colors">
              View full intelligence feed →
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
