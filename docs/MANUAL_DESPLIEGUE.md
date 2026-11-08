# Manual de despliegue — SIGR

## 1. Requisitos

- Node.js 20 o superior.
- npm 10 o superior.
- Git.
- Un navegador moderno.

## 2. Obtener el código

```bash
git clone https://github.com/efelipe0526/sigr.git
cd sigr
```

## 3. Instalar dependencias

```bash
npm install
```

## 4. Ejecutar en desarrollo

```bash
npm run dev
```

También puede especificarse el puerto:

```bash
npm run dev -- --port 7100
```

## 5. Validar antes de publicar

```bash
npm test
npm run lint
npm run build
```

La compilación termina correctamente cuando se genera la carpeta `dist/` sin errores de TypeScript ni de Vite.

## 6. Despliegue estático

La carpeta `dist/` contiene la aplicación lista para publicar en GitHub Pages, Netlify, Vercel o cualquier servidor de archivos estáticos.

### GitHub Pages mediante una rama de publicación

1. Ejecutar `npm run build`.
2. Publicar el contenido de `dist/` en la rama o carpeta configurada para GitHub Pages.
3. En GitHub, abrir **Settings → Pages**.
4. Seleccionar la rama y carpeta de publicación.
5. Guardar y comprobar la URL pública.

El archivo `vite.config.ts` utiliza `base: './'` para permitir rutas relativas en alojamientos estáticos.

### Netlify o Vercel

- Comando de construcción: `npm run build`.
- Directorio de publicación: `dist`.
- Comando de desarrollo: `npm run dev`.

## 7. Verificación posterior al despliegue

1. Abrir la aplicación y comprobar que cargan las tres imágenes del menú.
2. Iniciar sesión con `admin / admin123`.
3. Agregar un plato y confirmar un pedido.
4. Avanzar el estado del pedido.
5. Registrar una reserva.
6. Abrir **Caja y reportes** y verificar la venta registrada.
7. Exportar el reporte CSV y registrar un cierre de caja.

## 8. Restauración de la línea base

Para volver al commit aprobado de la línea base, identificar el hash documentado en el taller y ejecutar:

```bash
git switch main
git pull origin main
git log --oneline
```

Los cambios posteriores deben tramitarse en ramas temáticas, revisarse y documentarse antes de integrarlos a `main`.
