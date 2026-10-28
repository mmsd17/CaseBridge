import { useMemo, useState } from 'react'
import {
  BUREAUS,
  STATUSES,
  CHART_COLORS,
  toISO,
  TODAY,
  parseDate,
  isOverdue,
  isOpen,
  daysOverdue,
  daysBetween,
  formatDate,
  institutionById,
  bureauName,
  findRelatedCandidates,
  dueOnFor,
} from '../data/mockData.js'
import StatCard from '../components/StatCard.jsx'
import Icon from '../components/Icon.jsx'

const MONTH_LABELS = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov']

export default function Overview({
  complaints = [],
  institutions = [],
  relationships = {},
  onSelect,
  goComplaints,
  onRelationshipDecision,
}) {
  const [decisionReason, setDecisionReason] = useState({})

  // Compute live statistics directly from store complaints
  const stats = useMemo(() => {
    const active = complaints.filter(isOpen)
    const breached = active.filter(isOverdue)
    const resolved = complaints.filter((c) => !isOpen(c))
    const escalated = complaints.filter((c) => c.status === 'Escalated')

    const resolvedInSla = resolved.filter((c) => {
      const filed = parseDate(c.filedOn)
      const res = parseDate(c.resolvedOn || c.filedOn)
      const days = Math.round((res - filed) / 86400000)
      const sla = { Critical: 3, High: 7, Medium: 15, Low: 30 }[c.priority] || 15
      return days <= sla
    }).length

    const slaPct = resolved.length ? Math.round((resolvedInSla / resolved.length) * 100) : 92

    return {
      total: complaints.length,
      open: active.length,
      escalated: escalated.length,
      resolved: resolved.length,
      breached: breached.length,
      slaPct,
    }
  }, [complaints])

  // Rule-based candidate related pairs awaiting review
  const allCandidates = useMemo(() => {
    return findRelatedCandidates(complaints, relationships, institutions)
  }, [complaints, relationships, institutions])

  const pendingReviewCandidates = useMemo(() => {
    return allCandidates.filter((cand) => cand.status === 'candidate')
  }, [allCandidates])

  // Breached / high risk cases
  const riskList = useMemo(() => {
    return complaints
      .filter((c) => isOverdue(c) || c.status === 'Escalated' || c.priority === 'Critical')
      .sort((a, b) => {
        const oA = isOverdue(a) ? 1 : 0
        const oB = isOverdue(b) ? 1 : 0
        if (oA !== oB) return oB - oA
        return daysOverdue(b) - daysOverdue(a)
      })
      .slice(0, 5)
  }, [complaints])

  // Data for Donut Chart
  const statusSegments = useMemo(() => {
    const counts = {
      'Resolved & Closed': complaints.filter((c) => ['Resolved', 'Closed'].includes(c.status)).length,
      'Under Review': complaints.filter((c) => c.status === 'Under Review').length,
      'In Progress': complaints.filter((c) => c.status === 'In Progress').length,
      Escalated: complaints.filter((c) => c.status === 'Escalated').length,
      'New / Pending': complaints.filter((c) => c.status === 'New').length,
    }
    const colors = {
      'Resolved & Closed': '#0043b8',
      'Under Review': '#4a5f80',
      'In Progress': '#f59e0b',
      Escalated: '#ba1a1a',
      'New / Pending': '#94a3b8',
    }
    return Object.entries(counts)
      .filter(([, val]) => val > 0)
      .map(([label, value]) => ({ label, value, color: colors[label] || '#1d4ed8' }))
  }, [complaints])

  // Bureau Workload & SLA Progress
  const bureauStats = useMemo(() => {
    return BUREAUS.map((b) => {
      const own = complaints.filter((c) => c.bureauId === b.id)
      const open = own.filter(isOpen)
      const breached = own.filter(isOverdue)
      const compliance = own.length
        ? Math.round(((own.length - breached.length) / own.length) * 100)
        : 95
      return {
        id: b.id,
        name: b.name,
        openCount: open.length,
        compliance,
        statusLabel: compliance >= 90 ? 'Optimal' : compliance >= 80 ? 'Good Standing' : 'Attention Required',
      }
    })
      .filter((b) => b.openCount > 0)
      .sort((a, b) => b.openCount - a.openCount)
      .slice(0, 5)
  }, [complaints])

  // Monthly Trend Line Points (Calculated from actual dates in complaints)
  const monthlyTrends = useMemo(() => {
    return MONTH_LABELS.map((m, idx) => {
      const targetMonth = idx + 5 // Jun (5) to Nov (10)
      const filed = complaints.filter((c) => {
        const d = parseDate(c.filedOn)
        return d.getMonth() === targetMonth
      }).length
      const resolved = complaints.filter((c) => {
        if (!c.resolvedOn) return false
        const d = parseDate(c.resolvedOn)
        return d.getMonth() === targetMonth
      }).length
      return { month: m, filed: Math.max(1, filed), resolved: Math.max(0, resolved) }
    })
  }, [complaints])

  const maxCaseload = Math.max(...monthlyTrends.map((t) => Math.max(t.filed, t.resolved)), 10)

  return (
    <div className="flex flex-col gap-6">
      {/* Operational Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[#DCE3EC]">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-700">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>Central Operations &amp; Grievance Oversight • AICTE New Delhi</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Grievance Monitoring Overview
          </h1>
          <p className="text-xs text-slate-500 flex items-center gap-2 flex-wrap">
            <span className="material-symbols-outlined text-[15px] text-slate-400">schedule</span>
            <span>Demonstration Data • Reporting Period: <strong className="font-semibold text-slate-800">Q4 2026</strong></span>
            <span className="text-slate-300">•</span>
            <span className="px-2 py-0.5 rounded-full bg-white border border-[#DCE3EC] text-[11px] font-mono text-slate-600">
              Live Synced
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-[11px] text-slate-500 italic">
              Active zonal queue: {stats.open} open files of {stats.total} statutory petitions
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 no-print">
          <button
            onClick={goComplaints}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors"
          >
            <span>View Full Complaints Register →</span>
          </button>
          <button
            onClick={() => window.print()}
            className="h-8 px-2.5 rounded-lg bg-white hover:bg-slate-50 border border-[#DCE3EC] flex items-center gap-1.5 text-slate-700 text-xs font-medium transition-colors shadow-2xs"
            title="Print Operational Snapshot"
          >
            <Icon name="print" className="h-4 w-4 text-slate-500" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* 5 Metrics KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard
          label="Total Grievances Filed"
          value={stats.total}
          icon="complaints"
          tone="blue"
          badge="+3.8% MoM"
          sub={`${stats.total} digital statutory petitions`}
        />
        <StatCard
          label="Active Unresolved Cases"
          value={stats.open}
          icon="clock"
          tone="slate"
          badge={`${Math.round((stats.open / (stats.total || 1)) * 100)}% vol`}
          sub={`${stats.open - stats.escalated} standard queue • ${stats.escalated} escalated`}
        />
        <StatCard
          label="Escalated High Priority"
          value={stats.escalated}
          icon="alert"
          tone="red"
          badge={stats.escalated > 0 ? 'URGENT' : 'STABLE'}
          sub="Critical statutory triage required"
        />
        <StatCard
          label="Resolved & Redressed"
          value={stats.resolved}
          icon="check"
          tone="green"
          badge={`${Math.round((stats.resolved / (stats.total || 1)) * 100)}% rate`}
          sub="Turnaround within prescribed norms"
        />
        <StatCard
          label="National SLA Compliance"
          value={`${stats.slaPct}%`}
          icon="scale"
          tone={stats.slaPct >= 85 ? 'blue' : 'amber'}
          badge={stats.slaPct >= 85 ? 'COMPLIANT' : 'REVIEW'}
          sub="Statutory benchmark: > 85.0%"
        />
      </div>

      {/* SLA Risk & Urgent Action Center */}
      <div className="bg-white border border-[#DCE3EC] rounded-xl p-5 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-50 text-red-700 border border-red-200 flex items-center justify-center shrink-0">
              <Icon name="alert" className="h-5 w-5 text-red-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  SLA Risk &amp; Immediate Action Center
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-red-700 text-white font-mono text-[11px] font-semibold">
                  {stats.breached} Overdue / Critical
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Statutory escalation protocol applies to grievances approaching or exceeding designated resolution timeline.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md shrink-0">
            <Icon name="clock" className="h-3.5 w-3.5 text-amber-700" />
            <span className="font-medium">Apex Secretariat Escalation Active</span>
          </div>
        </div>

        <div className="overflow-x-auto border border-[#DCE3EC] rounded-lg">
          <table className="w-full min-w-[960px] text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#DCE3EC] text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-4 w-36 min-w-[140px]">Complaint ID</th>
                <th className="py-2.5 px-4 min-w-[240px]">Nature of Grievance</th>
                <th className="py-2.5 px-4 min-w-[180px]">Inst. &amp; Jurisdiction</th>
                <th className="py-2.5 px-4 min-w-[160px]">Assigned Cell</th>
                <th className="py-2.5 px-4 min-w-[150px]">SLA Status</th>
                <th className="py-2.5 px-4 text-right min-w-[160px]">Action Directive</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {riskList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No active complaints have breached their statutory SLA window.
                  </td>
                </tr>
              ) : (
                riskList.map((c) => {
                  const inst = institutionById(c.institutionId, institutions)
                  const overdue = isOverdue(c)
                  const due = dueOnFor(c)
                  const daysLeft = daysBetween(toISO(TODAY), due)

                  return (
                    <tr
                      key={c.id}
                      onClick={() => onSelect(c.id)}
                      className="bg-white hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-4">
                        <span className="whitespace-nowrap font-mono font-semibold text-[13px] text-blue-950 bg-slate-100 border border-slate-200 px-2 py-1 rounded group-hover:text-blue-700">
                          {c.id}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-xs font-semibold text-slate-900 leading-snug">{c.title}</div>
                        <span className="text-[11px] text-slate-500">Category: {c.category}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-xs font-semibold text-slate-900">{inst?.name || c.institutionId}</div>
                        <span className="text-[11px] text-slate-500">{inst?.city}, {inst?.state}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 text-xs text-slate-800 font-medium px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 whitespace-nowrap">
                          {bureauName(c.bureauId)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {overdue ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 font-mono text-xs font-semibold whitespace-nowrap">
                            <Icon name="alert" className="h-3.5 w-3.5 text-red-600" />
                            Overdue by {daysOverdue(c)}d
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-mono text-xs font-medium whitespace-nowrap">
                            <Icon name="clock" className="h-3.5 w-3.5 text-amber-700" />
                            SLA in {daysLeft}d
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            onSelect(c.id)
                          }}
                          className="h-8 px-3 rounded-md bg-white hover:bg-slate-50 border border-[#DCE3EC] text-slate-800 font-semibold text-xs transition-colors shadow-2xs whitespace-nowrap"
                        >
                          Review Case Docket →
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RELATED-CASE REVIEW INTELLIGENCE CENTER (Section 5 Requirement) */}
      <div className="bg-white border border-[#DCE3EC] rounded-xl p-5 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0">
              <Icon name="link" className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Potentially Related Cases Awaiting Review
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white font-mono text-[11px] font-semibold">
                  {pendingReviewCandidates.length} Candidates
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Rule-based correlation detects overlapping complaints by shared institution ID and grievance keywords. Confirmations append an official audit log entry.
              </p>
            </div>
          </div>
        </div>

        {pendingReviewCandidates.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-200">
            No unreviewed related-case candidates pending. All detected pairs have been reviewed.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingReviewCandidates.slice(0, 4).map((cand) => {
              const inst1 = institutionById(cand.c1.institutionId, institutions)
              const inst2 = institutionById(cand.c2.institutionId, institutions)

              return (
                <div
                  key={cand.pairKey}
                  className="rounded-xl border border-blue-200/80 bg-blue-50/20 p-4 flex flex-col justify-between gap-3 shadow-2xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider">
                        {cand.matchType}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {cand.confidence} Confidence
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                      <div
                        onClick={() => onSelect(cand.c1.id)}
                        className="p-2.5 rounded-lg bg-white border border-slate-200 cursor-pointer hover:border-blue-300 transition-colors"
                      >
                        <div className="font-mono text-[11px] font-bold text-blue-900">{cand.c1.id}</div>
                        <div className="font-semibold text-slate-800 mt-0.5 line-clamp-1">{cand.c1.title}</div>
                        <div className="text-[10px] text-slate-500 truncate">{inst1?.name}</div>
                      </div>

                      <div
                        onClick={() => onSelect(cand.c2.id)}
                        className="p-2.5 rounded-lg bg-white border border-slate-200 cursor-pointer hover:border-blue-300 transition-colors"
                      >
                        <div className="font-mono text-[11px] font-bold text-blue-900">{cand.c2.id}</div>
                        <div className="font-semibold text-slate-800 mt-0.5 line-clamp-1">{cand.c2.title}</div>
                        <div className="text-[10px] text-slate-500 truncate">{inst2?.name}</div>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-600 bg-white/80 p-2 rounded border border-slate-200/60 leading-relaxed">
                      <strong className="text-slate-800">Match Reason:</strong> {cand.matchReason}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-2 border-t border-blue-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <input
                      type="text"
                      placeholder="Officer review note..."
                      value={decisionReason[cand.pairKey] || ''}
                      onChange={(e) =>
                        setDecisionReason({ ...decisionReason, [cand.pairKey]: e.target.value })
                      }
                      className="flex-1 px-2.5 py-1 text-xs rounded border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          onRelationshipDecision(
                            cand.pairKey,
                            'confirmed',
                            decisionReason[cand.pairKey] || '',
                          )
                        }}
                        className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-2xs transition-colors"
                      >
                        Confirm Match
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onRelationshipDecision(
                            cand.pairKey,
                            'dismissed',
                            decisionReason[cand.pairKey] || '',
                          )
                        }}
                        className="px-3 py-1 rounded-md bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-xs transition-colors"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Analytics & Telemetry Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Panel A: Intake vs Resolution Trends (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#DCE3EC] rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Grievance Intake vs. Resolution Trends</h3>
                <p className="text-xs text-slate-500">Caseload throughput across the last 6 calendar reporting months</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-blue-700" />
                  <span className="text-slate-700 font-medium">Filed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-slate-500" />
                  <span className="text-slate-700 font-medium">Resolved</span>
                </div>
              </div>
            </div>

            {/* SVG Trend Line / Area Chart */}
            <div className="relative w-full h-56 pt-2">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 600 200">
                <line stroke="#E2E8F0" strokeWidth="1" x1="40" x2="580" y1="20" y2="20" />
                <line stroke="#E2E8F0" strokeWidth="1" x1="40" x2="580" y1="65" y2="65" />
                <line stroke="#E2E8F0" strokeWidth="1" x1="40" x2="580" y1="110" y2="110" />
                <line stroke="#E2E8F0" strokeWidth="1" x1="40" x2="580" y1="155" y2="155" />
                <line stroke="#CBD5E1" strokeWidth="1" x1="40" x2="580" y1="190" y2="190" />

                <defs>
                  <linearGradient id="filedGradientOverview" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#1D4ED8" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Plot points dynamically */}
                {(() => {
                  const pointsFiled = monthlyTrends.map((t, idx) => {
                    const x = 80 + idx * 95
                    const y = 185 - (t.filed / maxCaseload) * 155
                    return `${x},${y}`
                  })
                  const pointsResolved = monthlyTrends.map((t, idx) => {
                    const x = 80 + idx * 95
                    const y = 185 - (t.resolved / maxCaseload) * 155
                    return `${x},${y}`
                  })

                  return (
                    <>
                      <polygon
                        fill="url(#filedGradientOverview)"
                        points={`80,185 ${pointsFiled.join(' ')} 555,185`}
                      />
                      <polyline
                        fill="none"
                        stroke="#1D4ED8"
                        strokeWidth="2.5"
                        points={pointsFiled.join(' ')}
                      />
                      <polyline
                        fill="none"
                        stroke="#64748B"
                        strokeDasharray="4 2"
                        strokeWidth="2.5"
                        points={pointsResolved.join(' ')}
                      />
                      {monthlyTrends.map((t, idx) => {
                        const x = 80 + idx * 95
                        const yF = 185 - (t.filed / maxCaseload) * 155
                        const yR = 185 - (t.resolved / maxCaseload) * 155
                        return (
                          <g key={idx}>
                            <circle cx={x} cy={yF} r="3.5" className="fill-blue-700" />
                            <circle cx={x} cy={yR} r="3" className="fill-slate-500" />
                          </g>
                        )
                      })}
                    </>
                  )
                })()}
              </svg>
            </div>

            <div className="grid grid-cols-6 pl-10 pr-4 text-center font-mono text-[11px] text-slate-500 pt-2">
              {MONTH_LABELS.map((m, i) => (
                <div key={i}>{m}</div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 flex items-center justify-between text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
            <span className="font-semibold text-blue-700 flex items-center gap-1">
              <Icon name="trend" className="h-4 w-4" />
              Caseload throughput steady at {stats.slaPct}% SLA benchmark compliance
            </span>
            <span>Total records: {stats.total}</span>
          </div>
        </div>

        {/* Panel B: Complaint Status Distribution Donut (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#DCE3EC] rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2">
              <div>
                <h3 className="text-base font-bold text-slate-900">Caseload Status Distribution</h3>
                <p className="text-xs text-slate-500">Active caseload partition across lifecycle states</p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 font-mono text-xs text-slate-800 font-semibold">
                {stats.total} Cases
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 mt-4">
              {/* Donut SVG */}
              <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100 stroke-current"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    strokeWidth="4.5"
                  />
                  {(() => {
                    let acc = 0
                    return statusSegments.map((seg, i) => {
                      const pct = Math.round((seg.value / (stats.total || 1)) * 100)
                      const dash = `${pct}, 100`
                      const offset = -acc
                      acc += pct
                      return (
                        <circle
                          key={i}
                          cx="18"
                          cy="18"
                          r="15.9155"
                          fill="none"
                          stroke={seg.color}
                          strokeWidth="4.5"
                          strokeDasharray={dash}
                          strokeDashoffset={offset}
                        />
                      )
                    })
                  })()}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-extrabold text-slate-900 leading-none">{stats.total}</span>
                  <span className="text-[10px] text-slate-400 font-medium">Total</span>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-col gap-2 w-full">
                {statusSegments.map((seg, i) => {
                  const pct = Math.round((seg.value / (stats.total || 1)) * 100)
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between p-1.5 rounded bg-slate-50 border border-slate-100 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
                        <span className="text-slate-700 font-medium">{seg.label}</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-slate-900 font-bold">{seg.value}</span>
                        <span className="text-slate-400 text-[11px]">{pct}%</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 text-center pt-3 border-t border-slate-100">
            Regulated under AICTE (Grievance Redressal of Students) Regulations 2019
          </div>
        </div>
      </div>

      {/* Bureau Performance & Workload Telemetry */}
      <div className="bg-white border border-[#DCE3EC] rounded-xl p-5 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Bureau Workload Distribution &amp; SLA Adherence</h3>
            <p className="text-xs text-slate-500">Live throughput metrics across statutory divisions</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Target threshold:</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-xs text-slate-800 font-semibold">
              &gt; 85.0% SLA
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {bureauStats.map((b) => (
            <div key={b.id} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800">{b.name}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[10px]">
                    {b.openCount} Active Inquiries
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-medium text-slate-700">{b.compliance}% Compliance</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      b.compliance >= 90
                        ? 'bg-blue-50 text-blue-800'
                        : b.compliance >= 80
                        ? 'bg-slate-100 text-slate-700'
                        : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {b.statusLabel}
                  </span>
                </div>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    b.compliance >= 85 ? 'bg-blue-600' : 'bg-red-600'
                  }`}
                  style={{ width: `${b.compliance}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
