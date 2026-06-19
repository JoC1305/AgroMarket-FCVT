import Icon from '../components/Icon'
import Header from '../components/VendedorHeader'
import Sidebar from '../components/VendedorSidebar'

const metrics = [
  { label: 'Ventas de hoy', value: '$ 1.240', detail: '+8 ventas registradas', icon: 'sales' },
  { label: 'Productos vendidos', value: '86', detail: '12 categorias activas', icon: 'inventory' },
  { label: 'Alertas activas', value: '5', detail: '2 requieren revision', icon: 'alerts' },
] as const

const latestSales = [
  { code: '#V-1048', client: 'Finca Santa Rosa', amount: '$ 340', status: 'Pagado' },
  { code: '#V-1047', client: 'Carlos Mendoza', amount: '$ 125', status: 'Pendiente' },
  { code: '#V-1046', client: 'AgroCampo Norte', amount: '$ 780', status: 'Pagado' },
  { code: '#V-1045', client: 'Maria Zambrano', amount: '$ 96', status: 'Pagado' },
]

const lowStock = [
  { product: 'Fertilizante organico 25 kg', stock: 12, min: 20 },
  { product: 'Semilla de maiz hibrido', stock: 8, min: 15 },
  { product: 'Sacos de yute', stock: 18, min: 30 },
]

const alerts = [
  { label: 'Stock bajo', value: '2', tone: 'danger' },
  { label: 'Creditos por vencer', value: '3', tone: 'warning' },
  { label: 'Ventas sin revisar', value: '4', tone: 'info' },
]

const expirations = [
  { product: 'Insecticida foliar', detail: 'Vence en 5 dias', tone: 'danger' },
  { product: 'Abono premium', detail: 'Vence en 12 dias', tone: 'warning' },
  { product: 'Fungicida cobre', detail: 'Vence en 28 dias', tone: 'muted' },
  { product: 'Vitaminas de cultivo', detail: 'Vence en 35 dias', tone: 'muted' },
]

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

          <article className="panel active-alerts-panel" id="historial">
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
          </article>
        </section>
      </section>
    </main>
  )
}

export default Home
