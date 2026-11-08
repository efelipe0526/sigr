import { describe, expect, it } from 'vitest'
import type { Order } from '../types'
import { averageOrderValue, calculateTotal, nextOrderStatus, ordersForDate, ordersToCsv, reservationIsValid } from './restaurant'

const order: Order = {
  id: 'SIGR-001', customer: 'Cliente de prueba', status: 'Recibido',
  createdAt: '2026-11-08T12:00:00.000Z', total: 30000,
  items: [{ name: 'Hamburguesa', category: 'Platos fuertes', price: 15000, quantity: 2 }],
}

describe('operaciones del restaurante', () => {
  it('calcula el total de los productos', () => {
    expect(calculateTotal([{ price: 18000, quantity: 2 }, { price: 8000, quantity: 1 }])).toBe(44000)
  })

  it('avanza el estado sin superar Entregado', () => {
    expect(nextOrderStatus('Recibido')).toBe('En preparación')
    expect(nextOrderStatus('Entregado')).toBe('Entregado')
  })

  it('selecciona los pedidos de la fecha indicada', () => {
    expect(ordersForDate([order], new Date('2026-11-08T12:00:00.000Z'))).toHaveLength(1)
    expect(ordersForDate([order], new Date('2026-11-09T12:00:00.000Z'))).toHaveLength(0)
  })

  it('calcula el ticket promedio y el caso sin ventas', () => {
    expect(averageOrderValue([order, { ...order, id: 'SIGR-002', total: 10000 }])).toBe(20000)
    expect(averageOrderValue([])).toBe(0)
  })

  it('valida los datos obligatorios de una reserva', () => {
    expect(reservationIsValid('Erick Guardo', '2026-12-01', '19:30', 4)).toBe(true)
    expect(reservationIsValid('A', '2026-12-01', '19:30', 4)).toBe(false)
    expect(reservationIsValid('Erick Guardo', '2026-12-01', '19:30', 0)).toBe(false)
  })

  it('exporta un CSV con encabezados y pedidos', () => {
    const csv = ordersToCsv([order])
    expect(csv).toContain('"Pedido","Cliente","Fecha","Estado","Total"')
    expect(csv).toContain('SIGR-001')
    expect(csv).toContain('30000')
  })
})
