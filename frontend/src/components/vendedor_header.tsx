import Icon from './Icon'

type HeaderProps = {
  eyebrow: string
  title: string
  searchLabel?: string
  searchShortcut?: string
  onScan?: () => void
  onNewSale?: () => void
}

function Header({
  eyebrow,
  title,
  searchLabel = 'Buscar producto o venta',
  searchShortcut = 'Ctrl + K',
  onScan,
  onNewSale,
}: HeaderProps) {
  return (
    <header className="seller-topbar">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
      </div>

      <div className="seller-search">
        <span aria-hidden="true">{searchLabel}</span>
        <small>{searchShortcut}</small>
      </div>

      <div className="actions seller-actions">
        <button className="button secondary" type="button" onClick={onScan}>
          <Icon name="scan" />
          Escanear producto
        </button>
        <button className="button primary" type="button" onClick={onNewSale}>
          <Icon name="plus" />
          Registrar nueva venta
        </button>
        <button className="icon-button" type="button" aria-label="Alertas">
          <Icon name="bell" />
        </button>
        <button className="icon-button" type="button" aria-label="Configuracion">
          <Icon name="settings" />
        </button>
      </div>
    </header>
  )
}

export default Header
