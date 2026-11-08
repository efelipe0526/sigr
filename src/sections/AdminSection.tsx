import { useState, type FormEvent } from 'react'
import { Pencil, Plus, Save, Tags, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { imageOptions } from '../data/menu'
import { formatCOP } from '../lib/restaurant'
import type { Dish } from '../types'

interface AdminSectionProps {
  dishes: Dish[]
  categories: string[]
  onSaveDish: (dish: Dish) => void
  onDeleteDish: (id: string) => void
  onAddCategory: (name: string) => void
  onRenameCategory: (oldName: string, newName: string) => void
  onDeleteCategory: (name: string) => void
}

export function AdminSection({ dishes, categories, onSaveDish, onDeleteDish, onAddCategory, onRenameCategory, onDeleteCategory }: AdminSectionProps) {
  const emptyForm = { name: '', category: categories[0] ?? '', price: '10000', image: imageOptions[0].value, description: '' }
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [categoryName, setCategoryName] = useState('')
  const [editingCategory, setEditingCategory] = useState<string | null>(null)

  function submitDish(event: FormEvent) {
    event.preventDefault()
    const price = Number(form.price)
    if (!form.name.trim() || !form.category || !Number.isFinite(price) || price <= 0) return
    onSaveDish({ id: editingId ?? `plato-${Date.now()}`, name: form.name.trim(), category: form.category, price, image: form.image, description: form.description.trim() || 'Preparado al momento con ingredientes seleccionados.' })
    setEditingId(null)
    setForm(emptyForm)
  }

  function editDish(dish: Dish) {
    setEditingId(dish.id)
    setForm({ name: dish.name, category: dish.category, price: String(dish.price), image: dish.image, description: dish.description })
  }

  function submitCategory(event: FormEvent) {
    event.preventDefault()
    if (!categoryName.trim()) return
    if (editingCategory) onRenameCategory(editingCategory, categoryName.trim())
    else onAddCategory(categoryName.trim())
    setCategoryName('')
    setEditingCategory(null)
  }

  return (
    <section>
      <div className="section-heading"><div><span className="eyebrow">Administración</span><h2>Gestión del menú</h2><p>Crea, consulta, actualiza y elimina platos y categorías.</p></div></div>
      <div className="admin-layout">
        <form className="panel form-panel" onSubmit={submitDish}>
          <h3>{editingId ? 'Editar plato' : 'Nuevo plato'}</h3>
          <label>Nombre<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></label>
          <div className="form-row">
            <label>Categoría<select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
            <label>Precio COP<input type="number" min="1" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} required /></label>
          </div>
          <label>Imagen<select value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })}>{imageOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</select></label>
          <label>Descripción<textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows={3} /></label>
          <Button className="sigr-button" type="submit"><Save size={16} /> {editingId ? 'Guardar cambios' : 'Crear plato'}</Button>
          {editingId && <Button type="button" variant="ghost" onClick={() => { setEditingId(null); setForm(emptyForm) }}>Cancelar edición</Button>}
        </form>
        <div className="admin-list">
          {dishes.map((dish) => <article className="admin-dish" key={dish.id}><img src={dish.image} alt="" /><div><strong>{dish.name}</strong><span>{dish.category} · {formatCOP(dish.price)}</span></div><Button variant="outline" size="icon" aria-label={`Editar ${dish.name}`} onClick={() => editDish(dish)}><Pencil size={16} /></Button><Button variant="ghost" size="icon" aria-label={`Eliminar ${dish.name}`} onClick={() => onDeleteDish(dish.id)}><Trash2 size={16} /></Button></article>)}
        </div>
      </div>
      <div className="panel category-panel">
        <h3><Tags size={20} /> Categorías</h3>
        <form className="category-form" onSubmit={submitCategory}><input aria-label="Nombre de categoría" placeholder="Nueva categoría" value={categoryName} onChange={(event) => setCategoryName(event.target.value)} required /><Button className="sigr-button" type="submit">{editingCategory ? <Save size={16} /> : <Plus size={16} />}{editingCategory ? 'Actualizar' : 'Agregar'}</Button></form>
        <div className="category-list">{categories.map((category) => <div key={category}><span>{category}</span><button aria-label={`Editar categoría ${category}`} onClick={() => { setEditingCategory(category); setCategoryName(category) }}><Pencil size={14} /></button><button aria-label={`Eliminar categoría ${category}`} onClick={() => onDeleteCategory(category)}><Trash2 size={14} /></button></div>)}</div>
      </div>
    </section>
  )
}
