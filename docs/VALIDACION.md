# Validación de la línea base — SIGR

## 1. Información de la validación

- Fecha: 08/11/2026.
- Versión: 1.0.0.
- Rama: `main`.
- Responsables: Erick Guardo Díaz y Einer Plaza Prasca.
- Entorno: Node.js 24.21.0, npm 11.12.1, React 19, TypeScript y Vite 7.

## 2. Compilación y calidad estática

| Comando | Resultado | Evidencia |
|---|---|---|
| `npm run build` | Aprobado | TypeScript compiló sin errores y Vite generó `dist/` correctamente |
| `npm run lint` | Aprobado | ESLint finalizó sin errores ni advertencias en el código del proyecto |
| `npm test` | Aprobado | 2 archivos de prueba y 10 pruebas superadas |

## 3. Pruebas unitarias

Archivo: `src/lib/restaurant.test.ts`.

1. Cálculo del total de productos con diferentes cantidades.
2. Avance del estado del pedido sin superar el estado Entregado.
3. Selección de pedidos correspondientes a una fecha.
4. Cálculo del ticket promedio, incluido el escenario sin ventas.
5. Validación de datos obligatorios y número de personas en reservas.
6. Generación del contenido CSV con encabezados y pedidos.

Resultado: **6 de 6 pruebas aprobadas**.

## 4. Pruebas básicas de integración

Archivo: `src/App.test.tsx`.

1. El menú inicial muestra la imagen correcta de hamburguesa, perro caliente y papas fritas.
2. Un usuario agrega un producto, inicia sesión y confirma un pedido; el sistema registra el identificador, el cliente y el estado Recibido.
3. El administrador crea un plato desde Gestión y el nuevo plato aparece en el menú.
4. El usuario registra una reserva y el sistema muestra su confirmación.

Resultado: **4 de 4 pruebas aprobadas**.

## 5. Validación visual y flujo en navegador

Se ejecutó `node scripts/validar-visual.mjs` con Playwright y Google Chrome. La prueba inició temporalmente el servidor de desarrollo, verificó el flujo real en el navegador y lo cerró al finalizar.

- Las imágenes de hamburguesa, perro caliente y papas fritas cargaron correctamente.
- Se agregó una hamburguesa al carrito, se inició sesión y se confirmó el pedido `SIGR-001` por 18.000 COP.
- El pedido confirmado apareció en Pedidos y en el detalle de Caja y reportes.
- La vista de 390 × 844 píxeles no presentó desbordamiento horizontal.
- Resultado automatizado: `ok: true`, `imagesLoaded: true` y `mobileOverflow: false`.

Evidencias generadas durante la validación: `01-menu-escritorio.png`, `02-pedido-confirmado.png`, `03-reporte-ventas.png` y `04-menu-movil.png`.

## 6. Criterios verificados

- [x] La aplicación compila correctamente.
- [x] Las imágenes corresponden a cada plato.
- [x] Las funciones críticas están operativas.
- [x] Las pruebas unitarias y básicas de integración fueron completadas.
- [x] La estructura de carpetas y las convenciones están documentadas.
- [x] El README incluye clonación, instalación y ejecución.
- [x] El modelo de datos local está documentado.
- [x] El manual de despliegue está incluido.
- [x] La licencia MIT está incluida.

## 7. Resultado

**Validación técnica aprobada.** La línea base queda estable para su uso como punto de referencia de cambios posteriores. Cualquier modificación futura debe ejecutarse en una rama temática, someterse nuevamente a las pruebas y documentarse en `CHANGELOG.md` antes de integrarse a `main`.
