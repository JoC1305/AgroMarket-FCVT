import logo from '../assets/logo.png'
import Icon, { type IconName } from './Icon'

type SidebarItem = {
  label: string
  href: string
  icon: IconName
}

const sidebarItems: SidebarItem[] = [
  { label: 'Inicio', href: '#inicio', icon: 'home' },
  { label: 'Inventario', href: '#inventario', icon: 'inventory' },
  { label: 'Clientes', href: '#clientes', icon: 'clients' },
  { label: 'Ventas', href: '#vendedor-ventas', icon: 'sales' },
  { label: 'Alertas', href: '#alertas', icon: 'alerts' },
  { label: 'Compras', href: '#compras', icon: 'shopping' },
]

type SidebarProps = {
  activeHref?: string
  brandName?: string
  userName?: string
  userDetail?: string
}

function Sidebar({
  activeHref = sidebarItems[0]?.href,
  brandName = 'AgroMarket - FCVT',
  userName = 'Vendedor',
  userDetail = 'Junio 15, 2026',
}: SidebarProps) {
  return (
    <aside className="sidebar seller-sidebar" aria-label="Navegacion principal">
      <div>
        <div className="logo seller-logo">
          <img src={logo} alt={`Logo de ${brandName}`} />
          <div className="logo-text">
            <strong>{brandName}</strong>
          </div>
        </div>

        <nav className="nav-list seller-nav">
          {sidebarItems.map((item) => (
            <a className={item.href === activeHref ? 'active' : undefined} href={item.href} key={item.href}>
              <Icon name={item.icon} />
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="seller-footer">
        <div className="seller-profile" aria-label="Vendedor activo">
          <span className="avatar">{userName.charAt(0)}</span>
          <div>
            <strong>{userName}</strong>
            <span>{userDetail}</span>
          </div>
        </div>

        <a className="seller-logout" href="#cerrar-sesion">
          <Icon name="logout" />
          Cerrar sesión
        </a>
      </div>
    </aside>
  )
}

export default Sidebar
