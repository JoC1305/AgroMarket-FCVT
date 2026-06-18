import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import AdminHeader from './components_admin/AdminHeader'
import AdminSidebar from './components_admin/AdminSidebar'
import AdminHome from './pages_admin/home'
import AdminVentas from './pages_admin/Ventas'
import SellerHome from './pages_vendedor/home'
import HistorialDeVentas from './pages_vendedor/HistorialDeVentas'
import './App.css'

type UserRole = 'admin' | 'seller'

type Session = {
  name: string
  role: UserRole
}

type TestUser = Session & {
  password: string
}

const testUsers: Record<string, TestUser> = {
  admin: {
    name: 'Administrador',
    password: 'admin123',
    role: 'admin',
  },
  vendedor: {
    name: 'Vendedor',
    password: 'vendedor123',
    role: 'seller',
  },
}

const pageTitles: Record<string, string> = {
  inventario: 'Inventario',
  compras: 'Compras',
  creditos: 'Creditos',
  clientes: 'Clientes',
  proveedores: 'Proveedores',
  usuarios: 'Usuarios',
}

const getActivePage = () => window.location.hash.replace('#', '') || 'inicio'

function getStoredSession() {
  const savedRole = window.localStorage.getItem('agromarket-role') as UserRole | null
  const savedName = window.localStorage.getItem('agromarket-user')

  if (!savedRole || !savedName) {
    return null
  }

  return { name: savedName, role: savedRole }
}

function Login({ onLogin }: { onLogin: (session: Session) => void }) {
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const username = String(formData.get('username') ?? '').trim().toLowerCase()
    const password = String(formData.get('password') ?? '')
    const user = testUsers[username]

    if (!user || user.password !== password) {
      setError('Usuario o contrasena incorrectos')
      return
    }

    const session = { name: user.name, role: user.role }
    window.localStorage.setItem('agromarket-user', session.name)
    window.localStorage.setItem('agromarket-role', session.role)
    window.location.hash = '#inicio'
    onLogin(session)
  }

  return (
    <main className="login-page">
      <section className="login-panel" aria-label="Iniciar sesion">
        <div>
          <p className="login-eyebrow">AgroMarket FCVT</p>
          <h1>Iniciar sesion</h1>
          <p className="login-copy">Usa un perfil de prueba para revisar la navegacion de cada tipo de usuario.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Usuario
            <input autoComplete="username" name="username" placeholder="admin o vendedor" type="text" required />
          </label>

          <label>
            Contrasena
            <input
              autoComplete="current-password"
              name="password"
              placeholder="admin123 o vendedor123"
              type="password"
              required
            />
          </label>

          {error && <p className="login-error">{error}</p>}

          <button type="submit">Entrar</button>
        </form>

        <div className="login-users" aria-label="Usuarios de prueba">
          <div>
            <strong>Administrador</strong>
            <span>admin / admin123</span>
          </div>
          <div>
            <strong>Vendedor</strong>
            <span>vendedor / vendedor123</span>
          </div>
        </div>
      </section>
    </main>
  )
}

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
  const [session, setSession] = useState<Session | null>(getStoredSession)
  const [activePage, setActivePage] = useState(getActivePage)

  useEffect(() => {
    const handleHashChange = () => setActivePage(getActivePage())

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    if (activePage !== 'cerrar-sesion') {
      return
    }

    window.localStorage.removeItem('agromarket-user')
    window.localStorage.removeItem('agromarket-role')
    setSession(null)
    window.location.hash = ''
  }, [activePage])

  if (!session) {
    return <Login onLogin={setSession} />
  }

  if (session.role === 'seller') {
    if (activePage === 'ventas' || activePage === 'vendedor-ventas') {
      return <HistorialDeVentas />
    }

    return <SellerHome />
  }

  if (activePage === 'admin' || activePage === 'inicio') {
    return <AdminHome />
  }

  if (activePage === 'ventas') {
    return <AdminVentas />
  }

  return <AdminPlaceholder page={activePage} />
}

export default App
