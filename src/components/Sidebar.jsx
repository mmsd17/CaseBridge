import Icon from './Icon.jsx'

export default function Sidebar({
  page,
  setPage,
  openCount = 0,
  institutionsCount = 12,
  onClose,
  onReset,
}) {
  const NAV = [
    { id: 'overview', label: 'Overview', icon: 'overview' },
    { id: 'complaints', label: 'Complaints Register', icon: 'complaints', badge: openCount, badgeColor: 'bg-red-600 text-white' },
    { id: 'bureaus', label: 'Bureaus & Cells', icon: 'bureaus', badge: 10, badgeColor: 'bg-slate-800 text-blue-200' },
    { id: 'institutions', label: 'Institutions', icon: 'school', badge: institutionsCount, badgeColor: 'bg-slate-800 text-slate-300' },
  ]

  return (
    <aside
      id="app-sidebar"
      className="flex h-full w-64 shrink-0 flex-col justify-between bg-[#0B1D30] text-slate-100 shadow-xl border-r border-slate-800"
      role="navigation"
      aria-label="Main Navigation"
    >
      <div className="flex flex-col">
        {/* Seal / Header */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-700/50 bg-[#071321] px-5 py-5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm ring-1 ring-blue-400/30">
              <span className="material-symbols-outlined text-[22px]">account_balance</span>
            </div>
            <div className="flex flex-col min-w-0 leading-tight">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-300">
                Govt. of India
              </span>
              <span className="truncate text-[15px] font-bold text-white">
                AICTE Redressal
              </span>
              <span className="truncate text-[11px] text-slate-400">
                Grievance Monitoring
              </span>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              type="button"
              className="ml-auto rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
              aria-label="Close navigation"
            >
              <Icon name="close" className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation Section Label */}
        <div className="px-5 pt-5 pb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Operational Console
          </span>
        </div>

        {/* Nav Items */}
        <nav className="flex flex-col gap-1 px-3">
          {NAV.map((item) => {
            const active = page === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  setPage(item.id)
                  onClose?.()
                }}
                className={`flex items-center justify-between rounded-lg px-3.5 py-2.5 text-left text-[13px] transition-colors ${
                  active
                    ? 'bg-blue-600 font-semibold text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    name={item.icon}
                    className={`h-[18px] w-[18px] shrink-0 ${active ? 'text-white' : 'text-slate-400'}`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`ml-2 rounded-full px-2 py-0.5 font-mono text-[11px] font-bold ${
                      active ? 'bg-white/20 text-white' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Bottom Controls */}
      <div className="border-t border-slate-700/50 bg-[#071321] p-4 flex flex-col gap-2.5">
        <div className="flex items-center justify-between rounded-lg border border-slate-700/60 bg-slate-900/80 px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[12px] font-medium text-slate-300">Portal Live • v2.4.1</span>
          </div>
          <Icon name="verified" className="h-4 w-4 text-slate-400" />
        </div>

        <div className="flex items-center justify-between rounded-lg bg-slate-800/90 px-3 py-1.5 text-[11px]">
          <span className="font-bold uppercase tracking-wider text-slate-400">Sandbox Mode</span>
          <button
            onClick={() => {
              if (window.confirm('Reset demo data? All newly added complaints, edits, and relationship decisions will revert to initial seed values.')) {
                onReset?.()
              }
            }}
            className="font-semibold text-amber-400 hover:text-amber-300 transition-colors"
          >
            Reset Data
          </button>
        </div>

        <div className="text-[11px] text-slate-400 px-1 leading-relaxed">
          Single-browser demo workspace. Changes are saved to local browser storage.
        </div>
      </div>
    </aside>
  )
}
