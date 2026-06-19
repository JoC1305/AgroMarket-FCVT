import type { ReactNode } from 'react'

export type IconName =
  | 'home'
  | 'inventory'
  | 'clients'
  | 'sales'
  | 'alerts'
  | 'shopping'
  | 'scan'
  | 'plus'
  | 'bell'
  | 'settings'
  | 'trend'
  | 'calendar'
  | 'eye'
  | 'logout'
  | 'credits'
  | 'users'
  | 'providers'


const paths: Record<IconName, ReactNode> = {
  home: (
    <>
      <path d="M4 10.5 12 4l8 6.5" />
      <path d="M6.5 9.5V20h11V9.5" />
      <path d="M10 20v-6h4v6" />
    </>
  ),
  inventory: (
    <>
      <path d="m4 8 8-4 8 4-8 4-8-4Z" />
      <path d="m4 8v8l8 4 8-4V8" />
      <path d="M12 12v8" />
    </>
  ),
  clients: (
    <>
      <path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path d="M3 20a5 5 0 0 1 10 0" />
      <path d="M17 10a2.5 2.5 0 1 0 0-5" />
      <path d="M15 15a4 4 0 0 1 6 3.5" />
    </>
  ),
  sales: (
    <>
      <path d="M4 19h16" />
      <path d="M7 16v-4" />
      <path d="M12 16V8" />
      <path d="M17 16v-7" />
      <path d="m7 9 4-4 3 3 4-5" />
    </>
  ),
  alerts: (
    <>
      <path d="m12 3 10 18H2L12 3Z" />
      <path d="M12 9v5M12 17h.01" />
    </>
  ),
  shopping: (
    <>
      <circle cx="9" cy="20" r="1" />
      <circle cx="17" cy="20" r="1" />
      <path d="M3 4h2l2 12h10l2-8H7" />
    </>
  ),
  scan: (
    <>
      <path d="M7 4H5a1 1 0 0 0-1 1v2M17 4h2a1 1 0 0 1 1 1v2M7 20H5a1 1 0 0 1-1-1v-2M17 20h2a1 1 0 0 0 1-1v-2" />
      <path d="M8 12h8" />
    </>
  ),
  plus: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </>
  ),
  settings: (
    <>
    <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 8.92 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </>
  ),
  trend: (
    <>
      <path d="M3 17h18" />
      <path d="m6 14 4-4 3 3 5-6" />
      <path d="M18 7h-4M18 7v4" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  logout: (
    <>
      <path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" />
      <path d="M15 16l4-4-4-4" />
      <path d="M8 12h11" />
    </>
  ),
    credits: (
    <>
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M7 9h10" />
      <path d="M8 14h3" />
      <path d="M15 14h1" />
    </>
    ),
    providers: (
    <>
      <path d="M3 17h18" />
      <path d="M5 17V8h10v9" />
      <path d="M15 11h3l3 3v3" />
      <path d="M7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
      <path d="M17 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
    </>
  ),
  users: (
    <>
      <path d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path d="M4 20a5 5 0 0 1 10 0" />
      <path d="M16 8h5" />
      <path d="M18.5 5.5v5" />
    </>
  )
}

function Icon({ name }: { name: IconName }) {
  return (
    <svg className="home-icon" viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

export default Icon
