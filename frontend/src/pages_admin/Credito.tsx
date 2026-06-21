import { useMemo, useState } from 'react'
import AdminHeader from '../components/AdminHeader'
import AdminSidebar from '../components/AdminSidebar'
import Icon from '../components/Icon'
import clientesData from '../mocks/clientes.json'
import creditosData from '../mocks/creditos.json'
import productosData from '../mocks/productos.json'
import ventasData from '../mocks/ventas.json'

type Credito = {
  id: string
  cliente: string
  productos: string
  montoTotal: string
  saldo: string
  vencimiento: string
  estado: 'pagado' | 'pendiente' | 'vencido' | 'proximo'
}

type FiltroEstado = 'todos' | Credito['estado']
type FiltroPeriodo = 'todos' | 'dia' | 'semana' | 'mes' | 'anio' | 'rango'
type OrdenPor = 'nombre-asc' | 'nombre-desc' | 'monto-asc' | 'monto-desc' | 'saldo-asc' | 'saldo-desc'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
})

const clientes = clientesData
const creditos = creditosData
const productos = productosData
const ventas = ventasData
const clientById = new Map(clientes.map((client) => [client.id, client]))
const productById = new Map(productos.map((product) => [product.id, product]))
const saleById = new Map(ventas.map((sale) => [sale.id, sale]))
const fechaReferencia = new Date(Math.max(...creditos.map((credit) => new Date(`${credit.fechaVencimiento}T00:00:00`).getTime())))

const convertirFecha = (valor: string) => {
  const [dia, mes, anio] = valor.split('/').map(Number)
  return new Date(anio, mes - 1, dia)
}

const convertirMoneda = (valor: string) => Number(valor.replace(/[$,]/g, ''))

const isReferenceMonth = (dateValue: string) => {
  const date = new Date(`${dateValue}T00:00:00`)
  return date.getMonth() === fechaReferencia.getMonth() && date.getFullYear() === fechaReferencia.getFullYear()
}

const getCreditProducts = (saleId: string | null) => {
  if (!saleId) return 'Credito directo'

  const sale = saleById.get(saleId)
  if (!sale) return 'Venta no encontrada'

  return sale.items.map((item) => productById.get(item.productoId)?.nombre ?? item.productoId).join(', ')
}

const resumenCreditos = [
  {
    etiqueta: 'Total creditos activos',
    valor: String(creditos.filter((credit) => credit.saldoPendiente > 0).length),
    color: 'verde',
    icono: 'credits' as const,
  },
  {
    etiqueta: 'Monto total financiado',
    valor: currencyFormatter.format(creditos.reduce((total, credit) => total + credit.montoTotal, 0)),
    color: 'azul',
    icono: 'trend' as const,
  },
  {
    etiqueta: 'Creditos proximos a vencer',
    valor: String(creditos.filter((credit) => credit.estado === 'proximo').length),
    color: 'amarillo',
    icono: 'alerts' as const,
  },
  {
    etiqueta: 'Creditos vencidos',
    valor: String(creditos.filter((credit) => credit.estado === 'vencido').length),
    color: 'coral',
    icono: 'alerts' as const,
  },
  {
    etiqueta: 'Pagado este mes',
    valor: currencyFormatter.format(
      creditos.reduce(
        (total, credit) =>
          total + credit.pagos.filter((payment) => isReferenceMonth(payment.fecha)).reduce((sum, payment) => sum + payment.monto, 0),
        0,
      ),
    ),
    color: 'gris',
    icono: 'sales' as const,
  },
]

const movimientosCreditos: Credito[] = creditos.map((credit) => ({
  id: credit.id,
  cliente: clientById.get(credit.clienteId)?.nombre ?? credit.clienteId,
  productos: getCreditProducts(credit.ventaId),
  montoTotal: currencyFormatter.format(credit.montoTotal),
  saldo: currencyFormatter.format(credit.saldoPendiente),
  vencimiento: credit.fechaVencimiento.split('-').reverse().join('/'),
  estado: credit.estado as Credito['estado'],
}))

const obtenerEstadoLabel = (estado: Credito['estado']) => {
  if (estado === 'pagado') return 'Pagado'
  if (estado === 'vencido') return 'Vencido'
  if (estado === 'proximo') return 'Proximo a vencer'
  return 'Pendiente'
}

const aplicarFiltroPeriodo = (fecha: Date, periodo: FiltroPeriodo) => {
  if (periodo === 'todos') return true

  const diferencia = fechaReferencia.getTime() - fecha.getTime()
  const dias = Math.round(diferencia / (1000 * 60 * 60 * 24))

  if (periodo === 'dia') return fecha.toDateString() === fechaReferencia.toDateString()
  if (periodo === 'semana') return dias >= 0 && dias <= 7
  if (periodo === 'mes') return fecha.getMonth() === fechaReferencia.getMonth() && fecha.getFullYear() === fechaReferencia.getFullYear()
  if (periodo === 'anio') return fecha.getFullYear() === fechaReferencia.getFullYear()

  return true
}

