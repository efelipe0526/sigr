import type { Order, OrderItem, OrderStatus } from '../types'

export const orderStatuses: OrderStatus[] = ['Recibido', 'En preparación', 'Listo', 'Entregado']

export function formatCOP(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value)
}

export function calculateTotal(items: Array<Pick<OrderItem, 'price' | 'quantity'>>): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0)
}

export function nextOrderStatus(status: OrderStatus): OrderStatus {
  const currentIndex = orderStatuses.indexOf(status)
  return orderStatuses[Math.min(currentIndex + 1, orderStatuses.length - 1)]
}

export function ordersForDate(orders: Order[], date: Date): Order[] {
  const localDate = [date.getFullYear(), date.getMonth(), date.getDate()].join('-')
  return orders.filter((order) => {
    const created = new Date(order.createdAt)
    return [created.getFullYear(), created.getMonth(), created.getDate()].join('-') === localDate
  })
}

export function averageOrderValue(orders: Order[]): number {
  return orders.length === 0 ? 0 : calculateTotal(orders.map((order) => ({ price: order.total, quantity: 1 }))) / orders.length
}

export function reservationIsValid(name: string, date: string, time: string, guests: number): boolean {
  return name.trim().length >= 3 && /^\d{4}-\d{2}-\d{2}$/.test(date) && /^\d{2}:\d{2}$/.test(time) && guests >= 1 && guests <= 20
}

export function ordersToCsv(orders: Order[]): string {
  const rows = [
    ['Pedido', 'Cliente', 'Fecha', 'Estado', 'Total'],
    ...orders.map((order) => [order.id, order.customer, order.createdAt, order.status, String(order.total)]),
  ]
  return rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(',')).join('\n')
}
