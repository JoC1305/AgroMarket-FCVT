import { NavLink } from 'react-router-dom'
import logo from '../assets/logo.png'
import Icon, { type IconName } from './Icon'
import '../styles/seller.css'

type SidebarItem = {
  label: string
  to: string
  icon: IconName
}

const sidebarItems: SidebarItem[] = [
  { label: 'Inicio', to: '/inicio', icon: 'home' },
  { label: 'Inventario', to: '/productos', icon: 'inventory' },
  { label: 'Clientes', to: '/clientes', icon: 'clients' },
  { label: 'Escanear', to: '/escanear', icon: 'scan' },
  { label: 'Ventas', to: '/ventas', icon: 'sales' },
  { label: 'Alertas', to: '/alertas', icon: 'alerts' },
  { label: 'Compras', to: '/compras', icon: 'shopping' },
]

type SidebarProps = {
  activeHref?: string
  brandName?: string
  userName?: string
  userDetail?: string
}

function Sidebar({
  activeHref = '/inicio',
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
            <NavLink className={item.to === activeHref ? 'active' : undefined} to={item.to} key={item.to}>
              <Icon name={item.icon} />
              {item.label}
            </NavLink>
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

        <NavLink className="seller-logout" to="/logout">
          <Icon name="logout" />
          Cerrar sesion
        </NavLink>
      </div>
    </aside>
  )
}

export default Sidebar
