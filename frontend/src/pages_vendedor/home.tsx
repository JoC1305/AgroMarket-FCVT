import Icon, { type IconName } from '../components/Icon'
import Header from '../components/VendedorHeader'
import Sidebar from '../components/VendedorSidebar'
import categoriasData from '../mocks/categorias.json'
import clientesData from '../mocks/clientes.json'
import creditosData from '../mocks/creditos.json'
import productosData from '../mocks/productos.json'
import ventasData from '../mocks/ventas.json'
import '../styles/seller.css'

type Metric = {
  label: string
  value: string
  detail: string
  icon: IconName
}

const currencyFormatter = new Intl.NumberFormat('es-EC', {
  currency: 'USD',
  style: 'currency',
})

const clientes = clientesData
const creditos = creditosData
const categorias = categoriasData
const productos = productosData
const ventas = ventasData
const clientById = new Map(clientes.map((client) => [client.id, client]))
const referenceDate = new Date(Math.max(...ventas.map((sale) => new Date(sale.fecha).getTime())))
const referenceDay = referenceDate.toISOString().slice(0, 10)

const todaySales = ventas.filter((sale) => sale.fecha.startsWith(referenceDay))
const lowStock = productos
  .filter((product) => product.stockActual <= product.stockMinimo)
  .map((product) => ({ product: product.nombre, stock: product.stockActual, min: product.stockMinimo }))
  .slice(0, 3)
const dueCredits = creditos.filter((credit) => credit.estado === 'proximo' || credit.estado === 'vencido')
const pendingSales = ventas.filter((sale) => sale.estado === 'pendiente')
const activeAlerts = lowStock.length + dueCredits.length + pendingSales.length

const metrics: Metric[] = [
  {
    label: 'Ventas de hoy',
    value: currencyFormatter.format(todaySales.reduce((total, sale) => total + sale.total, 0)),
    detail: `+${todaySales.length} ventas registradas`,
    icon: 'sales',
  },
  {
    label: 'Productos vendidos',
    value: String(todaySales.reduce((total, sale) => total + sale.items.reduce((sum, item) => sum + item.cantidad, 0), 0)),
    detail: `${categorias.filter((category) => category.estado === 'activa').length} categorias activas`,
    icon: 'inventory',
  },
  {
    label: 'Alertas activas',
    value: String(activeAlerts),
    detail: `${dueCredits.length} requieren revision`,
    icon: 'alerts',
  },
]

const latestSales = [...ventas]
  .sort((first, second) => new Date(second.fecha).getTime() - new Date(first.fecha).getTime())
  .slice(0, 4)
  .map((sale) => ({
    code: sale.id,
    client: clientById.get(sale.clienteId)?.nombre ?? sale.clienteId,
    amount: currencyFormatter.format(sale.total),
    status: sale.estado === 'pendiente' ? 'Pendiente' : 'Pagado',
  }))

const alerts = [
  { label: 'Stock bajo', value: String(lowStock.length), tone: 'danger' },
  { label: 'Creditos por vencer', value: String(dueCredits.length), tone: 'warning' },
  { label: 'Ventas sin revisar', value: String(pendingSales.length), tone: 'info' },
]

const expirations = productos
  .filter((product) => product.fechaVencimiento)
  .map((product) => {
    const days = Math.ceil((new Date(`${product.fechaVencimiento}T00:00:00`).getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24))
    const tone = days <= 7 ? 'danger' : days <= 15 ? 'warning' : 'muted'

    return {
      product: product.nombre,
      detail: days <= 0 ? 'Vence hoy' : `Vence en ${days} dias`,
      tone,
    }
  })
  .filter((product) => !product.detail.includes('-'))
  .sort((first, second) => {
    const firstDays = Number(first.detail.replace(/\D/g, '')) || 0
    const secondDays = Number(second.detail.replace(/\D/g, '')) || 0
    return firstDays - secondDays
  })
  .slice(0, 4)

function Home() {
  return (
    <main className="seller-home" id="inicio">
      <Sidebar activeHref="#inicio" userName="Vendedor" userDetail="Junio 15, 2026" />

      <section className="workspace">
        <Header
          eyebrow="Panel de vendedor"
          title="Resumen de ventas"
          searchLabel="Buscar producto, cliente o venta"
          onScan={() => {
            window.location.hash = '#escanear'
          }}
        />

        <section className="seller-summary" aria-label="Indicadores del vendedor">
          {metrics.map((metric, index) => (
            <article className="metric-card" key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <small>{metric.detail}</small>
              <div className={`metric-icon metric-icon-${index}`}>
                <Icon name={metric.icon} />
              </div>
            </article>
          ))}
        </section>

        <section className="seller-dashboard-grid">
          <article className="panel latest-sales" id="ventas">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Actividad reciente</p>
                <h2>Ultimas ventas</h2>
              </div>
              <button className="text-button" type="button">
                Ver historial
              </button>
            </div>

            <div className="sales-table" aria-label="Ultimas ventas registradas">
              <div className="sales-row sales-head">
                <span>Codigo</span>
                <span>Cliente</span>
                <span>Total</span>
                <span>Estado</span>
                <span>Ver</span>
              </div>

              {latestSales.map((sale) => (
                <div className="sales-row" key={sale.code}>
                  <strong>{sale.code}</strong>
                  <span>{sale.client}</span>
                  <span>{sale.amount}</span>
                  <span className={sale.status === 'Pendiente' ? 'status-pill pending' : 'status-pill'}>
                    {sale.status}
                  </span>
                  <button className="table-action" type="button" aria-label={`Ver venta ${sale.code}`}>
                   <Icon name="eye" />
                  </button>
                </div>
              ))}
            </div>
          </article>

          <div className="seller-side-column">
            <article className="panel" id="escanear">
              <div className="panel-header">
                <div>
                  <p className="eyebrow">Inventario</p>
                  <h2>Stock bajo</h2>
                </div>
                <Icon name="inventory" />
              </div>

              <div className="stock-list compact-stock-list">
                {lowStock.map((item) => (
                  <div className="stock-row compact-stock-row" key={item.product}>
                    <div>
                      <strong>{item.product}</strong>
                      <span>
                        {item.stock}/{item.min}
                      </span>
                    </div>
                    <meter min="0" max={item.min} value={item.stock} />
                  </div>
                ))}
              </div>
            </article>

            <article className="panel" id="creditos">
              <div className="panel-header">
                <div>
                  <p className="eyebrow">Alertas</p>
                  <h2>Pendientes</h2>
                </div>
                <Icon name="bell" />
              </div>

              <div className="alert-count">
                <strong>9</strong>
                <span>eventos por revisar</span>
              </div>

              <div className="alert-list">
                {alerts.map((alert) => (
                  <div className={`alert-row ${alert.tone}`} key={alert.label}>
                    <span>{alert.label}</span>
                    <strong>{alert.value}</strong>
                  </div>
                ))}
              </div>
            </article>
          </div>

          {/* <article className="panel active-alerts-panel" id="historial">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Vencimientos</p>
                <h2>Productos proximos a vencer</h2>
              </div>
              <button className="text-button" type="button">
                Revisar lote
              </button>
            </div>

            <div className="expiry-grid">
              {expirations.map((item) => (
                <div className={`expiry-card ${item.tone}`} key={item.product}>
                  <Icon name="calendar" />
                  <div>
                    <strong>{item.product}</strong>
                    <span>{item.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </article> */}
        </section>
      </section>
    </main>
  )
}

export default Home
