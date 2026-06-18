import Header from '../components/vendedor_header'
import Icon from '../components/Icon'
import Sidebar from '../components/vendedor_sidebar'

const salesHistory = [
  {
    id: '#VEN-9021',
    date: '24 Oct, 2023',
    time: '14:32',
    client: 'Maria Alvarado',
    initials: 'MA',
    payment: 'Tarjeta de Credito',
    status: 'Completado',
    total: '$450.00',
  },
  {
    id: '#VEN-9020',
    date: '24 Oct, 2023',
    time: '12:15',
    client: 'Juan Rodriguez',
    initials: 'JR',
    payment: 'Efectivo',
    status: 'Devuelto',
    total: '$85.50',
  },
  {
    id: '#VEN-9019',
    date: '24 Oct, 2023',
    time: '10:45',
    client: 'Consumidor Final',
    initials: 'CL',
    payment: 'Transferencia',
    status: 'Completado',
    total: '$1,250.00',
  },
  {
    id: '#VEN-9018',
    date: '23 Oct, 2023',
    time: '18:20',
    client: 'Luis Martinez',
    initials: 'LM',
    payment: 'Tarjeta de Debito',
    status: 'Completado',
    total: '$215.75',
  },
]

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
            <strong>$128,450.00</strong>
            <small>+12.5% vs mes anterior</small>
            <div className="metric-icon metric-icon-0">
              <Icon name="trend" />
            </div>
          </article>

          <article className="metric-card">
            <span>Transacciones realizadas</span>
            <strong>1,248</strong>
            <small>Promedio: $102.90</small>
            <div className="metric-icon metric-icon-1">
              <Icon name="sales" />
            </div>
          </article>

          <article className="metric-card">
            <span>Estado principal</span>
            <strong>96%</strong>
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
            <span>Filtrar por cliente, rango de fecha o estado</span>
            <small>Cliente / Fecha / Estado</small>
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
                <span className={sale.status === 'Devuelto' ? 'status-pill pending' : 'status-pill'}>
                  {sale.status}
                </span>
                <button className="table-action" type="button" aria-label={`Ver venta ${sale.id}`}>
                  <Icon name="eye" />
                </button>
              </div>
            ))}
          </div>

          <div className="panel-header">
            <span>Mostrando 1 a 10 de 1,248 resultados</span>
            <button className="text-button" type="button">
              Pagina 1 de 125
            </button>
          </div>
        </section>
      </section>
    </main>
  )
}

export default HistorialDeVentas
