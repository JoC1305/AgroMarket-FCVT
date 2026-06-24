import AdminHeader from '../components/AdminHeader'
import AdminSidebar from '../components/AdminSidebar'
import {useNavigate } from 'react-router-dom'
import Icon, { type IconName }  from '../components/Icon'
import { useMemo, useState } from 'react'
import comprasData from '../mocks/compras.json'
import creditosData from '../mocks/creditos.json'
import productosData from '../mocks/productos.json'
import ventasData from '../mocks/ventas.json'


type MetricTone = 'green' | 'coral' | 'teal' | 'slate'
type Movement = {
  date: string
  timestamp: number
  type: 'Venta' | 'Compra' | 'Credito'
  product: string
}

type Metric = {
  label: string
  title: string
  value: string
  icon: IconName
  tone: MetricTone
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
})

const productos = productosData
const ventas = ventasData
const compras = comprasData
const creditos = creditosData

const productById = new Map(productos.map((product) => [product.id, product]))
const referenceDate = new Date(Math.max(...ventas.map((sale) => new Date(sale.fecha).getTime())))
const referenceDay = referenceDate.toISOString().slice(0, 10)

const isReferenceMonth = (dateValue: string) => {
  const date = new Date(dateValue)
  return date.getMonth() === referenceDate.getMonth() && date.getFullYear() === referenceDate.getFullYear()
}

const getSaleProfit = (sale: (typeof ventas)[number]) =>
  sale.items.reduce((total, item) => {
    const product = productById.get(item.productoId)
    return total + (item.precioUnitario - (product?.precioCompra ?? 0)) * item.cantidad
  }, 0)

const getProductNames = (items: Array<{ productoId: string }>) =>
  items.map((item) => productById.get(item.productoId)?.nombre ?? item.productoId).join(' + ')

const metrics: Metric[] = [
  {
    label: 'Hoy',
    title: 'Ventas realizadas',
    value: currencyFormatter.format(
      ventas.filter((sale) => sale.fecha.startsWith(referenceDay)).reduce((total, sale) => total + sale.total, 0),
    ),
    icon: 'plus',
    tone: 'green',
  },
  {
    label: 'Mensual',
    title: 'Utilidades generadas',
    value: currencyFormatter.format(
      ventas.filter((sale) => isReferenceMonth(sale.fecha)).reduce((total, sale) => total + getSaleProfit(sale), 0),
    ),
    icon: 'sales',
    tone: 'teal',
  },
  {
    label: 'Pendientes',
    title: 'Creditos abiertos',
    value: currencyFormatter.format(creditos.reduce((total, credit) => total + credit.saldoPendiente, 0)),
    icon: 'alerts',
    tone: 'coral',
  },
  {
    label: 'Suministros',
    title: 'Compras realizadas',
    value: currencyFormatter.format(
      compras.filter((purchase) => isReferenceMonth(purchase.fechaCompra)).reduce((total, purchase) => total + purchase.total, 0),
    ),
    icon: 'inventory',
    tone: 'slate',
  },
]

const lowStockProducts = productos
  .filter((product) => product.stockActual <= product.stockMinimo)
  .map((product) => ({
    name: product.nombre,
    current: product.stockActual,
    min: product.stockMinimo,
    unit: product.unidad,
    status: product.stockActual <= product.stockMinimo * 0.4 ? 'Critico' : 'Bajo',
  }))

const movements: Movement[] = [
  ...ventas.map((sale) => ({
    date: new Intl.DateTimeFormat('es-EC', { day: '2-digit', hour: '2-digit', minute: '2-digit', month: '2-digit' }).format(
      new Date(sale.fecha),
    ),
    timestamp: new Date(sale.fecha).getTime(),
    type: 'Venta' as const,
    product: getProductNames(sale.items),
  })),
  ...compras.map((purchase) => ({
    date: new Intl.DateTimeFormat('es-EC', { day: '2-digit', hour: '2-digit', minute: '2-digit', month: '2-digit' }).format(
      new Date(`${purchase.fechaCompra}T12:00:00`),
    ),
    timestamp: new Date(`${purchase.fechaCompra}T12:00:00`).getTime(),
    type: 'Compra' as const,
    product: getProductNames(purchase.items),
  })),
  ...creditos.map((credit) => ({
    date: new Intl.DateTimeFormat('es-EC', { day: '2-digit', hour: '2-digit', minute: '2-digit', month: '2-digit' }).format(
      new Date(`${credit.fechaApertura}T09:00:00`),
    ),
    timestamp: new Date(`${credit.fechaApertura}T09:00:00`).getTime(),
    type: 'Credito' as const,
    product: `Credito ${credit.id}`,
  })),
].sort((a, b) => b.timestamp - a.timestamp)

const getStockPercent = (current: number, min: number) => Math.min(100, Math.round((current / min) * 100))

function Home() {
  const navigate = useNavigate()
  const [movementType, setMovementType] = useState<'todos' | 'venta' | 'compra' | 'credito'>('todos')
  const [appliedMovementType, setAppliedMovementType] = useState(movementType)
  const [historyOpen, setHistoryOpen] = useState(false)

  const movementsFiltrados = useMemo(
    () =>
      movements.filter((movement) => {
        if (appliedMovementType === 'todos') return true
        return movement.type.toLowerCase() === appliedMovementType
      }),
    [appliedMovementType]
  )

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
                  <Icon name={metric.icon} />
                </div>
                <span>{metric.label}</span>
                <p>{metric.title}</p>
                <strong>{metric.value}</strong>
                {/* <small>{metric.detail}</small> */}
              </article>
            ))}
          </section>

          <section className="admin-dashboard-grid">
            <article className="dashboard-panel stock-panel" id="inventario">
              <div className="panel-heading">
                <h2>Productos con Bajo Stock</h2>
                <button type="button" className="secondary-action-button" onClick={() => navigate('/admin/inventario')}>
                  Ver inventario
                </button>
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
                  <select
                    className="movement-filter-select"
                    value={movementType}
                    onChange={(event) => setMovementType(event.target.value as 'todos' | 'venta' | 'compra' | 'credito')}
                  >
                    <option value="todos">Todos</option>
                    <option value="venta">Venta</option>
                    <option value="compra">Compra</option>
                    <option value="credito">Credito</option>
                  </select>
                  <button type="button" className="secondary-action-button" onClick={() => setAppliedMovementType(movementType)}>
                    Filtrar
                  </button>
                  <div className="history-dropdown">
                    <button type="button" className="export-button" onClick={() => setHistoryOpen((open) => !open)}>
                      Ver Historial
                    </button>
                    {historyOpen && (
                      <div className="history-dropdown-menu">
                        <button
                          type="button"
                          onClick={() => {
                            navigate('/admin/ventas')
                            setHistoryOpen(false)
                          }}
                        >
                          Ventas
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            navigate('/admin/compras')
                            setHistoryOpen(false)
                          }}
                        >
                          Compras
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            navigate('/admin/creditos')
                            setHistoryOpen(false)
                          }}
                        >
                          Creditos
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="movements-table" role="table" aria-label="Ultimos movimientos">
                <div className="movements-table-header" role="row">
                  <span role="columnheader">Fecha del movimiento</span>
                  <span role="columnheader">Tipo</span>
                  <span role="columnheader">Producto</span>
                </div>

                {movementsFiltrados.map((movement) => (
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