function Credito() {
  const [busqueda, setBusqueda] = useState('')
  const [estadoFiltro, setEstadoFiltro] = useState<FiltroEstado>('todos')
  const [periodoFiltro, setPeriodoFiltro] = useState<FiltroPeriodo>('todos')
  const [ordenPor, setOrdenPor] = useState<OrdenPor>('nombre-asc')
  const [desde, setDesde] = useState('2026-06-01')
  const [hasta, setHasta] = useState('2026-06-30')
  const [montoMinimo, setMontoMinimo] = useState('')
  const [montoMaximo, setMontoMaximo] = useState('')
  const [filtrosAplicados, setFiltrosAplicados] = useState({
    busqueda: '',
    estadoFiltro: 'todos' as FiltroEstado,
    periodoFiltro: 'todos' as FiltroPeriodo,
    ordenPor: 'nombre-asc' as OrdenPor,
    desde: '2026-06-01',
    hasta: '2026-06-30',
    montoMinimo: '',
    montoMaximo: '',
  })

  const aplicarFiltros = () => {
    setFiltrosAplicados({
      busqueda,
      estadoFiltro,
      periodoFiltro,
      ordenPor,
      desde,
      hasta,
      montoMinimo,
      montoMaximo,
    })
  }

  const limpiarFiltros = () => {
    setBusqueda('')
    setEstadoFiltro('todos')
    setPeriodoFiltro('todos')
    setOrdenPor('nombre-asc')
    setDesde('2026-06-01')
    setHasta('2026-06-30')
    setMontoMinimo('')
    setMontoMaximo('')
    setFiltrosAplicados({
      busqueda: '',
      estadoFiltro: 'todos',
      periodoFiltro: 'todos',
      ordenPor: 'nombre-asc',
      desde: '2026-06-01',
      hasta: '2026-06-30',
      montoMinimo: '',
      montoMaximo: '',
    })
  }

  const creditosFiltrados = useMemo(() => {
    return movimientosCreditos
      .filter((credito) => {
        const texto = `${credito.id} ${credito.cliente} ${credito.productos}`.toLowerCase()
        const coincideBusqueda = !filtrosAplicados.busqueda || texto.includes(filtrosAplicados.busqueda.toLowerCase())
        const coincideEstado = filtrosAplicados.estadoFiltro === 'todos' || credito.estado === filtrosAplicados.estadoFiltro
        const fechaCredito = convertirFecha(credito.vencimiento)
        const coincidePeriodo = aplicarFiltroPeriodo(fechaCredito, filtrosAplicados.periodoFiltro)
        const coincideRango =
          filtrosAplicados.periodoFiltro !== 'rango' ||
          ((!filtrosAplicados.desde || fechaCredito >= new Date(`${filtrosAplicados.desde}T00:00:00`)) &&
            (!filtrosAplicados.hasta || fechaCredito <= new Date(`${filtrosAplicados.hasta}T23:59:59`)))
        const montoCredito = convertirMoneda(credito.montoTotal)
        const min = filtrosAplicados.montoMinimo ? Number(filtrosAplicados.montoMinimo) : undefined
        const max = filtrosAplicados.montoMaximo ? Number(filtrosAplicados.montoMaximo) : undefined
        const coincideMonto = (min === undefined || montoCredito >= min) && (max === undefined || montoCredito <= max)

        return coincideBusqueda && coincideEstado && coincidePeriodo && coincideRango && coincideMonto
      })
      .sort((a, b) => {
        if (filtrosAplicados.ordenPor === 'nombre-asc') return a.cliente.localeCompare(b.cliente)
        if (filtrosAplicados.ordenPor === 'nombre-desc') return b.cliente.localeCompare(a.cliente)
        if (filtrosAplicados.ordenPor === 'monto-asc') return convertirMoneda(a.montoTotal) - convertirMoneda(b.montoTotal)
        if (filtrosAplicados.ordenPor === 'monto-desc') return convertirMoneda(b.montoTotal) - convertirMoneda(a.montoTotal)
        if (filtrosAplicados.ordenPor === 'saldo-asc') return convertirMoneda(a.saldo) - convertirMoneda(b.saldo)
        if (filtrosAplicados.ordenPor === 'saldo-desc') return convertirMoneda(b.saldo) - convertirMoneda(a.saldo)
        return 0
      })
  }, [filtrosAplicados])

  return (
    <main className="admin-shell pantalla-creditos" id="creditos">
      <AdminSidebar activePage="creditos" />

      <section className="admin-main">
        <AdminHeader />

        <div className="admin-content">
          <div className="page-heading">
            <div>
              <p>Principal / Creditos</p>
              <h1>Administracion de Creditos</h1>
            </div>
          </div>

          <section className="tarjetas-resumen" aria-label="Resumen de creditos">
            {resumenCreditos.map((resumen) => (
              <article className={`tarjeta-resumen tarjeta-resumen--${resumen.color}`} key={resumen.etiqueta}>
                <div className="tarjeta-resumen-icon" aria-hidden="true">
                  <Icon name={resumen.icono} />
                </div>
                <span>{resumen.etiqueta}</span>
                <strong>{resumen.valor}</strong>
              </article>
            ))}
          </section>

          <section className="buscador-admin" aria-label="Buscador de creditos">
            <label className="admin-search">
              <span className="eyebrow">Buscar</span>
              <input
                type="search"
                value={busqueda}
                onChange={(event) => setBusqueda(event.target.value)}
                placeholder="Buscar por cliente, factura o ID..."
                aria-label="Buscar por cliente, factura o ID"
              />
            </label>
            <button className="secondary-action-button" type="button" onClick={aplicarFiltros}>
              Filtrar
            </button>
            <button className="sales-export" type="button" onClick={limpiarFiltros}>
              Limpiar
            </button>
          </section>

          <section className="panel-filtros" aria-label="Filtros de creditos">
            <label className="campo-filtro">
              Estado
              <select value={estadoFiltro} onChange={(event) => setEstadoFiltro(event.target.value as FiltroEstado)}>
                <option value="todos">Todos</option>
                <option value="pagado">Pagado</option>
                <option value="pendiente">Pendiente</option>
                <option value="vencido">Vencido</option>
                <option value="proximo">Proximo a vencer</option>
              </select>
            </label>

            <label className="campo-filtro">
              Periodo
              <select value={periodoFiltro} onChange={(event) => setPeriodoFiltro(event.target.value as FiltroPeriodo)}>
                <option value="todos">Todos</option>
                <option value="dia">Dia</option>
                <option value="semana">Semana</option>
                <option value="mes">Mes</option>
                <option value="anio">Anio</option>
                <option value="rango">Rango</option>
              </select>
            </label>

            <label className="campo-filtro">
              Ordenar
              <select value={ordenPor} onChange={(event) => setOrdenPor(event.target.value as OrdenPor)}>
                <option value="nombre-asc">Cliente A-Z</option>
                <option value="nombre-desc">Cliente Z-A</option>
                <option value="monto-asc">Monto menor-mayor</option>
                <option value="monto-desc">Monto mayor-menor</option>
                <option value="saldo-asc">Saldo menor-mayor</option>
                <option value="saldo-desc">Saldo mayor-menor</option>
              </select>
            </label>

            <label className="campo-filtro">
              Desde
              <input type="date" value={desde} onChange={(event) => setDesde(event.target.value)} disabled={periodoFiltro !== 'rango'} />
            </label>

            <label className="campo-filtro">
              Hasta
              <input type="date" value={hasta} onChange={(event) => setHasta(event.target.value)} disabled={periodoFiltro !== 'rango'} />
            </label>

            <label className="campo-filtro">
              Monto minimo
              <input type="number" min="0" value={montoMinimo} onChange={(event) => setMontoMinimo(event.target.value)} />
            </label>

            <label className="campo-filtro">
              Monto maximo
              <input type="number" min="0" value={montoMaximo} onChange={(event) => setMontoMaximo(event.target.value)} />
            </label>
          </section>

          <section className="seccion-movimientos" aria-label="Ultimos movimientos de creditos">
            <div className="panel-heading">
              <h2>Ultimos movimientos</h2>
            </div>

            <div className="tabla-creditos" role="table" aria-label="Tabla de creditos recientes">
              <div className="fila-creditos fila-encabezado">
                <span>ID</span>
                <span>Cliente</span>
                <span>Productos</span>
                <span>Monto</span>
                <span>Saldo</span>
                <span>Vencimiento</span>
                <span>Estado</span>
              </div>
              {creditosFiltrados.map((movimiento) => (
                <div className="fila-creditos" key={movimiento.id}>
                  <strong>{movimiento.id}</strong>
                  <span>{movimiento.cliente}</span>
                  <span>{movimiento.productos}</span>
                  <span>{movimiento.montoTotal}</span>
                  <span>{movimiento.saldo}</span>
                  <span>{movimiento.vencimiento}</span>
                  <span className={`estado-credito ${movimiento.estado}`}>{obtenerEstadoLabel(movimiento.estado)}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}

export default Credito
