import { useEffect, useState, useRef } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Overview from './pages/Overview.jsx'
import Complaints from './pages/Complaints.jsx'
import Bureaus from './pages/Bureaus.jsx'
import Institutions from './pages/Institutions.jsx'
import ComplaintDrawer from './components/ComplaintDrawer.jsx'
import NewComplaintModal from './components/NewComplaintModal.jsx'
import Icon from './components/Icon.jsx'
import {
  INITIAL_COMPLAINTS,
  INSTITUTIONS,
  isOpen,
  toISO,
  TODAY,
  formatDate,
} from './data/mockData.js'
import {
  loadComplaints,
  saveComplaints,
  loadInstitutions,
  saveInstitutions,
  loadRelationships,
  saveRelationships,
  resetAllStoredData,
} from './lib/store.js'

const PAGE_TITLES = {
  overview: 'Overview',
  complaints: 'Complaints Register',
  bureaus: 'Bureaus & Operational Cells',
  institutions: 'Institutions Registry',
}

const EMPTY_FILTERS = { q: '', bureau: 'All', status: 'All', priority: 'All', institution: 'All' }

export default function App() {
  const [complaints, setComplaints] = useState(loadComplaints)
  const [institutions, setInstitutions] = useState(loadInstitutions)
  const [relationships, setRelationships] = useState(loadRelationships)

  const [page, setPage] = useState('overview')
  const [selectedId, setSelectedId] = useState(null)
  const [showNew, setShowNew] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [globalSearch, setGlobalSearch] = useState('')

  const searchInputRef = useRef(null)

  const selected = complaints.find((c) => c.id === selectedId) || null
  const openCount = complaints.filter(isOpen).length

  // Toast auto-dismiss
  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 3000)
    return () => window.clearTimeout(t)
  }, [toast])

  // Sync state to localStorage
  useEffect(() => {
    saveComplaints(complaints)
  }, [complaints])

  useEffect(() => {
    saveInstitutions(institutions)
  }, [institutions])

  useEffect(() => {
    saveRelationships(relationships)
  }, [relationships])

  // Ctrl+K keyboard shortcut to focus global search
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Full sandbox reset
  function resetDemo() {
    resetAllStoredData()
    setComplaints(INITIAL_COMPLAINTS)
    setInstitutions(INSTITUTIONS)
    setRelationships({})
    setFilters(EMPTY_FILTERS)
    setGlobalSearch('')
    setToast('Sandbox data reset to official demonstration state')
  }

  // Register new complaint
  function addComplaint(data) {
    const nums = complaints.map((c) => {
      const match = c.id.match(/\d+$/)
      return match ? parseInt(match[0], 10) : 0
    })
    const nextSeq = (nums.length ? Math.max(...nums) : 1000) + 1
    const id = `AIT/2026/${String(nextSeq).padStart(4, '0')}`
    const filedOn = toISO(TODAY)

    const created = {
      ...data,
      id,
      filedOn,
      assignee: data.assignee || 'Sh. A. Kulkarni (DS)',
      resolvedOn: null,
      timeline: [
        {
          date: filedOn,
          action: 'Complaint registered',
          by: 'AICTE Grievance Portal',
          note: `Statutory case lodged under category "${data.category}". Initial SLA assigned.`,
        },
        {
          date: filedOn,
          action: `Assigned to ${data.assignee || 'Sh. A. Kulkarni (DS)'}`,
          by: 'Secretariat Cell',
          note: `Transferred to nodal officer for preliminary investigation.`,
        },
      ],
    }

    setComplaints((prev) => [created, ...prev])
    setShowNew(false)
    setSelectedId(id)
    setToast(`Complaint ${id} registered and added to active queue`)
  }

  // Save updates made in the Complaint Drawer
  function saveComplaint(id, updates, actionNote) {
    const today = toISO(TODAY)
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c

        const statusChanged = updates.status && updates.status !== c.status
        const newStatus = updates.status || c.status
        const isNowResolved = ['Resolved', 'Closed'].includes(newStatus)
        const resolvedOn = isNowResolved ? c.resolvedOn || today : null

        const changes = []
        if (statusChanged) changes.push(`Status changed from ${c.status} to ${newStatus}`)
        if (updates.bureauId && updates.bureauId !== c.bureauId) changes.push(`Bureau reallocated to ${updates.bureauId}`)
        if (updates.assignee && updates.assignee !== c.assignee) changes.push(`Officer reassigned to ${updates.assignee}`)
        if (updates.priority && updates.priority !== c.priority) changes.push(`Priority set to ${updates.priority}`)
        if (updates.dueDate && updates.dueDate !== c.dueDate) changes.push(`SLA target updated to ${updates.dueDate}`)

        const timelineEntry = {
          date: today,
          action: changes.length ? changes.join('; ') : 'Docket details updated',
          by: 'Dr. V. Swaminathan (Director)',
          note: actionNote || 'Statutory review action recorded in case ledger.',
        }

        return {
          ...c,
          ...updates,
          resolvedOn,
          timeline: [...(c.timeline || []), timelineEntry],
        }
      })
    )
    setToast(`Docket ${id} record successfully updated`)
  }

  // Handle Related-Case Confirm or Dismiss
  function handleRelationshipDecision(pairKey, decision, reason) {
    const today = toISO(TODAY)
    const officer = 'Dr. V. Swaminathan (Director)'
    const defaultReason = decision === 'confirmed'
      ? 'Verified institutional cluster / duplicate grievance'
      : 'Dismissed candidate; independent distinct grievance'
    const finalReason = reason && reason.trim() ? reason.trim() : defaultReason

    setRelationships((prev) => ({
      ...prev,
      [pairKey]: {
        status: decision,
        timestamp: today,
        officer,
        reason: finalReason,
      },
    }))

    // Append audit log to both complaints
    const [idA, idB] = pairKey.includes('__') ? pairKey.split('__') : pairKey.split('::')
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === idA || c.id === idB) {
          const otherId = c.id === idA ? idB : idA
          const auditAction = decision === 'confirmed'
            ? `Related-Case Confirmed: linked with ${otherId}`
            : `Related-Case Dismissed: candidate ${otherId} dismissed`

          return {
            ...c,
            timeline: [
              ...(c.timeline || []),
              {
                date: today,
                action: auditAction,
                by: officer,
                note: finalReason,
              },
            ],
          }
        }
        return c
      })
    )

    setToast(
      decision === 'confirmed'
        ? `Case relationship confirmed and linked in audit trail`
        : `Candidate pair dismissed from review queue`
    )
  }

  // Add Institution
  function addInstitution(data) {
    setInstitutions((prev) => [...prev, data])
    setToast(`Institution "${data.name}" registered in registry`)
  }

  // Update Institution
  function updateInstitution(id, data) {
    setInstitutions((prev) => prev.map((i) => (i.id === id ? { ...i, ...data } : i)))
    setToast(`Institution "${data.name}" record updated`)
  }

  // Filter shortcuts from other pages
  function filterByInstitution(id) {
    setFilters({ ...EMPTY_FILTERS, institution: id })
    setPage('complaints')
  }

  function filterByBureau(id) {
    setFilters({ ...EMPTY_FILTERS, bureau: id })
    setPage('complaints')
  }

  // Handle global search input
  function handleGlobalSearchSubmit(e) {
    e.preventDefault()
    if (globalSearch.trim()) {
      setFilters({ ...EMPTY_FILTERS, q: globalSearch.trim() })
      setPage('complaints')
    }
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-[#F5F7FA]">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          page={page}
          setPage={setPage}
          openCount={openCount}
          institutionsCount={institutions.length}
          onReset={resetDemo}
        />
      </div>

      {/* Mobile Drawer Sidebar */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMenuOpen(false)}
          />
          <div className="relative z-10">
            <Sidebar
              page={page}
              setPage={(p) => {
                setPage(p)
                setMenuOpen(false)
              }}
              openCount={openCount}
              institutionsCount={institutions.length}
              onClose={() => setMenuOpen(false)}
              onReset={resetDemo}
            />
          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Institutional Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#DCE3EC] bg-white px-4 sm:px-6 lg:px-8 shadow-xs z-30">
          <div className="flex items-center gap-3 sm:gap-6 flex-1 max-w-2xl min-w-0">
            {/* Mobile Sidebar Toggle Button */}
            <button
              onClick={() => setMenuOpen(true)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-700 hover:text-blue-700 hover:bg-slate-100 lg:hidden transition-colors"
              aria-label="Open Navigation Menu"
            >
              <Icon name="menu" className="h-5 w-5" />
            </button>

            {/* Breadcrumb Title */}
            <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0">
              <span className="font-bold text-blue-700 tracking-wide">AICTE</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-800 font-semibold hidden sm:inline">
                {PAGE_TITLES[page]}
              </span>
              <span className="text-slate-800 font-semibold sm:hidden">
                {page.toUpperCase()}
              </span>
            </div>

            {/* Global Search Input */}
            <form onSubmit={handleGlobalSearchSubmit} className="relative w-full max-w-md hidden md:block">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Icon name="search" className="h-4 w-4" />
              </span>
              <input
                ref={searchInputRef}
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Search Complaint ID, Bureau, or Institution..."
                className="w-full pl-9 pr-14 py-1.5 text-xs bg-slate-50 border border-[#DCE3EC] rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-all"
              />
              <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded shadow-2xs pointer-events-none">
                Ctrl+K
              </kbd>
            </form>
          </div>

          {/* Right Header Controls & Profile */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Statutory Helpline Indicator */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs border border-slate-200/80">
              <span className="text-blue-700 font-semibold">
                <Icon name="info" className="h-3.5 w-3.5" />
              </span>
              <span className="font-medium text-[11px]">Helpline: 1800-11-2244</span>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setPage('complaints')}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                title={`${openCount} active complaints pending action`}
              >
                <Icon name="bell" className="h-4 w-4" />
              </button>
              {openCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-600 ring-2 ring-white" />
              )}
            </div>

            <div className="h-6 w-px bg-slate-200 hidden sm:block" />

            {/* Officer Profile Badge */}
            <div className="flex items-center gap-2.5 pl-1">
              <div className="w-8 h-8 rounded-full bg-[#0B2545] text-white flex items-center justify-center font-bold text-xs ring-2 ring-blue-600/20 shadow-2xs">
                VS
              </div>
              <div className="hidden sm:flex flex-col text-left leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900">Dr. V. Swaminathan</span>
                  <span className="px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 font-bold text-[9px] uppercase tracking-wide">
                    DIRECTOR
                  </span>
                </div>
                <span className="text-[10px] text-slate-500">Central Operations Bureau</span>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable View Surface */}
        <main className="thin-scroll flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1360px]">
            {page === 'overview' && (
              <Overview
                complaints={complaints}
                institutions={institutions}
                relationships={relationships}
                onSelect={setSelectedId}
                goComplaints={() => setPage('complaints')}
                onRelationshipDecision={handleRelationshipDecision}
              />
            )}
            {page === 'complaints' && (
              <Complaints
                complaints={complaints}
                institutions={institutions}
                filters={filters}
                setFilters={setFilters}
                onSelect={setSelectedId}
                onNew={() => setShowNew(true)}
              />
            )}
            {page === 'bureaus' && (
              <Bureaus
                complaints={complaints}
                onSelect={setSelectedId}
                filterByBureau={filterByBureau}
              />
            )}
            {page === 'institutions' && (
              <Institutions
                complaints={complaints}
                institutions={institutions}
                onSelect={setSelectedId}
                filterByInstitution={filterByInstitution}
                onAddInstitution={addInstitution}
                onUpdateInstitution={updateInstitution}
              />
            )}
          </div>
        </main>
      </div>

      {/* Slide-over Complaint Details & Action Drawer */}
      {selected && (
        <ComplaintDrawer
          complaint={selected}
          allComplaints={complaints}
          institutions={institutions}
          relationships={relationships}
          onClose={() => setSelectedId(null)}
          onSaveComplaint={saveComplaint}
          onRelationshipDecision={handleRelationshipDecision}
          onSelectRelated={(id) => setSelectedId(id)}
        />
      )}

      {/* Register New Complaint Modal */}
      {showNew && (
        <NewComplaintModal
          institutions={institutions}
          onClose={() => setShowNew(false)}
          onCreate={addComplaint}
        />
      )}

      {/* Floating Status Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[80] flex items-center gap-2 rounded-lg bg-slate-900 text-white px-4 py-2.5 text-xs font-semibold shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  )
}

