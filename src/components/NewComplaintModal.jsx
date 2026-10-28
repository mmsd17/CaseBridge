import { useEffect, useState } from 'react'
import {
  BUREAUS,
  INSTITUTIONS,
  CATEGORIES,
  PRIORITIES,
  PRIORITY_SLA,
  ASSIGNEES,
  addDays,
  toISO,
  TODAY,
} from '../data/mockData.js'
import Icon from './Icon.jsx'

export default function NewComplaintModal({
  onClose,
  onCreate,
  institutions = INSTITUTIONS,
}) {
  const initialPriority = 'Medium'
  const initialDue = addDays(toISO(TODAY), PRIORITY_SLA[initialPriority] || 15)

  const [form, setForm] = useState({
    title: '',
    institutionId: '',
    bureauId: BUREAUS[0].id,
    category: CATEGORIES[0],
    priority: initialPriority,
    assignee: ASSIGNEES[0],
    dueDate: initialDue,
    status: 'New',
    filedBy: '',
    description: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function set(field, value) {
    setForm((f) => {
      const next = { ...f, [field]: value }
      if (field === 'priority') {
        next.dueDate = addDays(toISO(TODAY), PRIORITY_SLA[value] || 15)
      }
      return next
    })
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }))
    }
  }

  function validate() {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Complaint subject is required.'
    if (!form.institutionId) errs.institutionId = 'Please select the pertaining institution.'
    if (!form.bureauId) errs.bureauId = 'Bureau routing is required.'
    if (!form.description.trim()) errs.description = 'Please provide details of the complaint.'
    if (!form.dueDate) errs.dueDate = 'SLA due date is required.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function submit(e) {
    e.preventDefault()
    if (!validate()) return

    onCreate({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      filedBy: form.filedBy.trim() || 'Anonymous (Student/Citizen)',
    })
  }

  const selectedInst = institutions.find((i) => i.id === form.institutionId)

  const fieldClass =
    'w-full rounded-lg border border-[#DCE3EC] bg-white px-3 py-2 text-xs font-medium text-slate-800 outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600'
  const labelClass = 'mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-600'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]" onClick={onClose} />
      <form
        onSubmit={submit}
        className="thin-scroll relative max-h-[92vh] w-full max-w-[620px] overflow-y-auto rounded-xl bg-white shadow-2xl border border-[#DCE3EC]"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#DCE3EC] bg-white/95 px-6 py-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">assignment</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Register Manual Grievance</h2>
              <p className="text-xs text-slate-500">
                Log and route statutory petition under AICTE regulatory framework.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            aria-label="Close form"
          >
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="space-y-4 px-6 py-5">
          {/* Title */}
          <div>
            <label className={labelClass}>Complaint Subject / Title *</label>
            <input
              autoFocus
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="e.g., Mandatory caution deposit refund withheld past 30 days"
              className={fieldClass}
            />
            {errors.title && <p className="text-[11px] text-red-600 font-medium mt-1">{errors.title}</p>}
          </div>

          {/* Institution Selector */}
          <div>
            <label className={labelClass}>Institution *</label>
            <select
              value={form.institutionId}
              onChange={(e) => set('institutionId', e.target.value)}
              className={fieldClass}
            >
              <option value="">Select AICTE-approved institution…</option>
              {institutions.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name} ({i.code} • {i.city}, {i.state})
                </option>
              ))}
            </select>
            {errors.institutionId && (
              <p className="text-[11px] text-red-600 font-medium mt-1">{errors.institutionId}</p>
            )}
            {selectedInst && (
              <div className="mt-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs flex justify-between items-center text-slate-600">
                <span>
                  PID: <strong className="font-mono text-slate-800">{selectedInst.code}</strong> • {selectedInst.city}, {selectedInst.state}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {selectedInst.approval || 'Approved'}
                </span>
              </div>
            )}
          </div>

          {/* Routing & Official */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Bureau / Operational Cell *</label>
              <select
                value={form.bureauId}
                onChange={(e) => set('bureauId', e.target.value)}
                className={fieldClass}
              >
                {BUREAUS.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.id})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Assigned Nodal Officer</label>
              <select
                value={form.assignee}
                onChange={(e) => set('assignee', e.target.value)}
                className={fieldClass}
              >
                {ASSIGNEES.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category & Status */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Category</label>
              <select
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                className={fieldClass}
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Initial Caseload Status</label>
              <select
                value={form.status}
                onChange={(e) => set('status', e.target.value)}
                className={fieldClass}
              >
                <option value="New">New / Pending Ingestion</option>
                <option value="Under Review">Under Review</option>
                <option value="In Progress">In Progress</option>
              </select>
            </div>
          </div>

          {/* Priority & Due Date */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Statutory Priority & SLA</label>
              <div className="flex gap-1.5 pt-0.5">
                {PRIORITIES.map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => set('priority', p)}
                    className={`flex-1 rounded-lg py-1.5 text-xs font-semibold border transition ${
                      form.priority === p
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-[#DCE3EC] hover:bg-slate-100'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Standard SLA window: {PRIORITY_SLA[form.priority]} calendar days
              </p>
            </div>

            <div>
              <label className={labelClass}>SLA Due Date *</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => set('dueDate', e.target.value)}
                className={`${fieldClass} font-mono`}
              />
              {errors.dueDate && (
                <p className="text-[11px] text-red-600 font-medium mt-1">{errors.dueDate}</p>
              )}
            </div>
          </div>

          {/* Complainant Name */}
          <div>
            <label className={labelClass}>Petitioner / Complainant Identity</label>
            <input
              value={form.filedBy}
              onChange={(e) => set('filedBy', e.target.value)}
              placeholder="Name, roll number, or organization (leave blank for Anonymous filing)"
              className={fieldClass}
            />
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Complaint Description & Relief Sought *</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="State the facts of the grievance, dates of occurrence, affected departments, and relief requested under AICTE statutory norms…"
              className={`${fieldClass} resize-none`}
            />
            {errors.description && (
              <p className="text-[11px] text-red-600 font-medium mt-1">{errors.description}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex items-center justify-between border-t border-[#DCE3EC] bg-white/95 px-6 py-4 backdrop-blur">
          <span className="text-[11px] text-slate-400">
            A unique petition docket ID will be issued automatically.
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700 shadow-xs"
            >
              Register & Dispatch Docket
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
