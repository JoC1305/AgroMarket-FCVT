import { NavLink } from 'react-router-dom'
import logo from '../assets/logo.png'
import Icon, { type IconName } from './Icon'
import '../styles/admin.css'

type SidebarItem = {
  label: string
  icon: IconName
  to: string
  page: string
}

type AdminSidebarProps = {
  activePage?: string
}

const sidebarItems: SidebarItem[] = [
  { label: 'Inicio', icon: 'home', to: '/admin/principal', page: 'inicio' },
  { label: 'Ventas', icon: 'sales', to: '/admin/ventas', page: 'ventas' },
  { label: 'Inventario', icon: 'inventory', to: '/admin/inventario', page: 'inventario' },
  { label: 'Compras', icon: 'shopping', to: '/admin/compras', page: 'compras' },
  { label: 'Creditos', icon: 'credits', to: '/admin/creditos', page: 'creditos' },
  { label: 'Clientes', icon: 'clients', to: '/admin/clientes', page: 'clientes' },
  { label: 'Proveedores', icon: 'providers', to: '/admin/proveedores', page: 'proveedores' },
  { label: 'Usuarios', icon: 'users', to: '/admin/usuarios', page: 'usuarios' },
]

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
          <NavLink className={item.page === activePage ? 'active' : undefined} to={item.to} key={item.label}>
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <NavLink className="admin-logout" to="/logout">
        <Icon name="logout" />
        <span>Cerrar sesion</span>
      </NavLink>
    </aside>
  )
}

export default AdminSidebar
