import type { ReactNode } from 'react'

type HeaderIconName = 'search' | 'bell' | 'settings'

const headerIcons: Record<HeaderIconName, ReactNode> = {
  search: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="m16 16 4 4" />
    </>
  ),
  bell: (
    <>
      <path d="M18 16v-5a6 6 0 0 0-12 0v5l-2 2h16l-2-2Z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </>
  ),
  settings: (
    <>
      <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />
      <path d="M4 12h2" />
      <path d="M18 12h2" />
      <path d="m6.3 6.3 1.4 1.4" />
      <path d="m16.3 16.3 1.4 1.4" />
      <path d="M12 4v2" />
      <path d="M12 18v2" />
      <path d="m17.7 6.3-1.4 1.4" />
      <path d="m7.7 16.3-1.4 1.4" />
    </>
  ),
}

const HeaderIcon = ({ name }: { name: HeaderIconName }) => (
  <svg className="admin-header-icon" viewBox="0 0 24 24" aria-hidden="true">
    {headerIcons[name]}
  </svg>
)

function AdminHeader() {
  return (
    <header className="admin-header">
      <label className="admin-search">
        <HeaderIcon name="search" />
        <input type="search" placeholder="Buscar reporte o producto..." aria-label="Buscar reporte o producto" />
      </label>

      <div className="admin-header-actions">
        <button className="icon-button" type="button" aria-label="Notificaciones">
          <HeaderIcon name="bell" />
          <span className="notification-dot" />
        </button>
        <button className="icon-button" type="button" aria-label="Configuración">
          <HeaderIcon name="settings" />
        </button>
        <div className="admin-profile" aria-label="Perfil del usuario">
          <div>
            <strong>Admin FCVT</strong>
            <span>Sucursal Central</span>
          </div>
          <div className="admin-avatar" aria-hidden="true">
            AF
          </div>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
