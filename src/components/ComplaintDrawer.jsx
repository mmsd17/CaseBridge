import { useEffect, useState } from 'react'
import {
  STATUSES,
  PRIORITIES,
  BUREAUS,
  ASSIGNEES,
  formatDate,
  dueOnFor,
  isOverdue,
  daysOpen,
  daysOverdue,
  institutionById,
  bureauName,
  findRelatedCandidates,
} from '../data/mockData.js'
import { StatusPill, PriorityPill } from './ComplaintTable.jsx'
import Icon from './Icon.jsx'

export default function ComplaintDrawer({
  complaint,
  allComplaints = [],
  institutions = [],
  relationships = {},
  onClose,
  onSaveComplaint,
  onRelationshipDecision,
  onSelectRelated,
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    title: '',
    status: 'New',
    bureauId: '',
    assignee: '',
    priority: 'Medium',
    dueDate: '',
    description: '',
  })
  const [actionNote, setActionNote] = useState('')
  const [justificationNote, setJustificationNote] = useState('')

  useEffect(() => {
    if (!complaint) return
    setEditForm({
      title: complaint.title || '',
      status: complaint.status || 'New',
      bureauId: complaint.bureauId || '',
      assignee: complaint.assignee || '',
      priority: complaint.priority || 'Medium',
      dueDate: dueOnFor(complaint),
      description: complaint.description || '',
    })
    setActionNote('')
    setIsEditing(false)
  }, [complaint?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!complaint) return null

  const inst = institutionById(complaint.institutionId, institutions)
  const due = dueOnFor(complaint)
  const overdue = isOverdue(complaint)

  // Find related candidates involving this complaint
  const relatedCases = findRelatedCandidates(allComplaints, relationships, institutions).filter(
    (cand) => cand.c1.id === complaint.id || cand.c2.id === complaint.id,
  )

  function handleSaveAll(e) {
    e?.preventDefault()
    onSaveComplaint(complaint.id, editForm, actionNote.trim())
    setIsEditing(false)
    setActionNote('')
  }

  function handleQuickStatus(newStatus) {
    setEditForm((prev) => ({ ...prev, status: newStatus }))
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] transition-opacity"
        onClick={onClose}
      />
      <div className="thin-scroll relative h-full w-full max-w-[560px] overflow-y-auto bg-white shadow-2xl flex flex-col justify-between">
        {/* Top Header */}
        <div>
          <div className="sticky top-0 z-20 border-b border-[#DCE3EC] bg-white/95 px-6 py-4 backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                    {complaint.id}
                  </span>
                  <StatusPill status={complaint.status} />
                  <PriorityPill priority={complaint.priority} />
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Filed on {formatDate(complaint.filedOn)} by <strong className="text-slate-700">{complaint.filedBy || 'Anonymous'}</strong>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    isEditing
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon name="history" className="h-3.5 w-3.5" />
                  <span>{isEditing ? 'Cancel Edit' : 'Edit Docket'}</span>
                </button>
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                  aria-label="Close complaint"
                >
                  <Icon name="close" className="h-4 w-4" />
                </button>
              </div>
            </div>

            {!isEditing ? (
              <h2 className="mt-3 text-base font-bold leading-snug text-slate-900">{complaint.title}</h2>
            ) : (
              <div className="mt-3">
                <label className="block text-[11px] font-semibold text-slate-500 uppercase">Subject Title</label>
                <input
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
            )}
          </div>

          {/* Body Content */}
          <div className="space-y-6 px-6 py-5">
            {/* Institution & Routing Card */}
            <div className="rounded-xl border border-[#DCE3EC] bg-slate-50/60 p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    Target Institution
                  </div>
                  <div className="mt-1 font-semibold text-slate-900">
                    {inst?.name || complaint.institutionId}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {inst ? `${inst.code} • ${inst.city}, ${inst.state}` : complaint.institutionId}
                  </div>
                  {inst?.approval && (
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-white border border-slate-200 text-slate-700">
                      AICTE: {inst.approval}
                    </span>
                  )}
                </div>

                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    Jurisdiction & Routing
                  </div>
                  {!isEditing ? (
                    <>
                      <div className="mt-1 font-semibold text-slate-900">
                        {bureauName(complaint.bureauId)}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Assigned Officer: <strong className="text-slate-700">{complaint.assignee || 'Unassigned'}</strong>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Category: <span className="font-medium text-slate-700">{complaint.category}</span>
                      </div>
                    </>
                  ) : (
                    <div className="mt-1 space-y-2">
                      <div>
                        <label className="text-[10px] text-slate-500 font-medium">Bureau / Cell</label>
                        <select
                          value={editForm.bureauId}
                          onChange={(e) => setEditForm({ ...editForm, bureauId: e.target.value })}
                          className="w-full mt-0.5 px-2 py-1 rounded border border-slate-300 text-xs bg-white text-slate-800"
                        >
                          {BUREAUS.map((b) => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 font-medium">Responsible Official</label>
                        <select
                          value={editForm.assignee}
                          onChange={(e) => setEditForm({ ...editForm, assignee: e.target.value })}
                          className="w-full mt-0.5 px-2 py-1 rounded border border-slate-300 text-xs bg-white text-slate-800"
                        >
                          {ASSIGNEES.map((a) => (
                            <option key={a} value={a}>{a}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* SLA & Deadlines */}
              <div className="mt-3 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">SLA Due Date:</span>
                  {!isEditing ? (
                    <strong className={overdue ? 'text-red-700 font-bold' : 'text-slate-800'}>
                      {formatDate(due)} {overdue && `(${daysOverdue(complaint)}d overdue)`}
                    </strong>
                  ) : (
                    <input
                      type="date"
                      value={editForm.dueDate}
                      onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                      className="px-2 py-0.5 rounded border border-slate-300 text-xs text-slate-800 font-mono"
                    />
                  )}
                </div>
                <div className="text-slate-500">
                  Total days {complaint.resolvedOn ? 'to resolution' : 'in queue'}:{' '}
                  <strong className="text-slate-800 font-mono">{daysOpen(complaint)}d</strong>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="rounded-xl border border-[#DCE3EC] bg-white p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Grievance Summary & Facts
                </span>
                <span className="text-[10px] font-mono text-slate-400">Statutory Record</span>
              </div>
              {!isEditing ? (
                <p className="text-xs leading-relaxed text-slate-700 whitespace-pre-wrap">
                  {complaint.description}
                </p>
              ) : (
                <textarea
                  rows={4}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              )}
            </div>

            {/* RELATED-CASE REVIEW SECTION (Crucial Feature) */}
            <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Related-Case Detection & Review
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[10px] font-bold">
                  {relatedCases.length} Candidate{relatedCases.length !== 1 ? 's' : ''}
                </span>
              </div>

              <p className="text-[11px] text-slate-600 mb-3">
                Transparent matching engine identifies co-occurring grievances by institutional ID, category, or cross-cutting keywords. Candidates require officer review.
              </p>

              {relatedCases.length === 0 ? (
                <div className="text-center py-4 bg-white/80 rounded-lg border border-dashed border-blue-200 text-xs text-slate-500">
                  No overlapping complaints detected for this case.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {relatedCases.map((cand) => {
                    const other = cand.c1.id === complaint.id ? cand.c2 : cand.c1
                    const otherInst = institutionById(other.institutionId, institutions)

                    return (
                      <div
                        key={cand.pairKey}
                        className="p-3 bg-white rounded-lg border border-[#DCE3EC] shadow-2xs space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => onSelectRelated?.(other.id)}
                                className="font-mono text-xs font-bold text-blue-700 hover:underline"
                              >
                                {other.id}
                              </button>
                              <span
                                className={`px-2 py-0.2 rounded-full text-[10px] font-semibold uppercase ${
                                  cand.status === 'confirmed'
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                    : cand.status === 'dismissed'
                                    ? 'bg-slate-100 text-slate-600'
                                    : 'bg-amber-100 text-amber-900 border border-amber-200'
                                }`}
                              >
                                {cand.status === 'confirmed' ? 'Confirmed Match' : cand.status === 'dismissed' ? 'Dismissed' : 'Candidate (Unconfirmed)'}
                              </span>
                            </div>
                            <div className="text-xs font-semibold text-slate-800 mt-0.5 line-clamp-1">
                              {other.title}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {otherInst?.name || other.institutionId} • Priority: <strong>{other.priority}</strong>
                            </div>
                          </div>
                        </div>

                        {/* Match Explanation */}
                        <div className="text-[11px] bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-slate-700">
                          <strong className="text-blue-900 font-semibold">{cand.matchType}:</strong> {cand.matchReason}
                        </div>

                        {/* Decision Details if reviewed */}
                        {cand.status !== 'candidate' && (
                          <div className="text-[11px] text-slate-500 italic">
                            Decision recorded on {formatDate(cand.reviewedAt)} by {cand.reviewedBy || 'Secretariat Officer'}.
                            {cand.reviewReason && ` Note: "${cand.reviewReason}"`}
                          </div>
                        )}

                        {/* Actions for Candidate */}
                        {cand.status === 'candidate' && (
                          <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                            <input
                              type="text"
                              placeholder="Optional review reason / justification..."
                              value={justificationNote}
                              onChange={(e) => setJustificationNote(e.target.value)}
                              className="flex-1 px-2.5 py-1 text-[11px] rounded border border-slate-300 text-slate-800 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                onRelationshipDecision(cand.pairKey, 'confirmed', justificationNote.trim())
                                setJustificationNote('')
                              }}
                              className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] transition-colors"
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                onRelationshipDecision(cand.pairKey, 'dismissed', justificationNote.trim())
                                setJustificationNote('')
                              }}
                              className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-[11px] transition-colors"
                            >
                              Dismiss
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* ACTION TIMELINE & AUDIT HISTORY */}
            <div className="rounded-xl border border-[#DCE3EC] bg-white p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon name="history" className="h-4 w-4 text-slate-600" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Action Tracking & Audit Trail
                  </h3>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {complaint.timeline?.length || 0} Events
                </span>
              </div>

              <ol className="relative ml-2 space-y-4 border-l border-slate-200 pl-5 text-xs">
                {complaint.timeline?.map((t, i) => (
                  <li key={i} className="relative">
                    <span
                      className={`absolute -left-[27px] top-0.5 h-3 w-3 rounded-full border-2 border-white ${
                        i === complaint.timeline.length - 1 ? 'bg-blue-600 ring-2 ring-blue-100' : 'bg-slate-300'
                      }`}
                    />
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="font-semibold text-slate-800">{t.action}</div>
                      <time className="whitespace-nowrap font-mono text-[10px] text-slate-400">
                        {formatDate(t.date)}
                      </time>
                    </div>
                    <div className="text-[11px] text-blue-700 font-medium">{t.by}</div>
                    {t.note && (
                      <p className="mt-0.5 text-[11px] leading-relaxed text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                        {t.note}
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* Bottom Update / Save Bar */}
        <div className="sticky bottom-0 z-20 border-t border-[#DCE3EC] bg-white p-4 shadow-lg">
          <form onSubmit={handleSaveAll} className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-slate-700 uppercase">Update Status</span>
                <span className="text-[10px] text-slate-400">Current: {editForm.status}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {STATUSES.map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => handleQuickStatus(s)}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
                      editForm.status === s
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                Action Remark / Progress Note
              </label>
              <textarea
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                rows={2}
                placeholder="Log procedural step, inquiry notice, or resolution remark into audit timeline…"
                className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] text-slate-400">
                Updates are automatically recorded to the audit history.
              </span>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                Save & Update Timeline
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
