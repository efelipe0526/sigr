import type { Dish, User } from '../types'

export const initialCategories = ['Platos fuertes', 'Perros calientes', 'Acompañamientos']

export const initialDishes: Dish[] = [
  {
    id: 'hamburguesa-casa',
    name: 'Hamburguesa de la casa',
    category: 'Platos fuertes',
    price: 18000,
    image: './images/hamburguesa.jpg',
    description: 'Carne de res, queso, vegetales frescos y pan artesanal.',
  },
  {
    id: 'perro-caliente',
    name: 'Perro caliente',
    category: 'Perros calientes',
    price: 12000,
    image: './images/perro-caliente.jpg',
    description: 'Salchicha, pan suave y salsas de la casa.',
  },
  {
    id: 'papas-fritas',
    name: 'Papas fritas',
    category: 'Acompañamientos',
    price: 8000,
    image: './images/papas-fritas.jpg',
    description: 'Porción dorada y crujiente, preparada al momento.',
  },
]

export const demoAccounts: Array<User & { password: string }> = [
  { name: 'Erick Guardo Díaz', username: 'admin', password: 'admin123', role: 'administrador' },
  { name: 'Einer Plaza Prasca', username: 'mesero', password: 'mesero123', role: 'mesero' },
  { name: 'Cliente demostrativo', username: 'cliente', password: 'cliente123', role: 'cliente' },
]

export const imageOptions = [
  { label: 'Hamburguesa', value: './images/hamburguesa.jpg' },
  { label: 'Perro caliente', value: './images/perro-caliente.jpg' },
  { label: 'Papas fritas', value: './images/papas-fritas.jpg' },
]
