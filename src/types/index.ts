export type Role = 'cliente' | 'mesero' | 'administrador'

export interface User {
  name: string
  username: string
  role: Role
}

export interface Dish {
  id: string
  name: string
  category: string
  price: number
  image: string
  description: string
}

export interface CartItem {
  dishId: string
  quantity: number
}

export interface OrderItem {
  name: string
  category: string
  price: number
  quantity: number
}

export type OrderStatus = 'Recibido' | 'En preparación' | 'Listo' | 'Entregado'

export interface Order {
  id: string
  customer: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  createdAt: string
}

export interface Reservation {
  id: string
  name: string
  date: string
  time: string
  guests: number
  status: 'Confirmada'
}

export interface CashClosure {
  id: string
  createdAt: string
  orderCount: number
  total: number
  responsible: string
}

export type Section = 'menu' | 'pedidos' | 'reservas' | 'administracion' | 'reportes' | 'usuarios'
