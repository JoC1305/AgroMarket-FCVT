import { type FormEvent, useEffect, useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import AdminHeader from './components/AdminHeader'
import AdminSidebar from './components/AdminSidebar'
import AdminCompras from './pages_admin/Compras'
import AdminHome from './pages_admin/home'
import AdminInventario from './pages_admin/Inventario'
import AdminVentas from './pages_admin/Ventas'
import HistorialDeVentas from './pages_vendedor/HistorialDeVentas'
import EscanearProducto from './pages_vendedor/EscanearProducto'
import SellerHome from './pages_vendedor/home'
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
  creditos: 'Creditos',
  clientes: 'Clientes',
  proveedores: 'Proveedores',
  usuarios: 'Usuarios',
  configuracion: 'Configuracion',
}

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
  const navigate = useNavigate()

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
    onLogin(session)
    navigate(session.role === 'admin' ? '/admin/principal' : '/ventas')
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

function Logout({ onLogout }: { onLogout: () => void }) {
  useEffect(() => {
    window.localStorage.removeItem('agromarket-user')
    window.localStorage.removeItem('agromarket-role')
    onLogout()
  }, [onLogout])

  return <Navigate to="/" replace />
}

function App() {
  const [session, setSession] = useState<Session | null>(getStoredSession)

  if (!session) {
    return (
      <Routes>
        <Route path="*" element={<Login onLogin={setSession} />} />
      </Routes>
    )
  }

  if (session.role === 'seller') {
    return (
      <Routes>
        <Route path="/" element={<Navigate to="/ventas" replace />} />
        <Route path="/ventas" element={<HistorialDeVentas />} />
        <Route path="/logout" element={<Logout onLogout={() => setSession(null)} />} />
        <Route path="/escanear" element={<EscanearProducto />} />
        <Route path="*" element={<SellerHome />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/principal" replace />} />
      <Route path="/admin" element={<Navigate to="/admin/principal" replace />} />
      <Route path="/admin/principal" element={<AdminHome />} />
      <Route path="/admin/ventas" element={<AdminVentas />} />
      <Route path="/admin/inventario" element={<AdminInventario />} />
      <Route path="/admin/compras" element={<AdminCompras />} />
      <Route path="/admin/creditos" element={<AdminPlaceholder page="creditos" />} />
      <Route path="/admin/clientes" element={<AdminPlaceholder page="clientes" />} />
      <Route path="/admin/proveedores" element={<AdminPlaceholder page="proveedores" />} />
      <Route path="/admin/usuarios" element={<AdminPlaceholder page="usuarios" />} />
      <Route path="/admin/configuracion" element={<AdminPlaceholder page="configuracion" />} />
      <Route path="/logout" element={<Logout onLogout={() => setSession(null)} />} />
      <Route path="*" element={<Navigate to="/admin/principal" replace />} />
    </Routes>
  )
}

export default App
