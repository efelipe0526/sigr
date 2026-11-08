# Estructura del modelo de datos — SIGR

## 1. Alcance

La línea base es un prototipo frontend y no utiliza un servidor de base de datos. Los datos se almacenan en el navegador mediante `localStorage`, lo que permite conservar la información entre recargas y validar los flujos sin infraestructura externa. Este documento define la estructura lógica de las entidades y su correspondencia con las claves de almacenamiento.

## 2. Entidades y relaciones

- Un **usuario** puede registrar varios pedidos.
- Un **pedido** contiene uno o varios productos con nombre, categoría, precio y cantidad.
- Un **plato** pertenece a una categoría.
- Una **categoría** puede agrupar varios platos.
- Una **reserva** se asocia al nombre del titular.
- Un **cierre de caja** consolida los pedidos registrados en una fecha.

## 3. Claves de almacenamiento

| Clave | Entidad | Contenido |
|---|---|---|
| `sigr-user` | Usuario autenticado | Nombre, usuario y rol activo |
| `sigr-dishes` | Platos | Identificador, nombre, categoría, precio, imagen y descripción |
| `sigr-categories` | Categorías | Nombres únicos de las categorías |
| `sigr-orders` | Pedidos | Cliente, productos, total, estado y fecha |
| `sigr-reservations` | Reservas | Titular, fecha, hora, personas y estado |
| `sigr-closures` | Cierres de caja | Fecha, responsable, número de pedidos y total |

## 4. Esquemas TypeScript

### Usuario

```ts
interface User {
  name: string
  username: string
  role: 'cliente' | 'mesero' | 'administrador'
}
```

### Plato

```ts
interface Dish {
  id: string
  name: string
  category: string
  price: number
  image: string
  description: string
}
```

### Pedido

```ts
interface Order {
  id: string
  customer: string
  items: Array<{
    name: string
    category: string
    price: number
    quantity: number
  }>
  total: number
  status: 'Recibido' | 'En preparación' | 'Listo' | 'Entregado'
  createdAt: string
}
```

### Reserva

```ts
interface Reservation {
  id: string
  name: string
  date: string
  time: string
  guests: number
  status: 'Confirmada'
}
```

### Cierre de caja

```ts
interface CashClosure {
  id: string
  createdAt: string
  orderCount: number
  total: number
  responsible: string
}
```

## 5. Evolución recomendada

Para un ambiente de producción se recomienda migrar estas entidades a PostgreSQL, incorporar claves foráneas entre usuarios, pedidos y detalles, almacenar contraseñas cifradas en un backend y reemplazar la autenticación demostrativa por un servicio seguro con sesiones o tokens.
