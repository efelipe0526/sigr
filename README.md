# SIGR — Sistema Integral de Gestión de Restaurante

## Descripción

SIGR es una aplicación web académica para gestionar la operación básica de un restaurante. La línea base 1.0.0 integra autenticación por roles, menú digital con imágenes, operaciones CRUD de platos y categorías, carrito y seguimiento de pedidos, reservas, cierre de caja y reportes diarios.

## Repositorio oficial

- URL: https://github.com/efelipe0526/sigr
- Herramienta de versionado: Git.
- Rama principal estable: `main`.

## Funcionalidades

- **Autenticación y roles:** acceso demostrativo para cliente, mesero y administrador, con permisos diferenciados.
- **Menú digital:** tarjetas con fotografía, descripción, categoría y precio de cada plato.
- **CRUD de platos:** el administrador puede crear, consultar, editar y eliminar platos.
- **CRUD de categorías:** el administrador puede crear, renombrar y eliminar categorías sin platos asociados.
- **Pedidos:** carrito, cantidades, cálculo automático del total, confirmación y seguimiento mediante los estados Recibido, En preparación, Listo y Entregado.
- **Reservas:** registro y confirmación por nombre, fecha, hora y número de personas.
- **Caja y reportes:** ventas del día, ticket promedio, detalle de pedidos, cierre de caja, impresión y exportación CSV.
- **Persistencia local:** platos, categorías, usuarios, pedidos, reservas y cierres se almacenan en `localStorage`.

## Cuentas de demostración

| Rol | Usuario | Contraseña |
|---|---|---|
| Administrador | `admin` | `admin123` |
| Mesero | `mesero` | `mesero123` |
| Cliente | `cliente` | `cliente123` |

Estas credenciales son exclusivamente académicas. La autenticación local no constituye un mecanismo de seguridad para producción.

## Tecnologías

- React 19 y TypeScript.
- Vite 7.
- Tailwind CSS y componentes shadcn/ui.
- Lucide React para iconografía.
- Vitest, Testing Library y JSDOM para pruebas.
- Git y GitHub para control de versiones.

## Instalación y ejecución

Requisito: Node.js 20 o superior.

```bash
git clone https://github.com/efelipe0526/sigr.git
cd sigr
npm install
npm run dev
```

Para usar un puerto específico:

```bash
npm run dev -- --port 7100
```

Vite mostrará en consola la dirección local de acceso.

## Compilación y pruebas

```bash
npm run build
npm test
npm run lint
npm run preview
```

La compilación de producción queda en `dist/`. Las pruebas cubren cálculos, cambios de estado, reservas, exportación CSV, autenticación, creación de platos, imágenes del menú y confirmación de pedidos.

## Estructura del proyecto

```text
sigr/
├── docs/
│   ├── BASE_DE_DATOS.md
│   ├── MANUAL_DESPLIEGUE.md
│   └── VALIDACION.md
├── public/images/
│   ├── hamburguesa.jpg
│   ├── perro-caliente.jpg
│   └── papas-fritas.jpg
├── src/
│   ├── components/ui/
│   ├── data/menu.ts
│   ├── hooks/usePersistentState.ts
│   ├── lib/restaurant.ts
│   ├── sections/
│   ├── types/index.ts
│   ├── App.tsx
│   ├── App.css
│   └── main.tsx
├── index.html
├── package.json
├── vite.config.ts
├── vitest.config.ts
├── CHANGELOG.md
└── LICENSE.txt
```

## Documentación asociada

- [Modelo de datos local](docs/BASE_DE_DATOS.md)
- [Manual de despliegue](docs/MANUAL_DESPLIEGUE.md)
- [Validación y pruebas](docs/VALIDACION.md)

## Imágenes

Las fotografías de hamburguesa, perro caliente y papas fritas fueron extraídas de la referencia visual suministrada por el estudiante para esta actividad y se almacenan localmente para evitar dependencias externas.

## Licencia

MIT. Consulte `LICENSE.txt`.
