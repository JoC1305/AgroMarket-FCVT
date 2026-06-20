import { type FormEvent, useMemo, useState } from 'react'
import AdminHeader from '../components/AdminHeader'
import AdminSidebar from '../components/AdminSidebar'
import PeriodFilter, { type DateFilter } from '../components/PeriodFilter'

type Sale = {
  date: string
  product: string
  quantity: string
  unitPrice: string
  total: string
  payment: string
}

const initialSales: Sale[] = [
  {
    date: '22/07/2023 09:15',
    product: 'Fertilizante NPK 15-15-15',
    quantity: '10 bultos',
    unitPrice: '$1,250.00',
    total: '$12,500.00',
    payment: 'Transferencia',
  },
  {
    date: '20/10/2023 10:30',
    product: 'Semilla Maiz Hibrido F1',
    quantity: '5 bolsas',
    unitPrice: '$850.00',
    total: '$4,250.00',
    payment: 'Efectivo',
  },
  {
    date: '30/11/2023 11:45',
    product: 'Herbicida Glifosato 1L',
    quantity: '20 unid.',
    unitPrice: '$145.00',
    total: '$2,900.00',
    payment: 'Credito',
  },
  {
    date: '24/10/2023 13:20',
    product: 'Pala Forjada Herragro',
    quantity: '2 unid.',
    unitPrice: '$75.00',
    total: '$150.00',
    payment: 'Tarjeta',
  },
  {
    date: '24/10/2023 15:05',
    product: 'Alambre de Pua 400m',
    quantity: '3 rollos',
    unitPrice: '$320.00',
    total: '$960.00',
    payment: 'Transferencia',
  },
  {
    date: '24/10/2023 16:30',
    product: 'Bota Pantanera PVC',
    quantity: '1 par',
    unitPrice: '$45.00',
    total: '$45.00',
    payment: 'Efectivo',
  },
  {
    date: '23/10/2023 08:20',
    product: 'Melaza Cana de Azucar 20kg',
    quantity: '5 bultos',
    unitPrice: '$60.00',
    total: '$300.00',
    payment: 'Credito',
  },
]

const currencyFormatter = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
})

const getInputValue = (formData: FormData, key: string) => String(formData.get(key) ?? '').trim()

