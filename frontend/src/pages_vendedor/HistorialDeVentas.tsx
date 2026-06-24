import Header from '../components/VendedorHeader'
import Icon from '../components/Icon'
import Sidebar from '../components/VendedorSidebar'
import clientesData from '../mocks/clientes.json'
import ventasData from '../mocks/ventas.json'

const currencyFormatter = new Intl.NumberFormat('es-EC', {
  currency: 'USD',
  style: 'currency',
})

const clientes = clientesData
const ventas = ventasData
const clientById = new Map(clientes.map((client) => [client.id, client]))
const completedSales = ventas.filter((sale) => sale.estado === 'pagado')
const totalSales = ventas.reduce((total, sale) => total + sale.total, 0)
const averageSale = ventas.length ? totalSales / ventas.length : 0
const completionRate = ventas.length ? Math.round((completedSales.length / ventas.length) * 100) : 0

const salesHistory = [...ventas]
  .sort((first, second) => new Date(second.fecha).getTime() - new Date(first.fecha).getTime())
  .map((sale) => ({
    id: sale.id,
    client: clientById.get(sale.clienteId)?.nombre ?? sale.clienteId,
    status: sale.estado === 'pendiente' ? 'Pendiente' : 'Completado',
    total: currencyFormatter.format(sale.total),
  }))

function HistorialDeVentas() {
  return (
    <main className="seller-home">
      <Sidebar activeHref="#vendedor-ventas" userName="Vendedor" userDetail="Junio 17, 2026" />

      <section className="workspace">
        <Header
          eyebrow="Ventas"
          title="Historial de ventas"
          searchLabel="Buscar ventas o clientes"
          searchShortcut="Ctrl + K"
        />

        <section className="seller-summary" aria-label="Resumen del historial de ventas">
          <article className="metric-card">
            <span>Total ventas</span>
            <strong>{currencyFormatter.format(totalSales)}</strong>
            <small>{completedSales.length} ventas completadas</small>
            <div className="metric-icon metric-icon-0">
              <Icon name="trend" />
            </div>
          </article>

          <article className="metric-card">
            <span>Transacciones realizadas</span>
            <strong>{ventas.length}</strong>
            <small>Promedio: {currencyFormatter.format(averageSale)}</small>
            <div className="metric-icon metric-icon-1">
              <Icon name="sales" />
            </div>
          </article>

          <article className="metric-card">
            <span>Estado principal</span>
            <strong>{completionRate}%</strong>
            <small>Ventas completadas</small>
            <div className="metric-icon metric-icon-2">
              <Icon name="alerts" />
            </div>
          </article>
        </section>

        <section className="panel" aria-label="Filtros del historial de ventas">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Filtros</p>
              <h2>Buscar en historial</h2>
            </div>
            <Icon name="calendar" />
          </div>

          <div className="seller-search">
            <input type="search" placeholder="Buscar venta, cliente o producto..." aria-label="Buscar venta,cliente o producto" />
          </div>

          <div className="actions">
            <button className="button secondary" type="button">
              <Icon name="calendar" />
              Rango de fecha
            </button>
            <button className="button secondary" type="button">
              <Icon name="alerts" />
              Estado
            </button>
          </div>
        </section>

        <section className="panel latest-sales" aria-label="Historial de ventas">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Transacciones</p>
              <h2>Historial de ventas</h2>
            </div>
            <button className="text-button" type="button">
              Ver todas
            </button>
          </div>

          <div className="sales-table">
            <div className="sales-row sales-head">
              <span>ID venta</span>
              <span>Cliente</span>
              <span>Total</span>
              <span>Estado</span>
              <span>Acciones</span>
            </div>
            {salesHistory.map((sale) => (
              <div className="sales-row" key={sale.id}>
                <strong>{sale.id}</strong>
                <span>{sale.client}</span>
                <span>{sale.total}</span>
                <span className={sale.status === 'Pendiente' ? 'status-pill pending' : 'status-pill'}>
                  {sale.status}
                </span>
                <button className="table-action" type="button" aria-label={`Ver venta ${sale.id}`}>
                  <Icon name="eye" />
                </button>
              </div>
            ))}
          </div>

          <div className="panel-header">
            <span>Mostrando 1 a {salesHistory.length} de {salesHistory.length} resultados</span>
            <button className="text-button" type="button">
              Pagina 1 de 1
            </button>
          </div>
        </section>
      </section>
    </main>
  )
}

export default HistorialDeVentas
