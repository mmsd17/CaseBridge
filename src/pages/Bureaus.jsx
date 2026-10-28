import { useState, useMemo } from 'react'
import {
  BUREAUS,
  isOpen,
  isOverdue,
  daysOpen,
  institutionLabel,
} from '../data/mockData.js'
import Icon from '../components/Icon.jsx'

export default function Bureaus({ complaints = [], onSelect, filterByBureau }) {
  const [search, setSearch] = useState('')
  const [filterMode, setFilterMode] = useState('all') // 'all', 'high-workload', 'attention', 'optimal'
  const [sortBy, setSortBy] = useState('open-desc')

  // Macro metrics across all complaints
  const macro = useMemo(() => {
    const totalComplaints = complaints.length
    const openComplaints = complaints.filter(isOpen)
    const resolvedComplaints = complaints.filter((c) => !isOpen(c))
    const overdueComplaints = complaints.filter(isOverdue)
    const escalatedOrCritical = openComplaints.filter(
      (c) => c.status === 'Escalated' || c.priority === 'Critical'
    ).length

    const overallSla = totalComplaints > 0
      ? Math.round(((totalComplaints - overdueComplaints.length) / totalComplaints) * 1000) / 10
      : 100

    const avgResolutionDays = resolvedComplaints.length > 0
      ? (resolvedComplaints.reduce((acc, c) => acc + daysOpen(c), 0) / resolvedComplaints.length).toFixed(1)
      : '0.0'

    return {
      total: totalComplaints,
      open: openComplaints.length,
      resolved: resolvedComplaints.length,
      overdue: overdueComplaints.length,
      escalatedOrCritical,
      overallSla,
      avgResolutionDays,
    }
  }, [complaints])

  // Individual bureau calculations
  const bureauData = useMemo(() => {
    return BUREAUS.map((b) => {
      const own = complaints.filter((c) => c.bureauId === b.id)
      const openCases = own.filter(isOpen)
      const resolvedCases = own.filter((c) => !isOpen(c))
      const breachedCases = own.filter(isOverdue)
      const escalatedCases = openCases.filter((c) => c.status === 'Escalated')
      const criticalCases = openCases.filter((c) => c.priority === 'Critical' || c.priority === 'High')

      const avgDays = resolvedCases.length > 0
        ? (resolvedCases.reduce((s, c) => s + daysOpen(c), 0) / resolvedCases.length).toFixed(1)
        : '0.0'

      const sla = own.length > 0
        ? Math.round(((own.length - breachedCases.length) / own.length) * 1000) / 10
        : 100

      const latestOpen = openCases[0] || null

      // Initials for avatar
      const cleanHead = (b.head || '').replace(/^(Dr\.|Sh\.|Ms\.|Ar\.|Prof\.)\s*/i, '')
      const initials = cleanHead
        .split(' ')
        .filter(Boolean)
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'NO'

      let statusBadge = {
        label: 'Optimal',
        badgeCls: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        dotCls: 'bg-emerald-600',
      }
      if (sla < 85) {
        statusBadge = {
          label: 'SLA Breached',
          badgeCls: 'bg-red-50 text-red-700 border-red-200',
          dotCls: 'bg-red-600 animate-pulse',
        }
      } else if (sla < 90) {
        statusBadge = {
          label: 'Attention',
          badgeCls: 'bg-amber-50 text-amber-800 border-amber-200',
          dotCls: 'bg-amber-600',
        }
      }

      return {
        ...b,
        initials,
        total: own.length,
        open: openCases.length,
        escalated: escalatedCases.length,
        resolved: resolvedCases.length,
        criticalCount: criticalCases.length,
        avgDays: parseFloat(avgDays),
        sla,
        statusBadge,
        latestOpen,
      }
    })
  }, [complaints])

  // Count bureaus needing SLA attention
  const bureausNeedingAttention = useMemo(() => {
    return bureauData.filter((b) => b.sla < 85)
  }, [bureauData])

  // Filter & sort
  const filteredBureaus = useMemo(() => {
    let result = [...bureauData]

    // Text search
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.id.toLowerCase().includes(q) ||
          b.head.toLowerCase().includes(q) ||
          b.email.toLowerCase().includes(q)
      )
    }

    // Filter pills
    if (filterMode === 'high-workload') {
      const avgOpen = result.reduce((s, b) => s + b.open, 0) / (result.length || 1)
      result = result.filter((b) => b.open >= avgOpen && b.open > 0)
    } else if (filterMode === 'attention') {
      result = result.filter((b) => b.sla < 85)
    } else if (filterMode === 'optimal') {
      result = result.filter((b) => b.sla >= 90)
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'open-desc':
          return b.open - a.open
        case 'sla-asc':
          return a.sla - b.sla
        case 'sla-desc':
          return b.sla - a.sla
        case 'total-desc':
          return b.total - a.total
        case 'velocity-asc':
          return a.avgDays - b.avgDays
        default:
          return b.open - a.open
      }
    })

    return result
  }, [bureauData, search, filterMode, sortBy])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-[#DCE3EC]">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200/80 px-2.5 py-0.5 rounded-md">
              STATUTORY DIVISIONS
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md">
              REGULATORY CYCLE 2026–27
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {BUREAUS.length} Active Units Overseeing {macro.total} Cases • Active Grievance Grid
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#102A43] tracking-tight pt-1">
            Bureaus &amp; Operational Cells
          </h1>
          <p className="text-xs text-slate-600 max-w-3xl">
            Administrative workload distribution, resolution velocity, nodal officer accountability, and statutory SLA compliance across all AICTE grievance management divisions.
          </p>
        </div>

        {/* Header Action Button */}
        <div className="flex items-center gap-2.5 shrink-0 self-start lg:self-auto">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-[#DCE3EC] text-slate-700 text-xs font-semibold shadow-xs hover:bg-slate-50 hover:border-slate-300 transition-all"
          >
            <Icon name="print" className="h-4 w-4 text-blue-700" />
            <span>Download Bureau Report</span>
          </button>
        </div>
      </div>

      {/* Macro Operational Metrics (Top 4 Aligned Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Overall AICTE SLA */}
        <div className="bg-white p-4 rounded-xl border border-[#DCE3EC] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Overall AICTE SLA
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Icon name="verified" className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-[#102A43]">{macro.overallSla}%</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
              Statutory 85% Min
            </span>
          </div>
          <div className="mt-2.5">
            <div className="flex justify-between text-[11px] text-slate-500 mb-1 font-medium">
              <span>National Target</span>
              <span>{macro.overallSla >= 85 ? 'Compliant' : 'Attention'}</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${macro.overallSla < 85 ? 'bg-red-500' : 'bg-blue-600'}`}
                style={{ width: `${Math.min(100, Math.max(0, macro.overallSla))}%` }}
              />
            </div>
          </div>
        </div>

        {/* KPI 2: Total Active Load */}
        <div className="bg-white p-4 rounded-xl border border-[#DCE3EC] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Active Load
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-slate-700 flex items-center justify-center">
              <Icon name="gavel" className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-[#102A43]">
              {macro.open} <span className="text-xs font-normal text-slate-500">Open Cases</span>
            </span>
            <span className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full font-mono">
              {macro.escalatedOrCritical} Critical/Esc
            </span>
          </div>
          <div className="mt-2.5">
            <div className="flex justify-between text-[11px] text-slate-500 mb-1 font-medium">
              <span>Escalation Ratio</span>
              <span className="text-red-600 font-semibold font-mono">
                {macro.open > 0 ? Math.round((macro.escalatedOrCritical / macro.open) * 100) : 0}% of Open
              </span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-red-500 h-full rounded-full"
                style={{
                  width: `${macro.open > 0 ? Math.min(100, (macro.escalatedOrCritical / macro.open) * 100) : 0}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* KPI 3: Mean Redressal Pace */}
        <div className="bg-white p-4 rounded-xl border border-[#DCE3EC] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Mean Redressal Pace
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Icon name="clock" className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-[#102A43]">
              {macro.avgResolutionDays} <span className="text-xs font-normal text-slate-500">Days</span>
            </span>
            <span className="text-xs text-slate-600 font-medium bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              Target: 7.0d
            </span>
          </div>
          <div className="mt-2.5">
            <div className="flex justify-between text-[11px] text-slate-500 mb-1 font-medium">
              <span>Standard Performance</span>
              <span className={parseFloat(macro.avgResolutionDays) <= 7 ? 'text-emerald-700 font-semibold' : 'text-amber-700 font-semibold'}>
                {parseFloat(macro.avgResolutionDays) <= 7 ? 'Within Limit' : 'Over Limit'}
              </span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full"
                style={{
                  width: `${Math.min(100, (parseFloat(macro.avgResolutionDays) / 14) * 100)}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* KPI 4: SLA Attention Required */}
        <div className="bg-white p-4 rounded-xl border border-[#DCE3EC] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              SLA Attention Required
            </span>
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-700 flex items-center justify-center">
              <Icon name="alertTriangle" className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className={`text-2xl font-bold font-mono ${bureausNeedingAttention.length > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
              {bureausNeedingAttention.length} {bureausNeedingAttention.length === 1 ? 'Unit' : 'Units'}
            </span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${
              bureausNeedingAttention.length > 0
                ? 'text-red-700 bg-red-100/70 border-red-300'
                : 'text-emerald-700 bg-emerald-100/70 border-emerald-300'
            }`}>
              {bureausNeedingAttention.length > 0 ? 'Breached < 85%' : 'All Healthy'}
            </span>
          </div>
          <div className="mt-2.5">
            <div className="flex justify-between text-[11px] text-slate-500 mb-1 font-medium truncate">
              <span className="truncate">
                {bureausNeedingAttention[0] ? bureausNeedingAttention[0].name : 'No urgent breaches'}
              </span>
              <span className="text-red-700 font-bold shrink-0 ml-1">
                {bureausNeedingAttention[0] ? `${bureausNeedingAttention[0].sla}% SLA` : '100%'}
              </span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${bureausNeedingAttention.length > 0 ? 'bg-red-500' : 'bg-emerald-500'}`}
                style={{
                  width: `${bureausNeedingAttention[0] ? bureausNeedingAttention[0].sla : 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-3 rounded-xl border border-[#DCE3EC] shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Field */}
        <div className="relative flex-1 min-w-[260px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon name="search" className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search bureau name, code, nodal officer, or email..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-[#DCE3EC] rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all"
          />
        </div>

        {/* Filter Pills & Sorting */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterMode === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Units ({bureauData.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('high-workload')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterMode === 'high-workload'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            High Workload
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('attention')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              filterMode === 'attention'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 border border-amber-200/80 hover:bg-amber-100'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            SLA Attention (&lt;85%)
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('optimal')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterMode === 'optimal'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100'
            }`}
          >
            Optimal (≥90%)
          </button>

          <div className="h-5 w-px bg-slate-200 hidden sm:block mx-1" />

          {/* Sort Selector */}
          <div className="relative flex items-center">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pl-3 pr-7 py-1.5 rounded-lg bg-slate-50 border border-[#DCE3EC] text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer hover:bg-slate-100 transition-all"
            >
              <option value="open-desc">Sort by: Open Cases (High to Low)</option>
              <option value="sla-asc">Sort by: SLA (Lowest First)</option>
              <option value="sla-desc">Sort by: SLA (Highest First)</option>
              <option value="total-desc">Sort by: Total Case Volume</option>
              <option value="velocity-asc">Sort by: Resolution Velocity</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bureau Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredBureaus.map((b) => (
          <div
            key={b.id}
            className={`bg-white rounded-xl border shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden ${
              b.sla < 85 ? 'border-red-200 ring-1 ring-red-100' : 'border-[#DCE3EC]'
            }`}
          >
            <div className="p-4 flex flex-col gap-3.5">
              {/* SECTION A: Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200/80">
                      {b.id}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">Operational Division</span>
                  </div>
                  <h3 className="text-sm font-bold text-[#102A43] leading-snug">{b.name}</h3>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{b.email}</p>
                </div>
                <span
                  className={`shrink-0 px-2.5 py-1 rounded-full border text-[10px] font-semibold inline-flex items-center gap-1.5 uppercase tracking-wider ${b.statusBadge.badgeCls}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${b.statusBadge.dotCls}`} />
                  {b.statusBadge.label}
                </span>
              </div>

              {/* SECTION B: Nodal Officer */}
              <div className="bg-slate-50 border border-slate-200/70 p-2.5 rounded-lg flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                    {b.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{b.head}</p>
                    <p className="text-[10px] text-slate-500 truncate">Nodal Grievance Officer • {b.id}</p>
                  </div>
                </div>
                <span className="text-slate-400 p-1" title={b.email}>
                  <Icon name="info" className="h-4 w-4" />
                </span>
              </div>

              {/* SECTION C: Case Metrics Grid */}
              <div className="grid grid-cols-4 gap-2 text-center p-2 bg-slate-50 border border-slate-200/60 rounded-lg">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Total</span>
                  <span className="text-sm font-bold text-slate-900 mt-0.5 block font-mono">{b.total}</span>
                </div>
                <div className="border-l border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-blue-700 block">Open</span>
                  <span className="text-sm font-bold text-blue-700 mt-0.5 block font-mono">{b.open}</span>
                </div>
                <div className={`border-l border-slate-200 rounded py-0.5 ${b.escalated > 0 ? 'bg-red-50' : ''}`}>
                  <span className={`text-[10px] uppercase font-bold block ${b.escalated > 0 ? 'text-red-700' : 'text-slate-500'}`}>
                    Escalated
                  </span>
                  <span className={`text-sm font-bold mt-0.5 block font-mono ${b.escalated > 0 ? 'text-red-700' : 'text-slate-700'}`}>
                    {b.escalated}
                  </span>
                </div>
                <div className="border-l border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-emerald-700 block">Resolved</span>
                  <span className="text-sm font-bold text-emerald-700 mt-0.5 block font-mono">{b.resolved}</span>
                </div>
              </div>

              {/* SECTION D: SLA Performance & Velocity */}
              <div className="flex flex-col gap-1.5 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Statutory SLA Compliance</span>
                  <span className={`font-bold font-mono ${b.sla < 85 ? 'text-red-600' : 'text-emerald-700'}`}>
                    {b.sla}% <span className="text-slate-400 font-normal text-[10px]">(Target: 85%)</span>
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${b.sla < 85 ? 'bg-red-500' : 'bg-emerald-600'}`}
                    style={{ width: `${Math.min(100, Math.max(0, b.sla))}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-0.5">
                  <span>
                    Avg Redressal: <strong className="text-slate-900 font-semibold">{b.avgDays} Days</strong>
                  </span>
                  <span className="text-slate-400 text-[10px]">Benchmark: 7.0d</span>
                </div>
              </div>

              {/* SECTION E: Latest Complaint Preview */}
              {b.latestOpen ? (
                <button
                  type="button"
                  onClick={() => onSelect(b.latestOpen.id)}
                  className="bg-slate-50 hover:bg-blue-50/60 border border-slate-200/80 hover:border-blue-200 rounded-lg p-2.5 flex flex-col gap-1 text-left transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-semibold text-blue-700 group-hover:underline">
                      {b.latestOpen.id}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Priority: {b.latestOpen.priority}
                    </span>
                  </div>
                  <p className="text-xs text-slate-800 truncate font-medium">{b.latestOpen.title}</p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {institutionLabel(b.latestOpen.institutionId)}
                  </p>
                </button>
              ) : (
                <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 text-center text-[11px] text-slate-400">
                  No active open cases in this bureau
                </div>
              )}
            </div>

            {/* SECTION F: Footer Action */}
            <div className="bg-slate-50 border-t border-[#DCE3EC] px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] text-slate-500 font-mono">
                {b.open} active docket{b.open === 1 ? '' : 's'}
              </span>
              <button
                type="button"
                onClick={() => filterByBureau(b.id)}
                className="text-xs font-semibold text-blue-700 hover:text-blue-800 inline-flex items-center gap-1 transition-colors"
              >
                <span>Examine Bureau Docket ({b.total})</span>
                <Icon name="arrowRight" className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}

        {filteredBureaus.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-500 bg-white rounded-xl border border-[#DCE3EC]">
            <Icon name="info" className="h-8 w-8 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700 text-sm">No bureaus match your filter or search query</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting the search terms or selecting &quot;All Units&quot;.</p>
          </div>
        )}
      </div>
    </div>
  )
}

