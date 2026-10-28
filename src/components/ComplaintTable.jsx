import { useState } from 'react'
import {
  STATUS_STYLE,
  PRIORITY_STYLE,
  formatDate,
  dueOnFor,
  isOverdue,
  daysOverdue,
  daysBetween,
  toISO,
  TODAY,
  institutionById,
  bureauName,
} from '../data/mockData.js'
import Icon from './Icon.jsx'

const PRIORITY_RANK = { Critical: 4, High: 3, Medium: 2, Low: 1 }

export function StatusPill({ status }) {
  const styles = {
    New: 'bg-blue-50 text-blue-700 border-blue-200',
    'Under Review': 'bg-violet-50 text-violet-700 border-violet-200',
    'In Progress': 'bg-amber-50 text-amber-800 border-amber-200',
    Escalated: 'bg-red-100 text-red-800 border-red-200 font-semibold',
    Resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold',
    Closed: 'bg-slate-100 text-slate-700 border-slate-200',
  }
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
        styles[status] || 'bg-slate-100 text-slate-700 border-slate-200'
      }`}
    >
      {status}
    </span>
  )
}

export function PriorityPill({ priority }) {
  const styles = {
    Critical: 'bg-red-50 text-red-700 border-red-200',
    High: 'bg-amber-50 text-amber-800 border-amber-200',
    Medium: 'bg-blue-50 text-blue-700 border-blue-200',
    Low: 'bg-slate-100 text-slate-600 border-slate-200',
  }
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
        styles[priority] || 'bg-slate-100 text-slate-600 border-slate-200'
      }`}
    >
      {priority}
    </span>
  )
}

