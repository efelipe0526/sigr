import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { CartItem, Dish } from '../types'
import { formatCOP } from '../lib/restaurant'

interface MenuSectionProps {
  dishes: Dish[]
  cart: CartItem[]
  onAdd: (dish: Dish) => void
  onQuantity: (dishId: string, change: number) => void
  onClear: () => void
  onFinalize: () => void
}

export function MenuSection({ dishes, cart, onAdd, onQuantity, onClear, onFinalize }: MenuSectionProps) {
  const detailedCart = cart.flatMap((item) => {
    const dish = dishes.find((candidate) => candidate.id === item.dishId)
    return dish ? [{ ...item, dish }] : []
  })
  const total = detailedCart.reduce((sum, item) => sum + item.dish.price * item.quantity, 0)

  return (
    <div className="menu-layout">
      <div>
        <div className="section-heading">
          <div>
            <span className="eyebrow">Cocina a la carta</span>
            <h2>Nuestro menú</h2>
            <p>Elige tus favoritos y confirma tu pedido en línea.</p>
          </div>
          <span className="menu-count">{dishes.length} platos disponibles</span>
        </div>
        <div className="dish-grid">
          {dishes.map((dish) => (
            <article className="dish-card" key={dish.id}>
              <div className="dish-image-wrap">
                <img src={dish.image} alt={`Fotografía de ${dish.name}`} className="dish-image" />
                <span className="category-pill">{dish.category}</span>
              </div>
              <div className="dish-content">
                <h3>{dish.name}</h3>
                <p>{dish.description}</p>
                <div className="dish-footer">
                  <strong>{formatCOP(dish.price)}</strong>
                  <Button className="sigr-button" onClick={() => onAdd(dish)}>
                    <Plus size={16} /> Agregar
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <aside className="cart-card" aria-label="Carrito de compras">
        <div className="cart-title">
          <span className="icon-box"><ShoppingBag size={20} /></span>
          <div><h2>Mi pedido</h2><p>Resumen de tu orden</p></div>
        </div>
        {detailedCart.length === 0 ? (
          <div className="empty-state">
            <ShoppingBag size={32} />
            <p>Tu carrito está vacío.</p>
            <span>Agrega un plato del menú para comenzar.</span>
          </div>
        ) : (
          <div className="cart-items">
            {detailedCart.map(({ dish, quantity }) => (
              <div className="cart-item" key={dish.id}>
                <div><strong>{dish.name}</strong><span>{formatCOP(dish.price)} c/u</span></div>
                <div className="quantity-control" aria-label={`Cantidad de ${dish.name}`}>
                  <button aria-label={`Quitar una unidad de ${dish.name}`} onClick={() => onQuantity(dish.id, -1)}><Minus size={14} /></button>
                  <span>{quantity}</span>
                  <button aria-label={`Agregar una unidad de ${dish.name}`} onClick={() => onQuantity(dish.id, 1)}><Plus size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="cart-total"><span>Total</span><strong>{formatCOP(total)}</strong></div>
        <Button className="sigr-button checkout-button" disabled={cart.length === 0} onClick={onFinalize}>Finalizar pedido</Button>
        {cart.length > 0 && <Button variant="ghost" className="clear-button" onClick={onClear}><Trash2 size={15} /> Vaciar carrito</Button>}
      </aside>
    </div>
  )
}
