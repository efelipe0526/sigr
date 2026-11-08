import { useState, type FormEvent } from 'react'
import { CalendarCheck, CalendarDays, Clock, UsersRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Reservation, User } from '../types'
import { reservationIsValid } from '../lib/restaurant'

interface ReservationsSectionProps {
  reservations: Reservation[]
  user: User | null
  onAdd: (reservation: Omit<Reservation, 'id' | 'status'>) => void
}

export function ReservationsSection({ reservations, user, onAdd }: ReservationsSectionProps) {
  const [name, setName] = useState(user?.name ?? '')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [guests, setGuests] = useState(2)
  const [message, setMessage] = useState('')

  function submit(event: FormEvent) {
    event.preventDefault()
    if (!reservationIsValid(name, date, time, guests)) {
      setMessage('Completa los datos correctamente. El número de personas debe estar entre 1 y 20.')
      return
    }
    onAdd({ name: name.trim(), date, time, guests })
    setMessage(`Reserva confirmada para ${name.trim()} el ${date} a las ${time}.`)
    setDate('')
    setTime('')
  }

  return (
    <section>
      <div className="section-heading"><div><span className="eyebrow">Tu mesa te espera</span><h2>Reservas</h2><p>Selecciona la fecha, la hora y el número de personas.</p></div></div>
      <div className="reservation-layout">
        <form className="panel form-panel" onSubmit={submit}>
          <label>Nombre completo<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nombre del titular" required minLength={3} /></label>
          <div className="form-row">
            <label>Fecha<input type="date" value={date} min={new Date().toISOString().split('T')[0]} onChange={(event) => setDate(event.target.value)} required /></label>
            <label>Hora<input type="time" value={time} onChange={(event) => setTime(event.target.value)} required /></label>
          </div>
          <label>Número de personas<input type="number" min={1} max={20} value={guests} onChange={(event) => setGuests(Number(event.target.value))} required /></label>
          <Button className="sigr-button" type="submit"><CalendarCheck size={17} /> Confirmar reserva</Button>
          {message && <p className="form-message" role="status">{message}</p>}
        </form>
        <div className="reservation-summary">
          <h3>Reservas registradas</h3>
          {reservations.length === 0 ? <div className="empty-state"><CalendarDays size={32} /><p>Aún no hay reservas.</p></div> : reservations.map((reservation) => (
            <article className="reservation-card" key={reservation.id}>
              <div><strong>{reservation.name}</strong><span className="confirmed-badge">{reservation.status}</span></div>
              <p><CalendarDays size={15} /> {reservation.date} <Clock size={15} /> {reservation.time}</p>
              <p><UsersRound size={15} /> {reservation.guests} {reservation.guests === 1 ? 'persona' : 'personas'}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
