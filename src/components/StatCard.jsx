import Icon from './Icon.jsx'

const TONES = {
  blue: {
    bg: 'bg-blue-50 text-blue-700 border-blue-200',
    val: 'text-slate-900',
  },
  amber: {
    bg: 'bg-amber-50 text-amber-800 border-amber-200',
    val: 'text-slate-900',
  },
  red: {
    bg: 'bg-red-50 text-red-700 border-red-200',
    val: 'text-red-700',
  },
  green: {
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    val: 'text-slate-900',
  },
  violet: {
    bg: 'bg-violet-50 text-violet-700 border-violet-200',
    val: 'text-slate-900',
  },
  slate: {
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    val: 'text-slate-900',
  },
}

export default function StatCard({ label, value, sub, icon = 'complaints', tone = 'blue', badge }) {
  const t = TONES[tone] || TONES.blue

  return (
    <div className="bg-white border border-[#DCE3EC] rounded-xl p-4 flex flex-col justify-between shadow-xs hover:shadow transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${t.bg}`}>
          <Icon name={icon} className="h-5 w-5" />
        </div>
        {badge && (
          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 font-mono text-[11px] font-semibold text-slate-700">
            {badge}
          </span>
        )}
      </div>
      <div className="mt-3">
        <div className={`text-2xl font-bold tabular-nums tracking-tight ${t.val}`}>{value}</div>
        <div className="text-xs font-medium text-slate-500 mt-0.5">{label}</div>
        {sub && (
          <div className="text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100 bg-slate-50/70 px-2 py-1 rounded truncate">
            {sub}
          </div>
        )}
      </div>
    </div>
  )
}
