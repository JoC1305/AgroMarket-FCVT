import { useEffect, useState } from 'react'
import AdminHeader from './components_admin/AdminHeader'
import AdminSidebar from './components_admin/AdminSidebar'
import AdminHome from './pages_admin/home'
import AdminVentas from './pages_admin/Ventas'
import HistorialDeVentas from './pages_vendedor/HistorialDeVentas'
import './App.css'

const pageTitles: Record<string, string> = {
  inventario: 'Inventario',
  compras: 'Compras',
  creditos: 'Creditos',
  clientes: 'Clientes',
  proveedores: 'Proveedores',
  usuarios: 'Usuarios',
}

const getActivePage = () => window.location.hash.replace('#', '') || 'vendedor-ventas'

function AdminPlaceholder({ page }: { page: string }) {
  const title = pageTitles[page] ?? 'Inicio'

  return (
    <main className="admin-shell" id={page}>
      <AdminSidebar activePage={page} />

      <section className="admin-main">
        <AdminHeader />

        <div className="admin-content">
          <div className="page-heading">
            <div>
              <p>Principal / {title}</p>
              <h1>{title}</h1>
            </div>
          </div>

          <section className="empty-admin-page">
            <h2>{title}</h2>
            <p>Esta seccion esta lista para construir su contenido manteniendo el mismo diseno administrativo.</p>
          </section>
        </div>
      </section>
    </main>
  )
}

function App() {
  const [activePage, setActivePage] = useState(getActivePage)

  useEffect(() => {
    const handleHashChange = () => setActivePage(getActivePage())

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  if (activePage === 'admin' || activePage === 'inicio') {
    return <AdminHome />
  }

  if (activePage === 'ventas') {
    return <AdminVentas />
  }

  if (activePage === 'vendedor-ventas') {
    return <HistorialDeVentas />
  }

  return <AdminPlaceholder page={activePage} />
}

export default App
