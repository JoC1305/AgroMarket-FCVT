import AdminHeader from '../components/AdminHeader'
import AdminSidebar from '../components/AdminSidebar'
import Icon, { type IconName } from '../components/Icon'
import categoriasData from '../mocks/categorias.json'
import productosData from '../mocks/productos.json'
import ventasData from '../mocks/ventas.json'

type InventoryStatus = 'Alto' | 'Medio' | 'Bajo'

type InventoryProduct = {
  name: string
  category: string
  stock: number
  status: InventoryStatus
  purchasePrice: number
  salePrice: number
  soldThisMonth: number
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
})

const productos = productosData
const categorias = categoriasData
const ventas = ventasData
const categoryById = new Map(categorias.map((category) => [category.id, category]))
const referenceDate = new Date(Math.max(...ventas.map((sale) => new Date(sale.fecha).getTime())))

const isReferenceMonth = (dateValue: string) => {
  const date = new Date(dateValue)
  return date.getMonth() === referenceDate.getMonth() && date.getFullYear() === referenceDate.getFullYear()
}

const statusLabels: Record<(typeof productos)[number]['estado'], InventoryStatus> = {
  alto: 'Alto',
  bajo: 'Bajo',
  medio: 'Medio',
}

const getSoldThisMonth = (productId: string) =>
  ventas
    .filter((sale) => isReferenceMonth(sale.fecha))
    .reduce(
      (total, sale) =>
        total + sale.items.filter((item) => item.productoId === productId).reduce((itemsTotal, item) => itemsTotal + item.cantidad, 0),
      0,
    )

const inventoryProducts: InventoryProduct[] = productos.map((product) => ({
  name: product.nombre,
  category: categoryById.get(product.categoriaId)?.nombre ?? product.categoriaId,
  stock: product.stockActual,
  status: statusLabels[product.estado],
  purchasePrice: product.precioCompra,
  salePrice: product.precioVenta,
  soldThisMonth: getSoldThisMonth(product.id),
}))

const inventoryValue = inventoryProducts.reduce(
  (total, product) => total + product.stock * product.purchasePrice,
  0,
)

const monthlySales = inventoryProducts.reduce(
  (total, product) => total + product.soldThisMonth * product.salePrice,
  0,
)

const metrics: {
  label: string
  value: string
  icon: IconName
  tone: 'green' | 'coral' | 'teal' | 'slate'
}[] = [
  {
    label: 'Total de productos',
    value: String(inventoryProducts.length),
    icon: 'inventory',
    tone: 'green',
  },
  {
    label: 'Productos con stock bajo',
    value: String(inventoryProducts.filter((product) => product.status === 'Bajo').length),
    icon: 'alerts',
    tone: 'coral',
  },
  {
    label: 'Valor del inventario',
    value: currencyFormatter.format(inventoryValue),
    icon: 'providers',
    tone: 'teal',
  },
  {
    label: 'Ventas realizadas este mes',
    value: currencyFormatter.format(monthlySales),
    icon: 'trend',
    tone: 'slate',
  },
]

const getProfit = (product: InventoryProduct) => product.salePrice - product.purchasePrice

function Inventario() {
  return (
    <main className="admin-shell" id="inventario">
      <AdminSidebar activePage="inventario" />

      <section className="admin-main">
        <AdminHeader />

        <div className="admin-content inventory-page">
          <div className="page-heading">
            <div>
              <p>Principal / Inventario</p>
              <h1>Administracion de Inventario</h1>
            </div>
          </div>

          <section className="metric-grid" aria-label="Resumen de inventario">
            {metrics.map((metric) => (
              <article className={`metric-card metric-card-${metric.tone}`} key={metric.label}>
                <div className="metric-icon" aria-hidden="true">
                  <Icon name={metric.icon} />
                </div>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
              </article>
            ))}
          </section>

          <section className="inventory-toolbar" aria-label="Filtros de inventario">
            <label className="inventory-search">
              <Icon name="scan" />
              <input type="search" placeholder="Buscar producto o SKU" aria-label="Buscar producto o SKU" />
            </label>
            <select aria-label="Filtrar por categoria" defaultValue="todas">
              <option value="todas">Todas las categorias</option>
              <option value="fertilizantes">Fertilizantes</option>
              <option value="semillas">Semillas</option>
              <option value="herramientas">Herramientas</option>
            </select>
            <select aria-label="Filtrar por estado de stock" defaultValue="todos">
              <option value="todos">Estado de stock</option>
              <option value="alto">Alto</option>
              <option value="medio">Medio</option>
              <option value="bajo">Bajo</option>
            </select>
            <button className="secondary-action-button" type="button">
              Exportar
            </button>
            <button className="inventory-add-button" type="button">
              <Icon name="plus" />
              Agregar producto
            </button>
          </section>

          <section className="inventory-table-panel">
            <div className="inventory-table" role="table" aria-label="Productos en inventario">
              <div className="inventory-table-header" role="row">
                <span role="columnheader">Nombre de producto</span>
                <span role="columnheader">Categoria</span>
                <span role="columnheader">Stock</span>
                <span role="columnheader">Estado del stock</span>
                <span role="columnheader">Precio de compra</span>
                <span role="columnheader">Precio de venta</span>
                <span role="columnheader">Ganancias</span>
              </div>

              {inventoryProducts.map((product) => (
                <div className="inventory-table-row" role="row" key={product.name}>
                  <strong role="cell">{product.name}</strong>
                  <span role="cell">{product.category}</span>
                  <span role="cell">{product.stock}</span>
                  <span className={`stock-status ${product.status.toLowerCase()}`} role="cell">
                    {product.status}
                  </span>
                  <span role="cell">{currencyFormatter.format(product.purchasePrice)}</span>
                  <span role="cell">{currencyFormatter.format(product.salePrice)}</span>
                  <strong className="profit-cell" role="cell">
                    {currencyFormatter.format(getProfit(product))}
                  </strong>
                </div>
              ))}
            </div>

            <footer className="table-footer">
              <span>Mostrando 1 a {inventoryProducts.length} de {inventoryProducts.length} productos</span>
              <div>
                <button type="button" aria-label="Pagina anterior">
                  {'<'}
                </button>
                <button className="active" type="button">
                  1
                </button>
                <button type="button" aria-label="Pagina siguiente">
                  {'>'}
                </button>
              </div>
            </footer>
          </section>
        </div>
      </section>
    </main>
  )
}

export default Inventario
