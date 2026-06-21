import { useState } from 'react'
import AdminHeader from '../components/AdminHeader'
import AdminSidebar from '../components/AdminSidebar'
import Icon from '../components/Icon'
import PeriodFilter, { type DateFilter } from '../components/PeriodFilter'
import RegistrarCompra from '../components/RegistrarCompra'
import comprasData from '../mocks/compras.json'
import productosData from '../mocks/productos.json'
import proveedoresData from '../mocks/proveedores.json'
import type { Purchase, PurchaseStatus } from '../types/purchase'
import styles from './Compras.module.css'

type PurchaseFormData = {
  id?: string
  product: string
  quantity: number
  unit: string
  provider: string
  purchasePrice: number
  status: PurchaseStatus
  purchaseDate: string
  deliveryDate: string
  createdBy?: string
}

const productos = productosData
const proveedores = proveedoresData
const productById = new Map(productos.map((product) => [product.id, product]))
const providerById = new Map(proveedores.map((provider) => [provider.id, provider]))

const purchases: Purchase[] = comprasData.map((purchase) => {
  const mainItem = purchase.items[0]
  const product = productById.get(mainItem.productoId)
  const provider = providerById.get(purchase.proveedorId)

  return {
    id: purchase.id,
    purchaseDate: purchase.fechaCompra,
    deliveryDate: purchase.fechaEntrega,
    product: purchase.items.map((item) => productById.get(item.productoId)?.nombre ?? item.productoId).join(' + '),
    sku: product?.sku ?? mainItem.productoId,
    quantity: purchase.items.reduce((total, item) => total + item.cantidad, 0),
    unit: purchase.items.length === 1 ? mainItem.unidad : 'items',
    provider: provider?.nombre ?? purchase.proveedorId,
    purchasePrice: purchase.total,
    status: purchase.estado as PurchaseStatus,
  }
})

const currencyFormatter = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
})

function getCurrentDateString() {
  return new Date().toISOString().slice(0, 10)
}

