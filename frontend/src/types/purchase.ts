export type PurchaseStatus = 'recibido' | 'en-camino' | 'cancelado' | 'pendiente'

export type Purchase = {
  id: string
  purchaseDate: string
  product: string
  sku: string
  quantity: number
  unit: string
  provider: string
  purchasePrice: number
  status: PurchaseStatus
}
