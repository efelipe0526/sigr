import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('flujos de integración del SIGR', () => {
  it('muestra la imagen correspondiente a cada plato inicial', () => {
    render(<App />)
    expect(screen.getByAltText('Fotografía de Hamburguesa de la casa')).toHaveAttribute('src', './images/hamburguesa.jpg')
    expect(screen.getByAltText('Fotografía de Perro caliente')).toHaveAttribute('src', './images/perro-caliente.jpg')
    expect(screen.getByAltText('Fotografía de Papas fritas')).toHaveAttribute('src', './images/papas-fritas.jpg')
  })

  it('autentica un usuario y confirma un pedido con su total', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getAllByRole('button', { name: /^Agregar$/i })[0])
    await user.click(screen.getByRole('button', { name: /Finalizar pedido/i }))
    await user.click(screen.getByRole('button', { name: /^Ingresar$/i }))
    await user.click(screen.getByRole('button', { name: /^Menú$/i }))
    await user.click(screen.getByRole('button', { name: /Finalizar pedido/i }))
    expect(screen.getByText('SIGR-001')).toBeInTheDocument()
    expect(screen.getAllByText('Erick Guardo Díaz').length).toBeGreaterThan(0)
    expect(screen.getByLabelText('Estado del pedido: Recibido')).toBeInTheDocument()
  })

  it('permite al administrador crear un plato y mostrarlo en el menú', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /Iniciar sesión/i }))
    await user.click(screen.getByRole('button', { name: /^Ingresar$/i }))
    await user.click(screen.getByRole('button', { name: /^Gestión$/i }))
    await user.type(screen.getByLabelText('Nombre'), 'Limonada de la casa')
    await user.clear(screen.getByLabelText('Precio COP'))
    await user.type(screen.getByLabelText('Precio COP'), '7000')
    await user.type(screen.getByLabelText('Descripción'), 'Bebida natural preparada al momento.')
    await user.click(screen.getByRole('button', { name: /Crear plato/i }))
    await user.click(screen.getByRole('button', { name: /^Menú$/i }))
    expect(screen.getByText('Limonada de la casa')).toBeInTheDocument()
  })

  it('registra una reserva y muestra su confirmación', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /^Reservas$/i }))
    await user.type(screen.getByLabelText('Nombre completo'), 'Carlos Carrascal')
    await user.type(screen.getByLabelText('Fecha'), '2026-12-01')
    await user.type(screen.getByLabelText('Hora'), '19:30')
    await user.click(screen.getByRole('button', { name: /Confirmar reserva/i }))
    expect(screen.getByText(/Reserva confirmada para Carlos Carrascal/)).toBeInTheDocument()
    expect(screen.getByText('Confirmada')).toBeInTheDocument()
  })
})