const formatDate = (dateValue: string) => {
  const date = new Date(`${dateValue}T00:00:00`)
  return new Intl.DateTimeFormat('es-EC', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

const getStatusLabel = (status: PurchaseStatus) => {
  const labels: Record<PurchaseStatus, string> = {
    cancelado: 'Cancelado',
    'en-camino': 'En camino',
    pendiente: 'Pendiente',
    recibido: 'Recibido',
  }

  return labels[status]
}

const getStatusClass = (status: PurchaseStatus) => {
  const classes: Record<PurchaseStatus, string> = {
    cancelado: styles.cancelado,
    'en-camino': styles.enCamino,
    pendiente: styles.pendiente,
    recibido: styles.recibido,
  }

  return classes[status]
}

const getWeekBounds = (date: Date) => {
  const weekday = date.getDay()
  const mondayOffset = weekday === 0 ? -6 : 1 - weekday
  const weekStart = new Date(date)
  weekStart.setDate(date.getDate() + mondayOffset)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)
  return { weekStart, weekEnd }
}

const isInsideDateFilter = (purchase: Purchase, filter: DateFilter, from: string, to: string) => {
  const purchaseDate = new Date(`${purchase.purchaseDate}T00:00:00`)
  const referenceDate = from ? new Date(`${from}T00:00:00`) : new Date(`${getCurrentDateString()}T00:00:00`)

  if (filter === 'dia') {
    return purchaseDate.toDateString() === referenceDate.toDateString()
  }

  if (filter === 'semana') {
    const { weekStart, weekEnd } = getWeekBounds(referenceDate)
    return purchaseDate >= weekStart && purchaseDate <= weekEnd
  }

  if (filter === 'mes') {
    return purchaseDate.getMonth() === referenceDate.getMonth() && purchaseDate.getFullYear() === referenceDate.getFullYear()
  }

  if (filter === 'anio') {
    return purchaseDate.getFullYear() === referenceDate.getFullYear()
  }

  const start = from ? new Date(`${from}T00:00:00`) : null
  const end = to ? new Date(`${to}T00:00:00`) : null

  return (!start || purchaseDate >= start) && (!end || purchaseDate <= end)
}

function Compras() {
  const [query, setQuery] = useState('')
  const [dateFilter, setDateFilter] = useState<DateFilter>('mes')
  const [fromDate, setFromDate] = useState(getCurrentDateString())
  const [toDate, setToDate] = useState(getCurrentDateString())
  const [statusFilter, setStatusFilter] = useState<PurchaseStatus | 'todos'>('todos')
  const [showPurchaseForm, setShowPurchaseForm] = useState(false)
  const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null)
  const [purchasesState, setPurchasesState] = useState<Purchase[]>(purchases)

  const monthlyTotal = purchasesState
    .filter((purchase) => isInsideDateFilter(purchase, 'mes', '', ''))
    .reduce((total, purchase) => total + purchase.purchasePrice, 0)

  const activeProviders = new Set(purchasesState.map((purchase) => purchase.provider)).size
  const pendingOrders = purchasesState.filter((purchase) => purchase.status === 'pendiente' || purchase.status === 'en-camino')

  const normalizedQuery = query.trim().toLowerCase()
  const filteredPurchases = purchasesState.filter((purchase) => {
    const matchesQuery =
      !normalizedQuery ||
      purchase.product.toLowerCase().includes(normalizedQuery) ||
      purchase.provider.toLowerCase().includes(normalizedQuery)
    const matchesStatus = statusFilter === 'todos' || purchase.status === statusFilter
    const matchesDate = isInsideDateFilter(purchase, dateFilter, fromDate, toDate)

    return matchesQuery && matchesStatus && matchesDate
  })

  const clearFilters = () => {
    setQuery('')
    setDateFilter('mes')
    setFromDate(getCurrentDateString())
    setToDate(getCurrentDateString())
    setStatusFilter('todos')
  }

  const handleViewPurchase = (purchase: Purchase) => {
    window.alert(
      `Compra ${purchase.id} - ${purchase.product}\nProveedor: ${purchase.provider}\nCantidad: ${purchase.quantity} ${purchase.unit}\nPrecio total de compra: ${currencyFormatter.format(
        purchase.purchasePrice,
      )}\nPrecio por producto: ${currencyFormatter.format(purchase.purchasePrice / purchase.quantity)}\nEstado: ${getStatusLabel(purchase.status)}\nFecha de compra: ${formatDate(purchase.purchaseDate)}\nFecha de entrega: ${formatDate(purchase.deliveryDate)}`,
    )
  }

  const handleEditPurchase = (purchase: Purchase) => {
    if (purchase.status === 'recibido') {
      window.alert('Este pedido ya fue recibido y no puede editarse.')
      return
    }

    setEditingPurchase(purchase)
    setShowPurchaseForm(true)
  }

  const handleDeletePurchase = (id: string) => {
    if (!window.confirm('¿Eliminar esta compra?')) {
      return
    }

    setPurchasesState((current) => current.filter((purchase) => purchase.id !== id))
  }

  const handleSavePurchase = (purchase: PurchaseFormData) => {
    setPurchasesState((current) => {
      if (purchase.id) {
        return current.map((existing) =>
          existing.id === purchase.id
            ? {
                ...existing,
                product: purchase.product,
                quantity: purchase.quantity,
                unit: purchase.unit,
                purchasePrice: purchase.purchasePrice,
                status: purchase.status,
                deliveryDate: purchase.deliveryDate,
              }
            : existing,
        )
      }

      return [
        {
          id: `CMP-${String(current.length + 1).padStart(3, '0')}`,
          purchaseDate: purchase.purchaseDate,
          deliveryDate: purchase.deliveryDate,
          product: purchase.product,
          sku: purchase.provider.slice(0, 3).toUpperCase() + '-' + String(current.length + 1).padStart(3, '0'),
          quantity: purchase.quantity,
          unit: purchase.unit,
          provider: purchase.provider,
          purchasePrice: purchase.purchasePrice,
          status: purchase.status,
        },
        ...current,
      ]
    })
    setShowPurchaseForm(false)
    setEditingPurchase(null)
  }

  return (
    <main className="admin-shell" id="compras">
      <AdminSidebar activePage="compras" />

      <section className="admin-main">
        <AdminHeader />

        <div className={`admin-content ${styles.purchasesPage}`}>
          <div className="page-heading">
            <div>
              <p>Principal / Compras</p>
              <h1>Registro de Compras</h1>
              <span className={styles.subtitle}></span>
            </div>
            <button
              className={styles.primaryButton}
              type="button"
              onClick={() => {
                if (showPurchaseForm) {
                  setShowPurchaseForm(false)
                  setEditingPurchase(null)
                } else {
                  setEditingPurchase(null)
                  setShowPurchaseForm(true)
                }
              }}
            >
              <Icon name="plus" />
              {showPurchaseForm ? 'Cerrar registro' : 'Registrar Nueva Compra'}
            </button>
          </div>

          <section className={styles.summaryGrid} aria-label="Resumen de compras">
            <article className={styles.summaryCard}>
              <div>
                <span>Total compras mes</span>
                <strong>{currencyFormatter.format(monthlyTotal)}</strong>
                <small>+12.4% vs mes anterior</small>
              </div>
              <div className={styles.summaryIcon}>
                <Icon name="shopping" />
              </div>
            </article>

            <article className={styles.summaryCard}>
              <div>
                <span>Proveedores activos</span>
                <strong>{activeProviders}</strong>
                <small>3 nuevos este trimestre</small>
              </div>
              <div className={styles.summaryIcon}>
                <Icon name="providers" />
              </div>
            </article>

            <article className={`${styles.summaryCard} ${styles.warning}`}>
              <div>
                <span>Pedidos pendientes</span>
                <strong>{String(pendingOrders.length).padStart(2, '0')}</strong>
                <small>{pendingOrders.length > 0 ? `${pendingOrders.length} productos con atraso` : 'Sin atrasos'}</small>
              </div>
              <div className={styles.summaryIcon}>
                <Icon name="alerts" />
              </div>
            </article>
          </section>

          {showPurchaseForm && (
            <RegistrarCompra
              mode={editingPurchase ? 'edit' : 'new'}
              initialValues={
                editingPurchase
                  ? {
                      id: editingPurchase.id,
                      product: editingPurchase.product,
                      quantity: editingPurchase.quantity,
                      unit: editingPurchase.unit,
                      provider: editingPurchase.provider,
                      purchasePrice: editingPurchase.purchasePrice,
                      status: editingPurchase.status,
                      purchaseDate: editingPurchase.purchaseDate,
                      deliveryDate: editingPurchase.deliveryDate,
                    }
                  : undefined
              }
              onSave={handleSavePurchase}
              onCancel={() => {
                setShowPurchaseForm(false)
                setEditingPurchase(null)
              }}
            />
          )}

          <section className={styles.filterPanel} aria-label="Filtros de compras">
            <label>
              Producto o proveedor
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Producto o proveedor"
              />
            </label>
            <PeriodFilter
              dateFilter={dateFilter}
              fromDate={fromDate}
              toDate={toDate}
              onDateFilterChange={setDateFilter}
              onFromDateChange={setFromDate}
              onToDateChange={setToDate}
            />
            <label>
              Estado
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as PurchaseStatus | 'todos')}
              >
                <option value="todos">Todos los estados</option>
                <option value="recibido">Recibido</option>
                <option value="en-camino">En camino</option>
                <option value="pendiente">Pendiente</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </label>
            <button className={styles.clearButton} type="button" onClick={clearFilters}>
              Limpiar
            </button>
          </section>

          <section className={styles.tablePanel}>
            <div className={styles.table} role="table" aria-label="Compras realizadas">
              <div className={styles.tableHeader} role="row">
                <span role="columnheader">Producto</span>
                <span role="columnheader">Cantidad</span>
                <span role="columnheader">Precio total</span>
                <span role="columnheader">Precio unidad</span>
                <span role="columnheader">Proveedor</span>
                <span role="columnheader">Estado</span>
                <span role="columnheader">Fecha de compra</span>
                <span role="columnheader">Fecha de entrega</span>
                <span role="columnheader">Acciones</span>
              </div>

              {filteredPurchases.map((purchase, index) => (
                <div
                  className={`${styles.tableRow} ${index === 0 ? styles.featuredRow : ''}`}
                  role="row"
                  key={purchase.id}
                >
                  <div className={styles.productCell} role="cell">
                    <div className={styles.productIcon} aria-hidden="true">
                      {purchase.product.slice(0, 1)}
                    </div>
                    <div>
                      <strong>{purchase.product}</strong>
                      <small>SKU: {purchase.sku}</small>
                    </div>
                  </div>
                  <span role="cell">
                    {purchase.quantity} {purchase.unit}
                  </span>
                  <strong className={styles.amount} role="cell">
                    {currencyFormatter.format(purchase.purchasePrice)}
                  </strong>
                  <strong className={styles.amount} role="cell">
                    {currencyFormatter.format(purchase.purchasePrice / purchase.quantity)}
                  </strong>
                  <span role="cell">{purchase.provider}</span>
                  <span className={`${styles.statusBadge} ${getStatusClass(purchase.status)}`} role="cell">
                    {getStatusLabel(purchase.status)}
                  </span>
                  <span role="cell">{formatDate(purchase.purchaseDate)}</span>
                  <span role="cell">{formatDate(purchase.deliveryDate)}</span>
                  <div className={styles.actions} role="cell">
                    <button
                      className={styles.actionButton}
                      type="button"
                      onClick={() => handleViewPurchase(purchase)}
                      aria-label={`Ver detalle de ${purchase.id}`}
                    >
                      <Icon name="eye" />
                    </button>
                    <button
                      className={styles.actionButton}
                      type="button"
                      onClick={() => handleEditPurchase(purchase)}
                      aria-label={`Editar ${purchase.id}`}
                      disabled={purchase.status === 'recibido'}
                      title={purchase.status === 'recibido' ? 'No se puede editar un pedido recibido' : 'Editar compra'}
                    >
                      <Icon name="edit" />
                    </button>
                    <button
                      className={styles.actionButton}
                      type="button"
                      onClick={() => handleDeletePurchase(purchase.id)}
                      aria-label={`Eliminar ${purchase.id}`}
                    >
                      <Icon name="trash" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <footer className={styles.footer}>
              <span>
                Mostrando {filteredPurchases.length ? '1' : '0'}-{filteredPurchases.length} de {purchasesState.length}{' '}
                registros
              </span>
              <div className={styles.pager}>
                <button type="button" aria-label="Pagina anterior">
                  {'<'}
                </button>
                <button className={styles.activePage} type="button">
                  1
                </button>
                <button type="button">2</button>
                <button type="button">3</button>
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

export default Compras
