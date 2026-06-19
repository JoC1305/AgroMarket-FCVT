import purchasesData from '../mocks/purchases.json'
import type { Purchase } from '../types/purchase'

export function getPurchases(): Purchase[] {
  return purchasesData as Purchase[]
}
