import { useEffect, useState } from 'react'
import AdminHeader from './components_admin/AdminHeader'
import AdminSidebar from './components_admin/AdminSidebar'
import Home from './pages_admin/home'
import Ventas from './pages_admin/Ventas'
import './App.css'

const pageTitles: Record<string, string> = {
  inventario: 'Inventario',
  compras: 'Compras',
  creditos: 'Créditos',
  clientes: 'Clientes',
  proveedores: 'Proveedores',
  usuarios: 'Usuarios',
}

const getActivePage = () => window.location.hash.replace('#', '') || 'inicio'

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
            <p>Esta sección está lista para construir su contenido manteniendo el mismo diseño administrativo.</p>
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

  if (activePage === 'ventas') {
    return <Ventas />
  }

  if (activePage === 'inicio') {
    return <Home />
  }

  return <AdminPlaceholder page={activePage} />
}

export default App
