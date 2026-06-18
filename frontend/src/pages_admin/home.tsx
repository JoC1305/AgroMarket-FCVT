import AdminHeader from '../components_admin/AdminHeader'
import AdminSidebar from '../components_admin/AdminSidebar'

type MetricTone = 'green' | 'coral' | 'teal' | 'slate'

const metrics: {
  label: string
  title: string
  value: string
  detail: string
  icon: string
  tone: MetricTone
}[] = [
  {
    label: 'Hoy',
    title: 'Ventas realizadas',
    value: '$3,120.50',
    detail: '24 transacciones',
    icon: '+',
    tone: 'green',
  },
  {
    label: 'Mensual',
    title: 'Utilidades generadas',
    value: '$45,280.00',
    detail: '12.5% vs mes anterior',
    icon: '$',
    tone: 'teal',
  },
  {
    label: 'Pendientes',
    title: 'Creditos abiertos',
    value: '$12,450.00',
    detail: '8 facturas vencidas',
    icon: '!',
    tone: 'coral',
  },
  {
    label: 'Suministros',
    title: 'Compras realizadas',
    value: '$8,900.00',
    detail: 'Reposicion de stock semanal',
    icon: '#',
    tone: 'slate',
  },
]

const lowStockProducts = [
  { name: 'Fertilizante NPK 15-15-15', current: 12, min: 50, unit: 'kg', status: 'Critico' },
  { name: 'Semilla de Maiz Hibrido', current: 8, min: 20, unit: 'sacos', status: 'Bajo' },
  { name: 'Herbicida Glifosato 1L', current: 15, min: 30, unit: 'unid', status: 'Bajo' },
  { name: 'Sustrato Premium 50L', current: 5, min: 15, unit: 'sacos', status: 'Critico' },
]

const movements = [
  { date: '24/05 14:30', type: 'Venta', product: 'Fertilizante NPK + Semillas' },
  { date: '24/05 12:15', type: 'Compra', product: 'Reposicion Pesticidas ABC' },
  { date: '24/05 09:45', type: 'Credito', product: 'Venta al por mayor - Cliente Juan P.' },
  { date: '23/05 17:20', type: 'Venta', product: 'Herramientas de Poda x12' },
  { date: '23/05 16:00', type: 'Venta', product: 'Bolsas de Tierra Organica' },
]

const getStockPercent = (current: number, min: number) => Math.min(100, Math.round((current / min) * 100))

function Home() {
  return (
    <main className="admin-shell" id="inicio">
      <AdminSidebar activePage="inicio" />

      <section className="admin-main">
        <AdminHeader />

        <div className="admin-content">
          <section className="metric-grid" aria-label="Resumen administrativo">
            {metrics.map((metric) => (
              <article className={`metric-card metric-card-${metric.tone}`} key={metric.title}>
                <div className="metric-icon" aria-hidden="true">
                  {metric.icon}
                </div>
                <span>{metric.label}</span>
                <p>{metric.title}</p>
                <strong>{metric.value}</strong>
                <small>{metric.detail}</small>
              </article>
            ))}
          </section>

          <section className="admin-dashboard-grid">
            <article className="dashboard-panel stock-panel" id="inventario">
              <div className="panel-heading">
                <h2>Productos con Bajo Stock</h2>
                <a href="#inventario">Ver inventario</a>
              </div>

              <div className="stock-table" role="table" aria-label="Productos con bajo stock">
                <div className="stock-table-header" role="row">
                  <span role="columnheader">Producto</span>
                  <span role="columnheader">Actual</span>
                  <span role="columnheader">Minimo</span>
                  <span role="columnheader">Nivel</span>
                </div>

                {lowStockProducts.map((product) => {
                  const percent = getStockPercent(product.current, product.min)

                  return (
                    <div className="stock-table-row" role="row" key={product.name}>
                      <strong role="cell">{product.name}</strong>
                      <span role="cell">
                        {product.current} {product.unit}
                      </span>
                      <span role="cell">
                        {product.min} {product.unit}
                      </span>
                      <div className="stock-progress-cell" role="cell">
                        <div className="stock-progress" aria-label={`${percent}% del stock minimo`}>
                          <span style={{ width: `${percent}%` }} />
                        </div>
                        <em className={product.status === 'Critico' ? 'critical' : undefined}>{product.status}</em>
                      </div>
                    </div>
                  )
                })}
              </div>
            </article>

            <article className="dashboard-panel movements-panel">
              <div className="panel-heading">
                <h2>Ultimos Movimientos</h2>
                <div className="panel-actions">
                  <button type="button">Filtrar</button>
                  <button className="export-button" type="button">
                    Exportar
                  </button>
                </div>
              </div>

              <div className="movements-table" role="table" aria-label="Ultimos movimientos">
                <div className="movements-table-header" role="row">
                  <span role="columnheader">Fecha del movimiento</span>
                  <span role="columnheader">Tipo</span>
                  <span role="columnheader">Producto</span>
                </div>

                {movements.map((movement) => (
                  <div className="movements-table-row" role="row" key={`${movement.date}-${movement.product}`}>
                    <span role="cell">{movement.date}</span>
                    <strong className={`movement-type ${movement.type.toLowerCase()}`} role="cell">
                      {movement.type}
                    </strong>
                    <span role="cell">{movement.product}</span>
                  </div>
                ))}
              </div>
            </article>
          </section>
        </div>
      </section>
    </main>
  )
}

export default Home
