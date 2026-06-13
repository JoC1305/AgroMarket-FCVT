import logo from '../assets/logo.png'

const metrics = [
  { label: 'Ventas del mes', value: '$ 18.420', change: '+12.4%' },
  { label: 'Inventario activo', value: '1.284', change: '96 SKU' },
  { label: 'Cuentas por cobrar', value: '$ 4.730', change: '8 vencen' },
  { label: 'Utilidad estimada', value: '$ 6.180', change: '+8.1%' },
]

const lowStock = [
  { product: 'Fertilizante organico 25 kg', stock: 12, min: 20 },
  { product: 'Semilla de maiz hibrido', stock: 8, min: 15 },
  { product: 'Sacos de yute', stock: 18, min: 30 },
]

const movements = [
  { type: 'Ingreso', detail: 'Compra a proveedor AgroSol', amount: '$ 2.850' },
  { type: 'Egreso', detail: 'Pago de transporte y logistica', amount: '$ 420' },
  { type: 'Venta', detail: 'Factura #FAC-1048', amount: '$ 1.260' },
]

const Icon = ({ name }: { name: 'box' | 'cash' | 'file' | 'chart' }) => {
  const paths = {
    box: (
      <>
        <path d="m4 8 8-4 8 4-8 4-8-4Z" />
        <path d="m4 8v8l8 4 8-4V8" />
        <path d="M12 12v8" />
      </>
    ),
    cash: (
      <>
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <circle cx="12" cy="12" r="3" />
        <path d="M6 9v.01M18 15v.01" />
      </>
    ),
    file: (
      <>
        <path d="M7 3h7l3 3v15H7z" />
        <path d="M14 3v4h4" />
        <path d="M9 12h6M9 16h6" />
      </>
    ),
    chart: (
      <>
        <path d="M4 19h16" />
        <path d="M7 16v-5M12 16V7M17 16v-8" />
      </>
    ),
  }

  return (
    <svg className="home-icon" viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

function Home() {
  return (
    <main className="home-page">
      <aside className="sidebar" aria-label="Navegacion principal">
        <div className="logo">
          <img src={logo} alt="Logo de FCVT" />
          <div className="logo-text">
            <strong>AgroMarket</strong>
            <br />
            <span>Inventario y contabilidad</span>
          </div>
        </div>

        <nav className="nav-list">
          <a className="active" href="#resumen">
            Resumen
          </a>
          <a href="#inventario">Inventario</a>
          <a href="#contabilidad">Contabilidad</a>
          <a href="#facturas">Facturas</a>
          <a href="#reportes">Reportes</a>
        </nav>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Panel operativo</p>
            <h1>Control de inventario y finanzas</h1>
          </div>
          <div className="actions">
            <button className="button secondary" type="button">
              <Icon name="file" />
              Nuevo asiento
            </button>
            <button className="button primary" type="button">
              <Icon name="cash" />
              Registrar venta
            </button>
          </div>
        </header>

        <section className="metric-grid" id="resumen" aria-label="Indicadores">
          {metrics.map((metric) => (
            <article className="metric-card" key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <small>{metric.change}</small>
            </article>
          ))}
        </section>

        <section className="dashboard-grid">
          <article className="panel inventory-panel" id="inventario">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Inventario</p>
                <h2>Productos bajo minimo</h2>
              </div>
              <Icon name="box" />
            </div>
            <div className="stock-list">
              {lowStock.map((item) => (
                <div className="stock-row" key={item.product}>
                  <div>
                    <strong>{item.product}</strong>
                    <span>
                      Stock actual {item.stock} / minimo {item.min}
                    </span>
                  </div>
                  <meter min="0" max={item.min} value={item.stock} />
                </div>
              ))}
            </div>
          </article>

          <article className="panel accounting-panel" id="contabilidad">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Contabilidad</p>
                <h2>Flujo de caja semanal</h2>
              </div>
              <Icon name="chart" />
            </div>
            <div className="cash-chart" aria-label="Grafico de flujo de caja">
              <span style={{ height: '42%' }} />
              <span style={{ height: '66%' }} />
              <span style={{ height: '52%' }} />
              <span style={{ height: '78%' }} />
              <span style={{ height: '58%' }} />
              <span style={{ height: '88%' }} />
              <span style={{ height: '71%' }} />
            </div>
            <div className="balance-row">
              <span>Saldo disponible</span>
              <strong>$ 12.940</strong>
            </div>
          </article>

          <article className="panel wide-panel" id="facturas">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Movimientos</p>
                <h2>Actividad reciente</h2>
              </div>
              <button className="text-button" type="button">
                Ver todo
              </button>
            </div>
            <div className="movement-table">
              {movements.map((movement) => (
                <div className="movement-row" key={movement.detail}>
                  <span className="movement-type">{movement.type}</span>
                  <strong>{movement.detail}</strong>
                  <span>{movement.amount}</span>
                </div>
              ))}
            </div>
          </article>
        </section>
      </section>
    </main>
  )
}

export default Home
