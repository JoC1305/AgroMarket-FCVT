import { useEffect, useMemo, useState } from 'react'
import type { PurchaseStatus } from '../types/purchase'
import styles from './RegistrarCompra.module.css'

type RegistrarCompraMode = 'new' | 'edit'

type RegistrarCompraValues = {
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

type RegistrarCompraProps = {
  mode: RegistrarCompraMode
  initialValues?: RegistrarCompraValues
  onSave: (purchase: RegistrarCompraValues) => void
  onCancel: () => void
}

const purchaseStatusOptions: PurchaseStatus[] = ['recibido', 'en-camino', 'cancelado', 'pendiente']

function getCurrentDateString() {
  return new Date().toISOString().slice(0, 10)
}

export default function RegistrarCompra({ mode, initialValues, onSave, onCancel }: RegistrarCompraProps) {
  const currentUser = useMemo(() => window.localStorage.getItem('agromarket-user') ?? 'Usuario', [])
  const [product, setProduct] = useState(initialValues?.product ?? '')
  const [quantity, setQuantity] = useState(initialValues?.quantity ?? 1)
  const [unit, setUnit] = useState(initialValues?.unit ?? 'Unid.')
  const [provider, setProvider] = useState(initialValues?.provider ?? '')
  const [purchasePrice, setPurchasePrice] = useState(initialValues?.purchasePrice ?? 0)
  const [status, setStatus] = useState<PurchaseStatus>(initialValues?.status ?? 'pendiente')
  const [purchaseDate, setPurchaseDate] = useState(initialValues?.purchaseDate ?? getCurrentDateString())
  const [deliveryDate, setDeliveryDate] = useState(initialValues?.deliveryDate ?? getCurrentDateString())

  useEffect(() => {
    if (initialValues) {
      setProduct(initialValues.product)
      setQuantity(initialValues.quantity)
      setUnit(initialValues.unit)
      setProvider(initialValues.provider)
      setPurchasePrice(initialValues.purchasePrice)
      setStatus(initialValues.status)
      setPurchaseDate(initialValues.purchaseDate)
      setDeliveryDate(initialValues.deliveryDate)
    } else {
      setProduct('')
      setQuantity(1)
      setUnit('Unid.')
      setProvider('')
      setPurchasePrice(0)
      setStatus('pendiente')
      setPurchaseDate(getCurrentDateString())
      setDeliveryDate(getCurrentDateString())
    }
  }, [initialValues])

  const isValid = product.trim() && provider.trim() && quantity > 0 && purchasePrice > 0 && deliveryDate

  const unitPrice = useMemo(() => {
    if (quantity <= 0) return 0
    return purchasePrice / quantity
  }, [quantity, purchasePrice])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isValid) {
      return
    }

    onSave({
      id: initialValues?.id,
      product: product.trim(),
      quantity,
      unit,
      provider: provider.trim(),
      purchasePrice,
      status,
      purchaseDate,
      deliveryDate,
      createdBy: currentUser,
    })

    if (mode === 'new') {
      setProduct('')
      setQuantity(1)
      setUnit('Unid.')
      setProvider('')
      setPurchasePrice(0)
      setStatus('pendiente')
      setPurchaseDate(getCurrentDateString())
      setDeliveryDate(getCurrentDateString())
    }
  }

  return (
    <section className={styles.purchaseFormPanel} aria-label="Registrar nueva compra">
      <div className={styles.purchaseFormHeader}>
        <div>
          <p className={styles.formEyebrow}>{mode === 'edit' ? 'Editar compra' : 'Registrar compra'}</p>
          <h2>{mode === 'edit' ? 'Editar compra' : 'Nueva compra'}</h2>
          <p className={styles.formSubtitle}>Usuario: <strong>{currentUser}</strong></p>
        </div>
      </div>

      <form className={styles.purchaseForm} onSubmit={handleSubmit}>
        <label>
          Producto
          <input value={product} onChange={(event) => setProduct(event.target.value)} type="text" placeholder="Nombre del producto" required />
        </label>

        <label>
          Cantidad
          <input
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
            type="number"
            min="1"
            step="1"
            required
          />
        </label>

        <label>
          Proveedor
          <input
            value={provider}
            onChange={(event) => setProvider(event.target.value)}
            type="text"
            placeholder="Nombre del proveedor"
            required
            disabled={mode === 'edit'}
          />
        </label>

        <label>
          Precio total de compra
          <input
            value={purchasePrice}
            onChange={(event) => setPurchasePrice(Number(event.target.value))}
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            required
          />
        </label>

        <label>
          Precio por unidad
          <input value={unitPrice.toFixed(2)} type="text" disabled />
        </label>

        <label>
          Estado
          <select value={status} onChange={(event) => setStatus(event.target.value as PurchaseStatus)}>
            {purchaseStatusOptions.map((option) => (
              <option key={option} value={option}>
                {option === 'en-camino' ? 'En camino' : option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </label>

        <label>
          Fecha de compra
          <input type="date" value={purchaseDate} disabled />
        </label>

        <label>
          Fecha de entrega
          <input
            type="date"
            value={deliveryDate}
            onChange={(event) => setDeliveryDate(event.target.value)}
            required
          />
        </label>

        <div className={styles.formActions}>
          <button type="button" className={styles.secondaryButton} onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit" className={styles.primaryButton} disabled={!isValid}>
            Guardar compra
          </button>
        </div>
      </form>
    </section>
  )
}
