import logo from '../assets/logo.png'
import Icon, { type IconName } from './Icon'

type SidebarItem = {
  label: string
  icon: IconName
  href: string
  page: string
}

type AdminSidebarProps = {
  activePage?: string
}

const sidebarItems: SidebarItem[] = [
  { label: 'Inicio', icon: 'home', href: '#inicio', page: 'inicio' },
  { label: 'Ventas', icon: 'sales', href: '#ventas', page: 'ventas' },
  { label: 'Inventario', icon: 'inventory', href: '#inventario', page: 'inventario' },
  { label: 'Compras', icon: 'shopping', href: '#compras', page: 'compras' },
  { label: 'Creditos', icon: 'credits', href: '#creditos', page: 'creditos' },
  { label: 'Clientes', icon: 'clients', href: '#clientes', page: 'clientes' },
  { label: 'Proveedores', icon: 'providers', href: '#proveedores', page: 'proveedores' },
  { label: 'Usuarios', icon: 'users', href: '#usuarios', page: 'usuarios' },
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
          <a className={item.page === activePage ? 'active' : undefined} href={item.href} key={item.label}>
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      <a className="admin-logout" href="#cerrar-sesion">
        <Icon name="logout" />
        <span>Cerrar sesión</span>
      </a>
    </aside>
  )
}

export default AdminSidebar
