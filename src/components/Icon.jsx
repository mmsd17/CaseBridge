const PATHS = {
  overview: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z',
  complaints: 'M4 4h16v12H7l-3 3V4zm2 4h12v2H6V8zm0 4h8v2H6v-2z',
  bureaus: 'M4 21V7l8-4 8 4v14h-6v-6h-4v6H4zm4-11h2v2H8v-2zm6 0h2v2h-2v-2z',
  institutions: 'M3 21h18v-2H3v2zM5 17h4V5H5v12zm6 0h4V9h-4v8zm6 0h3V3h-3v14z',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm10 2-4.35-4.35',
  plus: 'M12 5v14M5 12h14',
  close: 'M6 6l12 12M18 6L6 18',
  chevron: 'M9 5l7 7-7 7',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm0-14v5l3 2',
  alert: 'M12 3 2 21h20L12 3zm0 6v6m0 3v.5',
  check: 'M4 12.5 9.5 18 20 6.5',
  bell: 'M18 16v-5a6 6 0 1 0-12 0v5l-2 3h16l-2-3zm-6 3a2.5 2.5 0 0 0 4 0',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-8 9a8 8 0 0 1 16 0',
  trend: 'M3 17l6-6 4 4 8-8m0 0v6m0-6h-6',
  filter: 'M3 5h18l-7 8v6l-4 2v-8L3 5z',
  scale: 'M12 3v18M6 7l-3 7h6L6 7zm12 0-3 7h6l-3-7zM6 7l6-2 6 2',
  menu: 'M4 6h16M4 12h16M4 18h16',
  download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
  print: 'M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z',
  refresh: 'M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15',
  verified: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  link: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
  gavel: 'M14 13l-4 4m6-6l-3-3 4-4 3 3-4 4zm-7 7l-3-3 4-4 3 3-4 4zm-2 2H2v-3l3 3z',
  school: 'M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c0 2 3 3 6 3s6-1 6-3v-5',
  info: 'M12 16v-4m0-4h.01M22 12A10 10 0 1 1 2 12a10 10 0 0 1 20 0z',
  history: 'M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
  arrowRight: 'M5 12h14M12 5l7 7-7 7',
}

export default function Icon({ name, className = 'h-4 w-4', filled = false }) {
  const d = PATHS[name]
  if (!d) return null
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {name === 'search' || name === 'clock' || name === 'trend' ? (
        <>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.6-3.6" />
        </>
      ) : (
        <path d={d} />
      )}
    </svg>
  )
}
