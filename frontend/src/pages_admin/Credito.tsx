import { useMemo, useState } from 'react'
import AdminHeader from '../components/AdminHeader'
import AdminSidebar from '../components/AdminSidebar'
import Icon from '../components/Icon'

type Credito = {
  id: string
  cliente: string
  productos: string
  montoTotal: string
  saldo: string
  vencimiento: string
  estado: 'pagado' | 'pendiente' | 'vencido' | 'proximo'
}

type FiltroEstado = 'todos' | 'pagado' | 'pendiente' | 'vencido' | 'proximo'
type FiltroPeriodo = 'todos' | 'dia' | 'semana' | 'mes' | 'anio' | 'rango'
type OrdenPor = 'nombre-asc' | 'nombre-desc' | 'monto-asc' | 'monto-desc' | 'saldo-asc' | 'saldo-desc'

const resumenCreditos = [
  {
    etiqueta: 'Total créditos activos',
    valor: '34',
    color: 'verde',
    icono: 'credits' as const,
  },
  {
    etiqueta: 'Monto total financiado',
    valor: '$12,450.00',
    color: 'azul',
    icono: 'trend' as const,
  },
  {
    etiqueta: 'Créditos próximos a vencer',
    valor: '5',
    color: 'amarillo',
    icono: 'alerts' as const,
  },
  {
    etiqueta: 'Créditos vencidos',
    valor: '2',
    color: 'coral',
    icono: 'alerts' as const,
  },
  {
    etiqueta: 'Pagado este mes',
    valor: '$4,200.00',
    color: 'gris',
    icono: 'sales' as const,
  },
]

const movimientosCreditos: Credito[] = [
  {
    id: '#CR-1824',
    cliente: 'Juan Pérez',
    productos: 'Arroz, Aceite, Leche',
    montoTotal: '$150.00',
    saldo: '$45.00',
    vencimiento: '25/10/2023',
    estado: 'pagado',
  },
  {
    id: '#CR-1825',
    cliente: 'María Rodríguez',
    productos: 'Fertilizante NPK, Semillas',
    montoTotal: '$840.00',
    saldo: '$840.00',
    vencimiento: '15/10/2023',
    estado: 'vencido',
  },
  {
    id: '#CR-1828',
    cliente: 'Carlos Gómez',
    productos: 'Herramientas Manuales',
    montoTotal: '$320.00',
    saldo: '$0.00',
    vencimiento: '20/10/2023',
    estado: 'pagado',
  },
  {
    id: '#CR-1831',
    cliente: 'Ana López',
    productos: 'Balanceado Aves x 50kg',
    montoTotal: '$540.00',
    saldo: '$210.00',
    vencimiento: '21/10/2023',
    estado: 'proximo',
  },
]

const fechaReferencia = new Date('2023-10-22T00:00:00')

const convertirFecha = (valor: string) => {
  const [dia, mes, anio] = valor.split('/').map(Number)
  return new Date(anio, mes - 1, dia)
}

const convertirMoneda = (valor: string) => Number(valor.replace(/[$,]/g, ''))

const obtenerEstadoLabel = (estado: Credito['estado']) => {
  if (estado === 'pagado') return 'Pagado'
  if (estado === 'vencido') return 'Vencido'
  if (estado === 'proximo') return 'Próximo a vencer'
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
  const [desde, setDesde] = useState('2023-10-01')
  const [hasta, setHasta] = useState('2023-10-31')
  const [montoMinimo, setMontoMinimo] = useState('')
  const [montoMaximo, setMontoMaximo] = useState('')
  const [filtrosAplicados, setFiltrosAplicados] = useState({
    busqueda: '',
    estadoFiltro: 'todos' as FiltroEstado,
    periodoFiltro: 'todos' as FiltroPeriodo,
    ordenPor: 'nombre-asc' as OrdenPor,
    desde: '2023-10-01',
    hasta: '2023-10-31',
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
    setDesde('2023-10-01')
    setHasta('2023-10-31')
    setMontoMinimo('')
    setMontoMaximo('')
    setFiltrosAplicados({
      busqueda: '',
      estadoFiltro: 'todos',
      periodoFiltro: 'todos',
      ordenPor: 'nombre-asc',
      desde: '2023-10-01',
      hasta: '2023-10-31',
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
              <p>Principal / Créditos</p>
              <h1>Administración de Créditos</h1>
            </div>
          </div>

          <section className="tarjetas-resumen" aria-label="Resumen de créditos">
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

          <section className="buscador-admin" aria-label="Buscador de créditos">
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

          <section className="panel-filtros" aria-label="Filtros de créditos">
            <label className="campo-filtro">
              Estado
              <select value={estadoFiltro} onChange={(event) => setEstadoFiltro(event.target.value as FiltroEstado)}>
                <option value="todos">Todos</option>
                <option value="pagado">Pagado</option>
                <option value="pendiente">Pendiente</option>
                <option value="vencido">Vencido</option>
                <option value="proximo">Próximo a vencer</option>
              </select>
            </label>

            <label className="campo-filtro">
              Periodo
              <select value={periodoFiltro} onChange={(event) => setPeriodoFiltro(event.target.value as FiltroPeriodo)}>
                <option value="todos">Todos</option>
                <option value="dia">Día</option>
                <option value="semana">Semana</option>
                <option value="mes">Mes</option>
                <option value="anio">Año</option>
                <option value="rango">Rango</option>
              </select>
            </label>

            <label className="campo-filtro">
              Ordenar
              <select value={ordenPor} onChange={(event) => setOrdenPor(event.target.value as OrdenPor)}>
                <option value="nombre-asc">Cliente A → Z</option>
                <option value="nombre-desc">Cliente Z → A</option>
                <option value="monto-asc">Monto menor → mayor</option>
                <option value="monto-desc">Monto mayor → menor</option>
                <option value="saldo-asc">Saldo menor → mayor</option>
                <option value="saldo-desc">Saldo mayor → menor</option>
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
              Monto mínimo
              <input type="number" min="0" value={montoMinimo} onChange={(event) => setMontoMinimo(event.target.value)} />
            </label>

            <label className="campo-filtro">
              Monto máximo
              <input type="number" min="0" value={montoMaximo} onChange={(event) => setMontoMaximo(event.target.value)} />
            </label>
          </section>

          <section className="seccion-movimientos" aria-label="Últimos movimientos de créditos">
            <div className="panel-heading">
              <h2>Últimos movimientos</h2>
            </div>

            <div className="tabla-creditos" role="table" aria-label="Tabla de créditos recientes">
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