function Ventas() {
  const [sales, setSales] = useState(initialSales)
  const [showSaleForm, setShowSaleForm] = useState(false)

  const totalCredits = useMemo(
    () =>
      sales
        .filter((sale) => sale.payment === 'Credito')
        .reduce((sum, sale) => sum + Number(sale.total.replace(/[$,]/g, '')), 0),
    [sales],
  )

  const salesSummary = {
    quantityToday: sales.filter((sale) => sale.date.startsWith('24/10/2023')).length,
    totalToday: '$42,850.00',
    profitToday: '$8,940.00',
    frequentPayment: 'Transferencia',
    creditTotal: currencyFormatter.format(totalCredits),
  }

  const [dateFilter, setDateFilter] = useState<DateFilter>('dia')
  const [fromDate, setFromDate] = useState('2023-10-24')
  const [toDate, setToDate] = useState('2023-10-24')

  const getAutoRange = (date: Date, filter: DateFilter) => {
  if (filter === 'semana') {
    const weekday = date.getDay()
    const mondayOffset = weekday === 0 ? -6 : 1 - weekday

    const start = new Date(date)
    start.setDate(date.getDate() + mondayOffset)

    const end = new Date(start)
    end.setDate(start.getDate() + 6)

    return { start, end }
  }

  if (filter === 'mes') {
    const start = new Date(date.getFullYear(), date.getMonth(), 1)
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    return { start, end }
  }

  return { start: date, end: date }
}

  const parseSaleDate = (saleDate: string) => {
    const [datePart] = saleDate.split(' ')
    const [day, month, year] = datePart.split('/')
    return new Date(`${year}-${month}-${day}T00:00:00`)
  }

  const getReferenceDate = () => {
    return fromDate ? new Date(`${fromDate}T00:00:00`) : new Date('2023-10-24T00:00:00')
  }

  // const getWeekBounds = (date: Date) => {
  //   const weekday = date.getDay()
  //   const mondayOffset = weekday === 0 ? -6 : 1 - weekday
  //   const weekStart = new Date(date)
  //   weekStart.setDate(date.getDate() + mondayOffset)
  //   const weekEnd = new Date(weekStart)
  //   weekEnd.setDate(weekStart.getDate() + 6)
  //   return { weekStart, weekEnd }
  // }

  const isSaleInsideDateFilter = (sale: Sale) => {
    const saleDate = parseSaleDate(sale.date)
    const referenceDate = getReferenceDate()

    if (dateFilter === 'dia') {
      return saleDate.toDateString() === referenceDate.toDateString()
    }

    if (dateFilter === 'semana' || dateFilter === 'mes') {
      const referenceDate = getReferenceDate()
      const { start, end } = getAutoRange(referenceDate, dateFilter)

      return saleDate >= start && saleDate <= end
    }

    if (dateFilter === 'anio') {
      return saleDate.getFullYear() === referenceDate.getFullYear()
    }

    const start = fromDate ? new Date(`${fromDate}T00:00:00`) : null
    const end = toDate ? new Date(`${toDate}T00:00:00`) : null
    return (!start || saleDate >= start) && (!end || saleDate <= end)
  }

  const filteredSales = useMemo(
    () => sales.filter((sale) => isSaleInsideDateFilter(sale)),
    [sales, dateFilter, fromDate, toDate],
  )

  const handleAddSale = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const product = getInputValue(formData, 'product')
    const quantity = Number(getInputValue(formData, 'quantity'))
    const unit = getInputValue(formData, 'unit')
    const unitPrice = Number(getInputValue(formData, 'unitPrice'))
    const payment = getInputValue(formData, 'payment')
    const date = getInputValue(formData, 'date')
    const time = getInputValue(formData, 'time')

    if (!product || !quantity || !unitPrice || !date || !time) {
      return
    }

    const [year, month, day] = date.split('-')
    const newSale: Sale = {
      date: `${day}/${month}/${year} ${time}`,
      product,
      quantity: `${quantity} ${unit}`,
      unitPrice: currencyFormatter.format(unitPrice),
      total: currencyFormatter.format(quantity * unitPrice),
      payment,
    }

    setSales((currentSales) => [newSale, ...currentSales])
    event.currentTarget.reset()
    setShowSaleForm(false)
  }

  return (
    <main className="admin-shell" id="ventas">
      <AdminSidebar activePage="ventas" />

      <section className="admin-main">
        <AdminHeader />

        <div className="admin-content sales-page">
          <div className="page-heading">
            <div>
              <p>Principal / Ventas</p>
              <h1>Registro de Ventas</h1>
            </div>
            <div className="page-actions">
              <button className="secondary-action-button" type="button" onClick={() => setShowSaleForm((show) => !show)}>
                {showSaleForm ? 'Cancelar' : 'Nueva venta'}
              </button>
              <button className="export-button sales-export" type="button">
                Exportar
              </button>
            </div>
          </div>

          {showSaleForm && (
            <section className="new-sale-panel" aria-label="Agregar nueva venta">
              <div className="panel-heading">
                <h2>Nueva venta</h2>
              </div>
              <form className="new-sale-form" onSubmit={handleAddSale}>
                <label>
                  Fecha <input name="date" type="date" defaultValue="2023-10-24" required />
                </label>
                <label>
                  Hora <input name="time" type="time" defaultValue="17:00" required />
                </label>
                <label>
                  Producto <input name="product" type="text" placeholder="Nombre del producto" required />
                </label>
                <label>
                  Cantidad <input name="quantity" type="number" min="1" step="1" placeholder="0" required />
                </label>
                <label>
                  Unidad <select name="unit" defaultValue="unid.">
                    <option value="unid.">Unidades</option>
                    <option value="bultos">Bultos</option>
                    <option value="bolsas">Bolsas</option>
                    <option value="rollos">Rollos</option>
                    <option value="kg">Kg</option>
                  </select>
                </label>
                <label>
                  Precio unitario <input name="unitPrice" type="number" min="0" step="0.01" placeholder="0.00" required />
                </label>
                <label>
                  Metodo de pago <select name="payment" defaultValue="Efectivo">
                    <option value="Efectivo">Efectivo</option>
                    <option value="Transferencia">Transferencia</option>
                    <option value="Tarjeta">Tarjeta</option>
                    <option value="Credito">Credito</option>
                  </select>
                </label>
                <button type="submit">Guardar venta</button>
              </form>
            </section>
          )}

          <section className="sales-summary-grid" aria-label="Resumen de ventas">
            <article className="sales-focus-card">
              <span>Ventas del dia</span>
              <strong>{salesSummary.quantityToday}</strong>
              <div>
                <p>
                  Total vendido <b>{salesSummary.totalToday}</b>
                </p>
                <p>
                  Utilidades <b>{salesSummary.profitToday}</b>
                </p>
              </div>
            </article>

            <article className="sales-small-card">
              <span>Metodo de pago mas frecuente</span>
              <strong>{salesSummary.frequentPayment}</strong>
              <p>45% del volumen total</p>
            </article>

            <article className="sales-small-card sales-credit-card">
              <span>Total en creditos realizados</span>
              <strong>{salesSummary.creditTotal}</strong>
              <p>15 cuentas por cobrar</p>
            </article>
          </section>

          <section className="sales-filter-panel" aria-label="Filtros de ventas">
            <PeriodFilter
              dateFilter={dateFilter}
              fromDate={fromDate}
              toDate={toDate}
              onDateFilterChange={setDateFilter}
              onFromDateChange={setFromDate}
              onToDateChange={setToDate}
            />
          </section>

          <section className="sales-table-panel">
            <div className="sales-table" role="table" aria-label="Ventas realizadas">
              <div className="sales-table-header" role="row">
                <span role="columnheader">Fecha</span>
                <span role="columnheader">Producto</span>
                <span role="columnheader">Cantidad</span>
                <span role="columnheader">Precio unitario</span>
                <span role="columnheader">Total</span>
                <span role="columnheader">Metodo de pago</span>
              </div>

              {filteredSales.map((sale) => (
                <div className="sales-table-row" role="row" key={`${sale.date}-${sale.product}-${sale.total}`}>
                  <span role="cell">{sale.date}</span>
                  <strong role="cell">{sale.product}</strong>
                  <span role="cell">{sale.quantity}</span>
                  <span role="cell">{sale.unitPrice}</span>
                  <strong role="cell">{sale.total}</strong>
                  <span className={`payment-badge ${sale.payment.toLowerCase()}`} role="cell">
                    {sale.payment}
                  </span>
                </div>
              ))}
            </div>

            <footer className="table-footer">
              <span>Mostrando 1 a {sales.length} de 542 registros</span>
              <div>
                <button type="button" aria-label="Pagina anterior">
                  {'<'}
                </button>
                <button className="active" type="button">
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

export default Ventas