export default function ComplaintTable({
  complaints = [],
  onSelect,
  institutions = [],
  compact = false,
}) {
  const [sort, setSort] = useState({ key: 'filedOn', dir: 'desc' })
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(compact ? 6 : 10)

  if (complaints.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-200 bg-white py-16 px-4 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          <Icon name="search" className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">No complaints match the current criteria</p>
          <p className="text-xs text-slate-500 mt-0.5">Try clearing active filters or modifying search keywords.</p>
        </div>
      </div>
    )
  }

  const sorted = [...complaints].sort((a, b) => {
    const dir = sort.dir === 'asc' ? 1 : -1
    if (sort.key === 'priority') return (PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]) * dir
    if (sort.key === 'due') return (dueOnFor(a) > dueOnFor(b) ? 1 : -1) * dir
    if (sort.key === 'id') return a.id.localeCompare(b.id) * dir
    return (a.filedOn > b.filedOn ? 1 : -1) * dir
  })

  const totalPages = Math.ceil(sorted.length / pageSize)
  const safePage = Math.min(page, Math.max(1, totalPages))
  const paginated = compact ? sorted.slice(0, pageSize) : sorted.slice((safePage - 1) * pageSize, safePage * pageSize)

  function toggleSort(key) {
    setSort((s) => ({ key, dir: s.key === key && s.dir === 'desc' ? 'asc' : 'desc' }))
  }

  function renderSlaBadge(c) {
    const due = dueOnFor(c)
    const overdue = isOverdue(c)
    if (['Resolved', 'Closed'].includes(c.status)) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-[11px] font-semibold whitespace-nowrap">
          <Icon name="check" className="h-3 w-3" />
          Resolved
        </span>
      )
    }
    if (overdue) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-100 border border-red-300 text-red-800 font-mono text-[11px] font-bold animate-pulse whitespace-nowrap">
          <Icon name="alert" className="h-3.5 w-3.5 text-red-700" />
          Overdue by {daysOverdue(c)}d
        </span>
      )
    }
    const daysLeft = daysBetween(toISO(TODAY), due)
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-mono text-[11px] whitespace-nowrap">
        <Icon name="clock" className="h-3 w-3 text-slate-400" />
        SLA in {daysLeft}d
      </span>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#DCE3EC] bg-white shadow-xs">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse min-w-[960px] text-xs">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#DCE3EC] text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4 w-36 min-w-[140px]">
                <button onClick={() => toggleSort('id')} className="inline-flex items-center gap-1 hover:text-slate-800">
                  Complaint ID
                  <span className="text-[9px] text-slate-400">{sort.key === 'id' && (sort.dir === 'asc' ? '▲' : '▼')}</span>
                </button>
              </th>
              <th className="py-3 px-4 min-w-[240px]">Nature of Grievance</th>
              <th className="py-3 px-4 min-w-[180px]">Institution & Jurisdiction</th>
              <th className="py-3 px-4 min-w-[160px]">Assigned Bureau / Cell</th>
              <th className="py-3 px-3 text-center min-w-[100px]">
                <button onClick={() => toggleSort('priority')} className="inline-flex items-center gap-1 hover:text-slate-800">
                  Priority
                  <span className="text-[9px] text-slate-400">{sort.key === 'priority' && (sort.dir === 'asc' ? '▲' : '▼')}</span>
                </button>
              </th>
              <th className="py-3 px-3 text-center min-w-[110px]">Status</th>
              <th className="py-3 px-4 min-w-[140px]">
                <button onClick={() => toggleSort('due')} className="inline-flex items-center gap-1 hover:text-slate-800">
                  SLA Status
                  <span className="text-[9px] text-slate-400">{sort.key === 'due' && (sort.dir === 'asc' ? '▲' : '▼')}</span>
                </button>
              </th>
              <th className="py-3 px-4 text-right min-w-[120px]">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {paginated.map((c) => {
              const inst = institutionById(c.institutionId, institutions)
              return (
                <tr
                  key={c.id}
                  onClick={() => onSelect(c.id)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 align-top">
                    <div className="flex flex-col">
                      <span className="font-mono text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {c.id}
                      </span>
                      <span className="text-[11px] text-slate-500 mt-0.5">Filed {formatDate(c.filedOn)}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 align-top max-w-[320px]">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-900 leading-snug line-clamp-2">
                        {c.title}
                      </span>
                      <span className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                        Category: <strong className="text-slate-700 font-medium">{c.category}</strong>
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 align-top">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-800 leading-snug truncate">
                        {inst?.name || c.institutionId}
                      </span>
                      <span className="text-[11px] text-slate-500 mt-0.5">
                        {inst ? `${inst.code} • ${inst.city}, ${inst.state}` : c.institutionId}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 align-top">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-slate-800 truncate">
                        {bureauName(c.bureauId)}
                      </span>
                      <span className="text-[11px] text-slate-500 mt-0.5 truncate">
                        {c.assignee || 'Unassigned'}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-3 align-top text-center">
                    <PriorityPill priority={c.priority} />
                  </td>

                  <td className="py-3.5 px-3 align-top text-center">
                    <StatusPill status={c.status} />
                  </td>

                  <td className="py-3.5 px-4 align-top">
                    {renderSlaBadge(c)}
                  </td>

                  <td className="py-3.5 px-4 align-top text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelect(c.id)
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-50 hover:bg-blue-600 hover:text-white border border-slate-200 text-blue-700 text-[11px] font-bold transition-all shadow-2xs"
                    >
                      <span>View Docket</span>
                      <Icon name="arrowRight" className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {!compact && (
        <div className="px-5 py-3.5 bg-slate-50 border-t border-[#DCE3EC] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <span>
              Showing <strong className="text-slate-900 font-semibold">{(safePage - 1) * pageSize + 1} to {Math.min(safePage * pageSize, sorted.length)}</strong> of <strong className="text-slate-900 font-semibold">{sorted.length}</strong> entries
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Show:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                  setPage(1)
                }}
                className="px-2.5 py-1 rounded-lg bg-white border border-[#DCE3EC] text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer shadow-2xs"
              >
                <option value={10}>10 rows</option>
                <option value={20}>20 rows</option>
                <option value={50}>50 rows</option>
              </select>
            </div>

            <nav aria-label="Pagination" className="flex items-center gap-1">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-2.5 py-1.5 rounded-lg border border-[#DCE3EC] bg-white text-slate-700 disabled:text-slate-300 disabled:cursor-not-allowed hover:bg-slate-100 font-semibold transition-colors flex items-center gap-1"
              >
                Prev
              </button>
              <span className="px-2 font-mono font-medium text-slate-700">
                {safePage} / {Math.max(1, totalPages)}
              </span>
              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-2.5 py-1.5 rounded-lg border border-[#DCE3EC] bg-white text-slate-700 disabled:text-slate-300 disabled:cursor-not-allowed hover:bg-slate-100 font-semibold transition-colors flex items-center gap-1"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      )}
    </div>
  )
}
