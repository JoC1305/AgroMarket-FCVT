import type { ReactNode } from 'react'
import logo from '../assets/logo.png'

type SidebarItem = {
  label: string
  icon: IconName
  href: string
  page: string
}

type IconName =
  | 'home'
  | 'sales'
  | 'inventory'
  | 'purchases'
  | 'credits'
  | 'clients'
  | 'providers'
  | 'users'
  | 'logout'

type AdminSidebarProps = {
  activePage?: string
}

const sidebarItems: SidebarItem[] = [
  { label: 'Inicio', icon: 'home', href: '#inicio', page: 'inicio' },
  { label: 'Ventas', icon: 'sales', href: '#ventas', page: 'ventas' },
  { label: 'Inventario', icon: 'inventory', href: '#inventario', page: 'inventario' },
  { label: 'Compras', icon: 'purchases', href: '#compras', page: 'compras' },
  { label: 'Creditos', icon: 'credits', href: '#creditos', page: 'creditos' },
  { label: 'Clientes', icon: 'clients', href: '#clientes', page: 'clientes' },
  { label: 'Proveedores', icon: 'providers', href: '#proveedores', page: 'proveedores' },
  { label: 'Usuarios', icon: 'users', href: '#usuarios', page: 'usuarios' },
]

const iconPaths: Record<IconName, ReactNode> = {
  home: (
    <>
      <path d="M4 10.5 12 4l8 6.5" />
      <path d="M6.5 9.5V20h11V9.5" />
      <path d="M10 20v-6h4v6" />
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
  inventory: (
    <>
      <path d="m4 8 8-4 8 4-8 4-8-4Z" />
      <path d="m4 8v8l8 4 8-4V8" />
      <path d="M12 12v8" />
    </>
  ),
  purchases: (
    <>
      <path d="M6 6h15l-2 8H8L6 3H3" />
      <path d="M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
      <path d="M18 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
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
  clients: (
    <>
      <path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path d="M3 20a5 5 0 0 1 10 0" />
      <path d="M17 10a2.5 2.5 0 1 0 0-5" />
      <path d="M15 15a4 4 0 0 1 6 3.5" />
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
  ),
  logout: (
    <>
      <path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" />
      <path d="M15 16l4-4-4-4" />
      <path d="M8 12h11" />
    </>
  ),
}

const SidebarIcon = ({ name }: { name: IconName }) => (
  <svg className="admin-nav-icon" viewBox="0 0 24 24" aria-hidden="true">
    {iconPaths[name]}
  </svg>
)

function AdminSidebar({ activePage = 'inicio' }: AdminSidebarProps) {
  return (
    <aside className="admin-sidebar" aria-label="Navegacion de administrador">
      <div className="admin-brand">
        <img src={logo} alt="AgroMarket FCVT" />
        <div>
          <strong>AgroMarket FCVT</strong>
          <span>Administrador</span>
        </div>
      </div>

      <nav className="admin-nav">
        {sidebarItems.map((item) => (
          <a className={item.page === activePage ? 'active' : undefined} href={item.href} key={item.label}>
            <SidebarIcon name={item.icon} />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      <a className="admin-logout" href="#cerrar-sesion">
        <SidebarIcon name="logout" />
        <span>Cerrar sesion</span>
      </a>
    </aside>
  )
}

export default AdminSidebar
