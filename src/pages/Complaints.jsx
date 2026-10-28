import { useMemo } from 'react'
import {
  BUREAUS,
  INSTITUTIONS,
  STATUSES,
  PRIORITIES,
  isOpen,
  isOverdue,
  generateComplaintsCSV,
} from '../data/mockData.js'
import ComplaintTable from '../components/ComplaintTable.jsx'
import Icon from '../components/Icon.jsx'

const EMPTY_FILTERS = { q: '', bureau: 'All', status: 'All', priority: 'All', institution: 'All' }

export default function Complaints({
  complaints = [],
  institutions = INSTITUTIONS,
  filters = EMPTY_FILTERS,
  setFilters,
  onSelect,
  onNew,
}) {
  const merged = { ...EMPTY_FILTERS, ...filters }

  const filtered = useMemo(() => {
    const q = merged.q.trim().toLowerCase()
    return complaints.filter((c) => {
      const inst = institutions.find((i) => i.id === c.institutionId)
      const instStr = inst ? `${inst.name} ${inst.code} ${inst.city} ${inst.state}` : ''
      const searchTarget = `${c.id} ${c.title} ${c.description} ${c.category} ${c.filedBy} ${c.assignee} ${instStr}`.toLowerCase()

      if (q && !searchTarget.includes(q)) return false
      if (merged.bureau !== 'All' && c.bureauId !== merged.bureau) return false
      if (merged.status !== 'All' && c.status !== merged.status) return false
      if (merged.priority !== 'All' && c.priority !== merged.priority) return false
      if (merged.institution !== 'All' && c.institutionId !== merged.institution) return false
      return true
    })
  }, [complaints, institutions, merged.q, merged.bureau, merged.status, merged.priority, merged.institution])

  function set(key, value) {
    setFilters((f) => ({ ...EMPTY_FILTERS, ...f, [key]: value }))
  }

  function handleExportCSV() {
    const csv = generateComplaintsCSV(complaints, institutions)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `aicte_complaints_register_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const activeFilters =
    (merged.q ? 1 : 0) +
    ['bureau', 'status', 'priority', 'institution'].filter((k) => merged[k] !== 'All').length

  const openCount = complaints.filter(isOpen).length
  const criticalCount = complaints.filter(isOverdue).length
  const resolvedCount = complaints.filter((c) => !isOpen(c)).length

  return (
    <div className="space-y-6">
      {/* Page Header / Docket Title */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-[#DCE3EC] shadow-xs">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Complaints Register</h1>
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-mono text-xs font-semibold">
              {complaints.length} Petitions Registered
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Ingestion Sync
            </span>
          </div>
          <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
            Central audit log and statutory case management docket of all petitions submitted across technical institutions under AICTE regulatory purview.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 no-print">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[#DCE3EC] bg-white text-slate-700 hover:bg-slate-50 transition-colors text-xs font-semibold shadow-2xs"
            title="Download CSV report"
          >
            <Icon name="download" className="h-4 w-4 text-slate-600" />
            <span>Export Audit Docket</span>
          </button>
          <button
            onClick={onNew}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors text-xs font-semibold shadow-xs"
          >
            <Icon name="plus" className="h-4 w-4" />
            <span>+ Register Manual Grievance</span>
          </button>
        </div>
      </div>

      {/* 4 Refined KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-xl border border-[#DCE3EC] shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Complaints</span>
              <div className="flex items-baseline gap-2 mt-1.5">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">{complaints.length}</span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <Icon name="trend" className="h-3.5 w-3.5" /> +14 today
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
              <span className="material-symbols-outlined text-[20px]">inventory_2</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="truncate">Active Queue: <strong className="text-slate-800 font-semibold font-mono">{openCount}</strong> verified</span>
            <span className="text-slate-400 font-medium">Pan-India</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-xl border border-[#DCE3EC] shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Open &amp; In-Review</span>
              <div className="flex items-baseline gap-2 mt-1.5">
                <span className="text-3xl font-extrabold text-blue-700 tracking-tight font-sans">{openCount}</span>
                <span className="text-xs font-medium text-slate-500">active dossiers</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
              <span className="material-symbols-outlined text-[20px]">pending_actions</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-blue-700 font-medium">
            <Icon name="clock" className="h-3.5 w-3.5" />
            <span>{Math.round((openCount / (complaints.length || 1)) * 100)}% of total volume under inquiry</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-xl border border-red-200 bg-gradient-to-br from-white to-red-50/20 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-red-700 uppercase tracking-wider">Critical / Overdue</span>
              <div className="flex items-baseline gap-2 mt-1.5">
                <span className="text-3xl font-extrabold text-red-700 tracking-tight font-sans">{criticalCount}</span>
                <span className="text-xs font-semibold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">breached SLA</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-red-100 border border-red-200 flex items-center justify-center text-red-700 shrink-0">
              <Icon name="alert" className="h-5 w-5 text-red-700" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-red-100 flex items-center gap-1.5 text-[11px] text-red-700 font-semibold">
            <Icon name="alert" className="h-3.5 w-3.5 text-red-700" />
            <span>Requires immediate Nodal intervention</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-xl border border-[#DCE3EC] shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Successfully Resolved</span>
              <div className="flex items-baseline gap-2 mt-1.5">
                <span className="text-3xl font-extrabold text-emerald-700 tracking-tight font-sans">{resolvedCount}</span>
                <span className="text-xs font-medium text-slate-500">settled cases</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
              <Icon name="check" className="h-5 w-5 text-emerald-700" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold">
            <Icon name="verified" className="h-3.5 w-3.5" />
            <span>{Math.round((resolvedCount / (complaints.length || 1)) * 100)}% Redressal rate across terms</span>
          </div>
        </div>
      </div>

      {/* Spacious Search & Faceted Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-[#DCE3EC] shadow-xs space-y-3">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
          {/* Global search */}
          <div className="lg:col-span-5 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
              search
            </span>
            <input
              value={merged.q}
              onChange={(e) => set('q', e.target.value)}
              placeholder="Search by ID, keyword, institution, or officer..."
              className="w-full h-10 pl-9 pr-14 rounded-lg bg-slate-50/70 border border-[#DCE3EC] text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white font-medium"
            />
            {merged.q && (
              <button
                onClick={() => set('q', '')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <Icon name="close" className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Faceted Dropdowns */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* Bureau */}
            <select
              value={merged.bureau}
              onChange={(e) => set('bureau', e.target.value)}
              className="h-10 px-3 rounded-lg bg-slate-50 border border-[#DCE3EC] text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer truncate"
            >
              <option value="All">All Bureaus</option>
              {BUREAUS.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>

            {/* Status */}
            <select
              value={merged.status}
              onChange={(e) => set('status', e.target.value)}
              className="h-10 px-3 rounded-lg bg-slate-50 border border-[#DCE3EC] text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer truncate"
            >
              <option value="All">All Statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {/* Priority */}
            <select
              value={merged.priority}
              onChange={(e) => set('priority', e.target.value)}
              className="h-10 px-3 rounded-lg bg-slate-50 border border-[#DCE3EC] text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer truncate"
            >
              <option value="All">All Priorities</option>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  Priority: {p}
                </option>
              ))}
            </select>

            {/* Institution */}
            <select
              value={merged.institution}
              onChange={(e) => set('institution', e.target.value)}
              className="h-10 px-3 rounded-lg bg-slate-50 border border-[#DCE3EC] text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer truncate"
            >
              <option value="All">All Institutions</option>
              {institutions.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {activeFilters > 0 && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span>
              Showing <strong className="text-slate-800">{filtered.length}</strong> matching records out of {complaints.length} total.
            </span>
            <button
              onClick={() => setFilters(EMPTY_FILTERS)}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors flex items-center gap-1"
            >
              <Icon name="close" className="h-3 w-3" />
              <span>Clear All Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Primary Complaints Docket Table */}
      <ComplaintTable
        complaints={filtered}
        onSelect={onSelect}
        institutions={institutions}
      />

      {/* Statutory Escalation & SLA Notice Callouts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="bg-white p-5 rounded-xl border border-[#DCE3EC] shadow-xs flex items-start gap-3.5">
          <Icon name="verified" className="h-6 w-6 text-blue-700 shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-900">Statutory 30-Day Resolution SLA</span>
            <span className="text-xs text-slate-500 mt-1 leading-relaxed">
              All formal grievances must receive an inquiry officer appointment within 7 days and closure report in 30 days per AICTE (Redressal of Grievance of Students) Regulations.
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#DCE3EC] shadow-xs flex items-start gap-3.5">
          <Icon name="gavel" className="h-6 w-6 text-red-700 shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-900">Ombudsman Escalation Matrix</span>
            <span className="text-xs text-slate-500 mt-1 leading-relaxed">
              Grievances pending beyond designated SLA windows automatically transition to the Apex Monitoring Secretariat and regional joint director docket for show-cause proceedings.
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#DCE3EC] shadow-xs flex items-start gap-3.5">
          <Icon name="history" className="h-6 w-6 text-amber-700 shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-900">Autonomous Audit Trail</span>
            <span className="text-xs text-slate-500 mt-1 leading-relaxed">
              Every case disposition, status amendment, officer reassignment, and related-case confirmation is cryptographically timestamped in the operational activity log.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
