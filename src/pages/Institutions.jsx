import { useMemo, useState } from 'react'
import { isOpen, isOverdue } from '../data/mockData.js'
import Icon from '../components/Icon.jsx'

const APPROVAL_STYLE = {
  Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Provisional: 'bg-amber-50 text-amber-800 border-amber-200',
  Restricted: 'bg-red-50 text-red-700 border-red-200',
  'Notice Issued': 'bg-purple-50 text-purple-700 border-purple-200',
}

const TYPES = ['All Types', 'Engineering', 'Management', 'Polytechnic', 'Pharmacy', 'Architecture']
const STATUSES = ['All Statuses', 'Approved', 'Provisional', 'Restricted', 'Notice Issued']

export default function Institutions({
  complaints = [],
  institutions = [],
  onSelect,
  filterByInstitution,
  onAddInstitution,
  onUpdateInstitution,
}) {
  const [q, setQ] = useState('')
  const [typeFilter, setTypeFilter] = useState('All Types')
  const [statusFilter, setStatusFilter] = useState('All Statuses')
  const [sortBy, setSortBy] = useState('open')

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingInst, setEditingInst] = useState(null)
  const [profileInst, setProfileInst] = useState(null)

  // Form states for Add / Edit
  const [form, setForm] = useState({
    id: '',
    name: '',
    code: '',
    city: '',
    state: '',
    type: 'Engineering',
    approval: 'Approved',
    validTill: '2027-06-30',
  })
  const [formError, setFormError] = useState('')

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase()
    return institutions
      .map((i) => {
        const own = complaints.filter((c) => c.institutionId === i.id)
        const open = own.filter(isOpen)
        return {
          ...i,
          total: own.length,
          open: open.length,
          escalated: open.filter((c) => c.status === 'Escalated').length,
          overdue: own.filter(isOverdue).length,
          risk: own.filter((c) => c.priority === 'Critical').length,
        }
      })
      .filter((i) => {
        if (typeFilter !== 'All Types' && i.type !== typeFilter) return false
        if (statusFilter !== 'All Statuses' && i.approval !== statusFilter) return false
        if (!term) return true
        return `${i.name} ${i.city} ${i.state} ${i.code} ${i.type}`.toLowerCase().includes(term)
      })
      .sort((a, b) => {
        if (sortBy === 'open') return b.open - a.open || b.total - a.total
        if (sortBy === 'total') return b.total - a.total
        if (sortBy === 'name') return a.name.localeCompare(b.name)
        if (sortBy === 'overdue') return b.overdue - a.overdue
        return 0
      })
  }, [complaints, institutions, q, typeFilter, statusFilter, sortBy])

  const flagged = rows.filter((i) => i.risk > 0 || i.approval === 'Restricted' || i.overdue > 0).length

  function openCreate() {
    // Generate next IN-XX id
    const existingSeqs = institutions
      .map((i) => Number(i.id.replace('IN-', '')))
      .filter((n) => !isNaN(n))
    const nextSeq = (existingSeqs.length ? Math.max(...existingSeqs) : 0) + 1
    const id = `IN-${String(nextSeq).padStart(2, '0')}`

    setForm({
      id,
      name: '',
      code: `AIC-${String(Math.floor(1000 + Math.random() * 9000))}`,
      city: '',
      state: '',
      type: 'Engineering',
      approval: 'Approved',
      validTill: '2027-06-30',
    })
    setFormError('')
    setEditingInst(null)
    setShowAddModal(true)
  }

  function openEdit(inst) {
    setForm({ ...inst })
    setFormError('')
    setEditingInst(inst)
    setShowAddModal(true)
  }

  function handleSave(e) {
    e.preventDefault()
    if (!form.name.trim()) return setFormError('Institution name is required.')
    if (!form.code.trim()) return setFormError('Permanent Institute ID / Code is required.')
    if (!form.city.trim()) return setFormError('City is required.')
    if (!form.state.trim()) return setFormError('State is required.')

    // Check unique code/PID if adding or if code changed
    const duplicate = institutions.find(
      (i) => i.code.toLowerCase() === form.code.trim().toLowerCase() && i.id !== form.id,
    )
    if (duplicate) {
      return setFormError(`PID code "${form.code}" already belongs to "${duplicate.name}".`)
    }

    if (editingInst) {
      onUpdateInstitution(form.id, form)
    } else {
      onAddInstitution(form)
    }

    setShowAddModal(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-[#DCE3EC] shadow-xs">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Institutions Registry</h1>
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-mono text-xs font-semibold">
              {institutions.length} Monitored Campuses
            </span>
            {flagged > 0 && (
              <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                {flagged} Under Regulatory Review
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Statutory registry of AICTE-approved institutions with active grievance metrics, compliance accreditation health, and regional tracking.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-xs shrink-0 no-print"
        >
          <Icon name="plus" className="h-4 w-4" />
          <span>+ Add Institution</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-[#DCE3EC] shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          <div className="lg:col-span-5 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
              search
            </span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search institution name, PID code, city, or state..."
              className="w-full h-10 pl-9 pr-8 rounded-lg bg-slate-50 border border-[#DCE3EC] text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white font-medium"
            />
            {q && (
              <button
                onClick={() => setQ('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <Icon name="close" className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-10 px-3 rounded-lg bg-slate-50 border border-[#DCE3EC] text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-3 rounded-lg bg-slate-50 border border-[#DCE3EC] text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-10 px-3 rounded-lg bg-slate-50 border border-[#DCE3EC] text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
            >
              <option value="open">Sort: Active Grievances</option>
              <option value="overdue">Sort: Past SLA</option>
              <option value="total">Sort: Total Grievances</option>
              <option value="name">Sort: Institution Name</option>
            </select>
          </div>
        </div>

        {(q || typeFilter !== 'All Types' || statusFilter !== 'All Statuses') && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span>Filtered: Showing {rows.length} of {institutions.length} institutions</span>
            <button
              onClick={() => {
                setQ('')
                setTypeFilter('All Types')
                setStatusFilter('All Statuses')
              }}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Primary Registry Table */}
      <div className="overflow-hidden rounded-xl border border-[#DCE3EC] bg-white shadow-xs">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[960px] text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#DCE3EC] text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 min-w-[260px]">Institution Name &amp; PID</th>
                <th className="py-3 px-4 min-w-[130px]">Type</th>
                <th className="py-3 px-3 text-center min-w-[120px]">AICTE Status</th>
                <th className="py-3 px-3 text-center min-w-[90px]">Total Cases</th>
                <th className="py-3 px-3 text-center min-w-[90px]">Open Cases</th>
                <th className="py-3 px-3 text-center min-w-[90px]">Past SLA</th>
                <th className="py-3 px-4 text-right min-w-[170px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {rows.map((i) => (
                <tr key={i.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900 text-xs">{i.name}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      <span className="font-mono font-medium text-slate-700">{i.code}</span> • {i.city}, {i.state} • Valid till {i.validTill}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-slate-700 font-medium">
                    {i.type}
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${
                        APPROVAL_STYLE[i.approval] || 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {i.approval}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-center font-mono text-slate-700">
                    {i.total}
                  </td>

                  <td className="py-3 px-3 text-center font-mono font-bold text-blue-700">
                    {i.open}
                  </td>

                  <td className="py-3 px-3 text-center font-mono">
                    <span className={i.overdue > 0 ? 'text-red-700 font-bold' : 'text-slate-400'}>
                      {i.overdue}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(i)}
                        className="px-2.5 py-1 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-semibold transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => filterByInstitution(i.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-600 hover:text-white border border-blue-200 text-blue-700 text-[11px] font-bold transition-colors shadow-2xs"
                      >
                        <span>View ({i.total})</span>
                        <Icon name="arrowRight" className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No institutions match the filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Institution Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]"
            onClick={() => setShowAddModal(false)}
          />
          <form
            onSubmit={handleSave}
            className="relative max-h-[92vh] w-full max-w-[520px] overflow-y-auto rounded-xl bg-white shadow-2xl border border-[#DCE3EC]"
          >
            <div className="flex items-center justify-between border-b border-[#DCE3EC] px-6 py-4">
              <h2 className="text-base font-bold text-slate-900">
                {editingInst ? 'Edit Institution Record' : 'Register AICTE Institution'}
              </h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 text-slate-700"
              >
                <Icon name="close" className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 px-6 py-5 text-xs">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Institution Name *
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Sardar Vallabhbhai National Institute of Tech"
                  className="w-full px-3 py-2 rounded-lg border border-[#DCE3EC] text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Permanent ID (PID) *
                  </label>
                  <input
                    required
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    placeholder="AIC-EN-1042"
                    className="w-full px-3 py-2 rounded-lg border border-[#DCE3EC] font-mono text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Institution Type
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#DCE3EC] bg-white text-slate-800 text-xs focus:outline-none"
                  >
                    {TYPES.filter((t) => t !== 'All Types').map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    City *
                  </label>
                  <input
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="Chennai"
                    className="w-full px-3 py-2 rounded-lg border border-[#DCE3EC] text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    State *
                  </label>
                  <input
                    required
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    placeholder="Tamil Nadu"
                    className="w-full px-3 py-2 rounded-lg border border-[#DCE3EC] text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    AICTE Approval Status
                  </label>
                  <select
                    value={form.approval}
                    onChange={(e) => setForm({ ...form, approval: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#DCE3EC] bg-white text-slate-800 text-xs focus:outline-none"
                  >
                    {STATUSES.filter((s) => s !== 'All Statuses').map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Valid Till Date
                  </label>
                  <input
                    type="date"
                    value={form.validTill}
                    onChange={(e) => setForm({ ...form, validTill: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-[#DCE3EC] font-mono text-slate-800 text-xs focus:outline-none"
                  />
                </div>
              </div>

              {formError && (
                <p className="p-2.5 rounded bg-red-50 text-red-700 font-medium text-xs border border-red-200">
                  {formError}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-[#DCE3EC] px-6 py-4">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
              >
                {editingInst ? 'Save Changes' : 'Register Institution'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
