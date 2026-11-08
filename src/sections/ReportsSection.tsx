import { BarChart3, Download, LockKeyhole, Printer, ReceiptText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { CashClosure, Order } from '../types'
import { averageOrderValue, calculateTotal, formatCOP } from '../lib/restaurant'

interface ReportsSectionProps {
  dailyOrders: Order[]
  closures: CashClosure[]
  onCloseCash: () => void
  onExport: () => void
}

export function ReportsSection({ dailyOrders, closures, onCloseCash, onExport }: ReportsSectionProps) {
  const total = calculateTotal(dailyOrders.map((order) => ({ price: order.total, quantity: 1 })))
  const average = averageOrderValue(dailyOrders)

  return (
    <section>
      <div className="section-heading"><div><span className="eyebrow">Ventas del día</span><h2>Caja y reportes</h2><p>Consolida las ventas, registra el cierre y exporta el reporte diario.</p></div><div className="report-actions"><Button variant="outline" onClick={onExport} disabled={dailyOrders.length === 0}><Download size={16} /> Exportar CSV</Button><Button variant="outline" onClick={() => window.print()}><Printer size={16} /> Imprimir</Button></div></div>
      <div className="metrics-grid">
        <article className="metric-card"><ReceiptText size={22} /><span>Pedidos registrados</span><strong>{dailyOrders.length}</strong></article>
        <article className="metric-card featured"><BarChart3 size={22} /><span>Ventas totales</span><strong>{formatCOP(total)}</strong></article>
        <article className="metric-card"><BarChart3 size={22} /><span>Ticket promedio</span><strong>{formatCOP(average)}</strong></article>
      </div>
      <div className="panel report-table-wrap">
        <div className="report-table-title"><h3>Detalle de ventas</h3><Button className="sigr-button" onClick={onCloseCash} disabled={dailyOrders.length === 0}><LockKeyhole size={16} /> Registrar cierre de caja</Button></div>
        {dailyOrders.length === 0 ? <div className="empty-state"><BarChart3 size={32} /><p>No hay ventas registradas hoy.</p></div> : <div className="table-scroll"><table><thead><tr><th>Pedido</th><th>Cliente</th><th>Hora</th><th>Estado</th><th>Total</th></tr></thead><tbody>{dailyOrders.map((order) => <tr key={order.id}><td>{order.id}</td><td>{order.customer}</td><td>{new Date(order.createdAt).toLocaleTimeString('es-CO')}</td><td>{order.status}</td><td>{formatCOP(order.total)}</td></tr>)}</tbody></table></div>}
      </div>
      <div className="closures"><h3>Cierres registrados</h3>{closures.length === 0 ? <p>No se han registrado cierres de caja.</p> : closures.map((closure) => <article className="closure-row" key={closure.id}><span>{new Date(closure.createdAt).toLocaleString('es-CO')} · {closure.responsible}</span><strong>{closure.orderCount} pedidos · {formatCOP(closure.total)}</strong></article>)}</div>
    </section>
  )
}
