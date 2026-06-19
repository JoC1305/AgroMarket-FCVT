import { useState } from 'react'
import AdminHeader from '../components/AdminHeader'
import AdminSidebar from '../components/AdminSidebar'
import Icon from '../components/Icon'
import { getPurchases } from '../services/purchaseService'
import type { Purchase, PurchaseStatus } from '../types/purchase'
import styles from './Compras.module.css'

type DateFilter = 'dia' | 'semana' | 'mes' | 'rango'

const purchases = getPurchases()

const currencyFormatter = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
})

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

const isInsideDateFilter = (purchase: Purchase, filter: DateFilter, from: string, to: string) => {
  const purchaseDate = new Date(`${purchase.purchaseDate}T00:00:00`)
  const today = new Date('2026-06-18T00:00:00')

  if (filter === 'dia') {
    return purchase.purchaseDate === '2026-06-18'
  }

  if (filter === 'semana') {
    const start = new Date(today)
    start.setDate(today.getDate() - 7)
    return purchaseDate >= start && purchaseDate <= today
  }

  if (filter === 'mes') {
    return purchaseDate.getMonth() === today.getMonth() && purchaseDate.getFullYear() === today.getFullYear()
  }

  const start = from ? new Date(`${from}T00:00:00`) : null
  const end = to ? new Date(`${to}T00:00:00`) : null

  return (!start || purchaseDate >= start) && (!end || purchaseDate <= end)
}

function Compras() {
  const [query, setQuery] = useState('')
  const [dateFilter, setDateFilter] = useState<DateFilter>('mes')
  const [fromDate, setFromDate] = useState('2026-06-01')
  const [toDate, setToDate] = useState('2026-06-18')
  const [statusFilter, setStatusFilter] = useState<PurchaseStatus | 'todos'>('todos')

  const monthlyTotal = purchases
    .filter((purchase) => isInsideDateFilter(purchase, 'mes', '', ''))
    .reduce((total, purchase) => total + purchase.purchasePrice, 0)

  const activeProviders = new Set(purchases.map((purchase) => purchase.provider)).size
  const pendingOrders = purchases.filter((purchase) => purchase.status === 'pendiente' || purchase.status === 'en-camino')

  const normalizedQuery = query.trim().toLowerCase()
  const filteredPurchases = purchases.filter((purchase) => {
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
    setFromDate('2026-06-01')
    setToDate('2026-06-18')
    setStatusFilter('todos')
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
            <button className={styles.primaryButton} type="button">
              <Icon name="plus" />
              Registrar Nueva Compra
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
              </div>
              <div className={styles.summaryIcon}>
                <Icon name="alerts" />
              </div>
            </article>
          </section>

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
            <label>
              Fecha
              <select value={dateFilter} onChange={(event) => setDateFilter(event.target.value as DateFilter)}>
                <option value="dia">Dia</option>
                <option value="semana">Semana</option>
                <option value="mes">Mes</option>
                <option value="rango">Rango de fecha</option>
              </select>
            </label>
            <label>
              Desde
              <input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} />
            </label>
            <label>
              Hasta
              <input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} />
            </label>
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
                <span role="columnheader">Fecha de compra</span>
                <span role="columnheader">Producto</span>
                <span role="columnheader">Cantidad</span>
                <span role="columnheader">Proveedor</span>
                <span role="columnheader">Precio compra</span>
                <span role="columnheader">Estado</span>
                <span role="columnheader">Acciones</span>
              </div>

              {filteredPurchases.map((purchase, index) => (
                <div
                  className={`${styles.tableRow} ${index === 0 ? styles.featuredRow : ''}`}
                  role="row"
                  key={purchase.id}
                >
                  <span role="cell">{formatDate(purchase.purchaseDate)}</span>
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
                  <span role="cell">{purchase.provider}</span>
                  <strong className={styles.amount} role="cell">
                    {currencyFormatter.format(purchase.purchasePrice)}
                  </strong>
                  <span className={`${styles.statusBadge} ${getStatusClass(purchase.status)}`} role="cell">
                    {getStatusLabel(purchase.status)}
                  </span>
                  <div className={styles.actions} role="cell">
                    <button className={styles.actionButton} type="button" aria-label={`Ver detalle de ${purchase.id}`}>
                      <Icon name="eye" />
                    </button>
                    <button className={styles.actionButton} type="button" aria-label={`Editar ${purchase.id}`}>
                      <Icon name="edit" />
                    </button>
                    <button className={styles.actionButton} type="button" aria-label={`Eliminar ${purchase.id}`}>
                      <Icon name="trash" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <footer className={styles.footer}>
              <span>
                Mostrando {filteredPurchases.length ? '1' : '0'}-{filteredPurchases.length} de {purchases.length}{' '}
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
