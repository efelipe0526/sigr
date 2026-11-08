import { ArrowRight, Check, ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Order, OrderStatus, User } from '../types'
import { formatCOP, orderStatuses } from '../lib/restaurant'

interface OrdersSectionProps {
  orders: Order[]
  user: User | null
  onAdvance: (orderId: string) => void
}

export function OrdersSection({ orders, user, onAdvance }: OrdersSectionProps) {
  const visibleOrders = user?.role === 'cliente' ? orders.filter((order) => order.customer === user.name) : orders
  const canManage = user?.role === 'administrador' || user?.role === 'mesero'

  return (
    <section>
      <div className="section-heading">
        <div><span className="eyebrow">Seguimiento en tiempo real</span><h2>Pedidos</h2><p>Consulta el estado de cada orden desde su recepción hasta la entrega.</p></div>
      </div>
      {visibleOrders.length === 0 ? (
        <div className="empty-panel"><ClipboardList size={40} /><h3>No hay pedidos para mostrar</h3><p>Cuando confirms una orden, aquí podrás seguir su preparación.</p></div>
      ) : (
        <div className="orders-list">
          {visibleOrders.map((order) => (
            <article className="order-card" key={order.id}>
              <div className="order-header">
                <div><span className="order-id">{order.id}</span><h3>{order.customer}</h3><time>{new Date(order.createdAt).toLocaleString('es-CO')}</time></div>
                <strong>{formatCOP(order.total)}</strong>
              </div>
              <ul className="order-products">
                {order.items.map((item) => <li key={`${order.id}-${item.name}`}><span>{item.quantity} × {item.name}</span><span>{formatCOP(item.price * item.quantity)}</span></li>)}
              </ul>
              <div className="status-track" aria-label={`Estado del pedido: ${order.status}`}>
                {orderStatuses.map((status: OrderStatus, index) => {
                  const current = orderStatuses.indexOf(order.status)
                  return <div className={`status-step ${index <= current ? 'completed' : ''}`} key={status}><span>{index < current ? <Check size={13} /> : index + 1}</span><small>{status}</small></div>
                })}
              </div>
              {canManage && order.status !== 'Entregado' && <Button className="sigr-button" onClick={() => onAdvance(order.id)}>Avanzar estado <ArrowRight size={16} /></Button>}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
