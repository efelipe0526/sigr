import { useEffect, useMemo, useState } from 'react'
import { BarChart3, CalendarDays, ClipboardList, Github, LogOut, Menu as MenuIcon, ShieldCheck, ShoppingBag, UserRound, UtensilsCrossed } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { demoAccounts, initialCategories, initialDishes } from './data/menu'
import { usePersistentState } from './hooks/usePersistentState'
import { calculateTotal, nextOrderStatus, ordersForDate, ordersToCsv } from './lib/restaurant'
import { AdminSection } from './sections/AdminSection'
import { LoginSection } from './sections/LoginSection'
import { MenuSection } from './sections/MenuSection'
import { OrdersSection } from './sections/OrdersSection'
import { ReportsSection } from './sections/ReportsSection'
import { ReservationsSection } from './sections/ReservationsSection'
import type { CartItem, CashClosure, Dish, Order, Reservation, Section, User } from './types'
import './App.css'

const navigation: Array<{ id: Section; label: string; icon: typeof MenuIcon }> = [
  { id: 'menu', label: 'Menú', icon: MenuIcon },
  { id: 'pedidos', label: 'Pedidos', icon: ClipboardList },
  { id: 'reservas', label: 'Reservas', icon: CalendarDays },
  { id: 'administracion', label: 'Gestión', icon: ShieldCheck },
  { id: 'reportes', label: 'Caja y reportes', icon: BarChart3 },
  { id: 'usuarios', label: 'Usuarios', icon: UserRound },
]

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>('menu')
  const [user, setUser] = usePersistentState<User | null>('sigr-user', null)
  const [dishes, setDishes] = usePersistentState<Dish[]>('sigr-dishes', initialDishes)
  const [categories, setCategories] = usePersistentState<string[]>('sigr-categories', initialCategories)
  const [orders, setOrders] = usePersistentState<Order[]>('sigr-orders', [])
  const [reservations, setReservations] = usePersistentState<Reservation[]>('sigr-reservations', [])
  const [closures, setClosures] = usePersistentState<CashClosure[]>('sigr-closures', [])
  const [cart, setCart] = useState<CartItem[]>([])
  const [notification, setNotification] = useState('')

  useEffect(() => {
    if (!notification) return
    const timer = window.setTimeout(() => setNotification(''), 4500)
    return () => window.clearTimeout(timer)
  }, [notification])

  const dailyOrders = useMemo(() => ordersForDate(orders, new Date()), [orders])
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  function navigate(section: Section) {
    const requiresAdmin = section === 'administracion' || section === 'reportes'
    if (requiresAdmin && user?.role !== 'administrador') {
      setNotification('Esta sección requiere una sesión de administrador. Usa admin / admin123 para validarla.')
      setActiveSection('usuarios')
      return
    }
    setActiveSection(section)
  }

  function login(username: string, password: string): string | null {
    const account = demoAccounts.find((candidate) => candidate.username === username.trim() && candidate.password === password)
    if (!account) return 'Las credenciales no coinciden con ninguna cuenta demostrativa.'
    const authenticatedUser: User = { name: account.name, username: account.username, role: account.role }
    setUser(authenticatedUser)
    setNotification(`Bienvenido, ${authenticatedUser.name}. Sesión iniciada como ${authenticatedUser.role}.`)
    return null
  }

  function logout() {
    setUser(null)
    setActiveSection('menu')
    setNotification('La sesión se cerró correctamente.')
  }

  function addToCart(dish: Dish) {
    setCart((current) => {
      const existing = current.find((item) => item.dishId === dish.id)
      return existing ? current.map((item) => item.dishId === dish.id ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { dishId: dish.id, quantity: 1 }]
    })
    setNotification(`${dish.name} se agregó al pedido.`)
  }

  function changeQuantity(dishId: string, change: number) {
    setCart((current) => current.map((item) => item.dishId === dishId ? { ...item, quantity: item.quantity + change } : item).filter((item) => item.quantity > 0))
  }

  function finalizeOrder() {
    if (!user) {
      setNotification('Inicia sesión para confirmar el pedido. Puedes usar la cuenta cliente / cliente123.')
      setActiveSection('usuarios')
      return
    }
    if (cart.length === 0) return
    const items = cart.flatMap((item) => {
      const dish = dishes.find((candidate) => candidate.id === item.dishId)
      return dish ? [{ name: dish.name, category: dish.category, price: dish.price, quantity: item.quantity }] : []
    })
    const order: Order = {
      id: `SIGR-${String(orders.length + 1).padStart(3, '0')}`,
      customer: user.name,
      items,
      total: calculateTotal(items),
      status: 'Recibido',
      createdAt: new Date().toISOString(),
    }
    setOrders((current) => [...current, order])
    setCart([])
    setActiveSection('pedidos')
    setNotification(`${order.id} confirmado por ${calculateTotal(items).toLocaleString('es-CO')} COP.`)
  }

  function advanceOrder(orderId: string) {
    if (user?.role !== 'administrador' && user?.role !== 'mesero') return
    setOrders((current) => current.map((order) => order.id === orderId ? { ...order, status: nextOrderStatus(order.status) } : order))
    setNotification('El estado del pedido se actualizó correctamente.')
  }

  function addReservation(data: Omit<Reservation, 'id' | 'status'>) {
    setReservations((current) => [...current, { ...data, id: `RES-${Date.now()}`, status: 'Confirmada' }])
    setNotification('La reserva quedó registrada y confirmada.')
  }

  function saveDish(dish: Dish) {
    setDishes((current) => current.some((item) => item.id === dish.id) ? current.map((item) => item.id === dish.id ? dish : item) : [...current, dish])
    setNotification(`El plato ${dish.name} se guardó correctamente.`)
  }

  function deleteDish(id: string) {
    const dish = dishes.find((item) => item.id === id)
    if (!dish || !window.confirm(`¿Eliminar ${dish.name} del menú?`)) return
    setDishes((current) => current.filter((item) => item.id !== id))
    setCart((current) => current.filter((item) => item.dishId !== id))
    setNotification('El plato se eliminó del menú.')
  }

  function addCategory(name: string) {
    if (categories.some((category) => category.toLowerCase() === name.toLowerCase())) {
      setNotification('La categoría ya existe.')
      return
    }
    setCategories((current) => [...current, name])
    setNotification('Categoría creada correctamente.')
  }

  function renameCategory(oldName: string, newName: string) {
    if (categories.some((category) => category !== oldName && category.toLowerCase() === newName.toLowerCase())) {
      setNotification('Ya existe otra categoría con ese nombre.')
      return
    }
    setCategories((current) => current.map((category) => category === oldName ? newName : category))
    setDishes((current) => current.map((dish) => dish.category === oldName ? { ...dish, category: newName } : dish))
    setNotification('Categoría actualizada correctamente.')
  }

  function deleteCategory(name: string) {
    if (dishes.some((dish) => dish.category === name)) {
      setNotification('No puedes eliminar una categoría que tiene platos asociados.')
      return
    }
    setCategories((current) => current.filter((category) => category !== name))
    setNotification('Categoría eliminada correctamente.')
  }

  function closeCash() {
    if (!user || dailyOrders.length === 0) return
    const closure: CashClosure = {
      id: `CIERRE-${Date.now()}`,
      createdAt: new Date().toISOString(),
      orderCount: dailyOrders.length,
      total: calculateTotal(dailyOrders.map((order) => ({ price: order.total, quantity: 1 }))),
      responsible: user.name,
    }
    setClosures((current) => [...current, closure])
    setNotification('Cierre de caja registrado y documentado correctamente.')
  }

  function exportReport() {
    const blob = new Blob([`\uFEFF${ordersToCsv(dailyOrders)}`], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `reporte-ventas-${new Date().toISOString().split('T')[0]}.csv`
    anchor.click()
    URL.revokeObjectURL(url)
    setNotification('Reporte CSV generado correctamente.')
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="#inicio" onClick={() => setActiveSection('menu')}><span><UtensilsCrossed size={24} /></span><div><strong>SIGR</strong><small>Gestión de restaurante</small></div></a>
        <div className="header-actions"><span className="repository-badge">Línea base 1.0.0</span>{user ? <><span className="user-chip"><UserRound size={15} /> {user.name}<small>{user.role}</small></span><Button variant="ghost" size="icon" aria-label="Cerrar sesión" onClick={logout}><LogOut size={18} /></Button></> : <Button variant="outline" className="login-header" onClick={() => setActiveSection('usuarios')}><UserRound size={16} /> Iniciar sesión</Button>}</div>
      </header>

      <nav className="main-nav" aria-label="Secciones del sistema">
        {navigation.map((item) => {
          const Icon = item.icon
          return <button className={activeSection === item.id ? 'active' : ''} key={item.id} onClick={() => navigate(item.id)}><Icon size={17} /><span>{item.label}</span>{item.id === 'pedidos' && orders.length > 0 && <b>{orders.length}</b>}</button>
        })}
      </nav>

      <main>
        {activeSection === 'menu' && <section className="hero" id="inicio"><div className="hero-content"><span className="eyebrow light">Sabor, servicio y control</span><h1>Tu restaurante,<br /><em>mejor organizado.</em></h1><p>Una experiencia digital para gestionar el menú, los pedidos, las reservas y las ventas desde un mismo lugar.</p><Button className="hero-button" onClick={() => document.getElementById('menu-content')?.scrollIntoView({ behavior: 'smooth' })}><ShoppingBag size={18} /> Explorar el menú {cartCount > 0 && <span>{cartCount}</span>}</Button></div><div className="hero-stats"><div><strong>3</strong><span>roles de acceso</span></div><div><strong>100%</strong><span>pedidos trazables</span></div><div><strong>24/7</strong><span>menú disponible</span></div></div></section>}

        <div className="content" id="menu-content">
          {activeSection === 'menu' && <MenuSection dishes={dishes} cart={cart} onAdd={addToCart} onQuantity={changeQuantity} onClear={() => setCart([])} onFinalize={finalizeOrder} />}
          {activeSection === 'pedidos' && <OrdersSection orders={orders} user={user} onAdvance={advanceOrder} />}
          {activeSection === 'reservas' && <ReservationsSection reservations={reservations} user={user} onAdd={addReservation} />}
          {activeSection === 'administracion' && user?.role === 'administrador' && <AdminSection dishes={dishes} categories={categories} onSaveDish={saveDish} onDeleteDish={deleteDish} onAddCategory={addCategory} onRenameCategory={renameCategory} onDeleteCategory={deleteCategory} />}
          {activeSection === 'reportes' && user?.role === 'administrador' && <ReportsSection dailyOrders={dailyOrders} closures={closures} onCloseCash={closeCash} onExport={exportReport} />}
          {activeSection === 'usuarios' && <LoginSection user={user} onLogin={login} onLogout={logout} />}
        </div>
      </main>

      <footer className="site-footer"><div><span className="footer-brand"><UtensilsCrossed size={20} /> SIGR</span><p>Sistema Integral de Gestión de Restaurante</p></div><div><p>Proyecto académico · Ingeniería de Software</p><a href="https://github.com/efelipe0526/sigr" target="_blank" rel="noreferrer"><Github size={16} /> Repositorio oficial</a></div></footer>
      {notification && <div className="toast" role="status">{notification}</div>}
    </div>
  )
}
