export function Donut({ segments, size = 150, thickness = 20, centerLabel, centerValue }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1
  let offset = 0
  return (
    <div className="flex items-center gap-5">
      <svg width={size} height={size} viewBox="0 0 100 100" className="-rotate-90">
        <circle cx="50" cy="50" r="40" fill="none" stroke="#eef2f7" strokeWidth={thickness} />
        {segments.map((seg) => {
          const pct = (seg.value / total) * 100
          const el = (
            <circle
              key={seg.label}
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={seg.color}
              strokeWidth={thickness}
              pathLength={100}
              strokeDasharray={`${pct} ${100 - pct}`}
              strokeDashoffset={-offset}
            />
          )
          offset += pct
          return el
        })}
      </svg>
      <div className="min-w-0">
        <div className="mb-2 text-center sm:text-left">
          <div className="text-2xl font-semibold text-slate-900">{centerValue ?? total}</div>
          <div className="text-xs text-slate-500">{centerLabel ?? 'Total complaints'}</div>
        </div>
        <ul className="space-y-1.5">
          {segments.map((seg) => (
            <li key={seg.label} className="flex items-center gap-2 text-xs">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: seg.color }} />
              <span className="text-slate-600">{seg.label}</span>
              <span className="ml-auto font-medium text-slate-900">{seg.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function HorizontalBars({ data, max }) {
  const peak = max || Math.max(...data.map((d) => d.value), 1)
  return (
    <ul className="space-y-3">
      {data.map((d) => (
        <li key={d.label}>
          <div className="mb-1 flex items-baseline justify-between gap-3 text-xs">
            <span className="truncate text-slate-600">{d.label}</span>
            <span className="font-medium text-slate-900">{d.value}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100">
            <div
              className="h-2 rounded-full transition-all"
              style={{ width: `${(d.value / peak) * 100}%`, background: d.color || '#1d4ed8' }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}

export function TrendLine({ data, height = 170 }) {
  // data: [{ label: 'Jan', value: 3 }, ...]
  const w = 620
  const h = height
  const padX = 28
  const padY = 22
  const max = Math.max(...data.map((d) => d.value), 1)
  const x = (i) => padX + (i * (w - padX * 2)) / Math.max(data.length - 1, 1)
  const y = (v) => h - padY - (v / max) * (h - padY * 2)
  const points = data.map((d, i) => `${x(i)},${y(d.value)}`).join(' ')
  const area = `M ${x(0)} ${h - padY} L ${data.map((d, i) => `${x(i)} ${y(d.value)}`).join(' L ')} L ${x(data.length - 1)} ${h - padY} Z`
  const gridLines = [0, 0.5, 1]

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }}>
      {gridLines.map((g) => (
        <line
          key={g}
          x1={padX}
          x2={w - padX}
          y1={padY + g * (h - padY * 2)}
          y2={padY + g * (h - padY * 2)}
          stroke="#eef2f7"
          strokeWidth="1"
        />
      ))}
      <text x={4} y={padY + 4} className="fill-slate-400 text-[10px]">
        {max}
      </text>
      <text x={4} y={h - padY + 4} className="fill-slate-400 text-[10px]">
        0
      </text>
      <defs>
        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#trendFill)" />
      <polyline points={points} fill="none" stroke="#1d4ed8" strokeWidth="2.5" strokeLinejoin="round" />
      {data.map((d, i) => (
        <g key={d.label}>
          <circle cx={x(i)} cy={y(d.value)} r="3.5" fill="#fff" stroke="#1d4ed8" strokeWidth="2" />
          <text x={x(i)} y={h - 5} textAnchor="middle" className="fill-slate-400 text-[10px]">
            {d.label}
          </text>
        </g>
      ))}
    </svg>
  )
}

export function Meter({ pct, tone = 'blue' }) {
  const color = { blue: '#1d4ed8', amber: '#f59e0b', red: '#dc2626', green: '#059669' }[tone]
  return (
    <div className="h-1.5 w-full rounded-full bg-slate-100">
      <div className="h-1.5 rounded-full" style={{ width: `${Math.min(pct, 100)}%`, background: color }} />
    </div>
  )
}
