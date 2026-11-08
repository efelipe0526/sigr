import { spawn, spawnSync } from 'node:child_process'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium, expect } from '@playwright/test'

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const output = path.resolve(project, '..', 'qa-visual')
await mkdir(output, { recursive: true })
const server = spawn('npm', ['run', 'dev', '--', '--host', '127.0.0.1', '--port', '7100'], {
  cwd: project,
  shell: true,
  stdio: 'ignore',
})
let browser
try {
  let ready = false
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch('http://127.0.0.1:7100/')
      if (response.ok) { ready = true; break }
    } catch { /* El servidor aún está iniciando. */ }
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  if (!ready) throw new Error('El servidor de validación no inició correctamente.')

  browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
  })
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 })
  await page.goto('http://127.0.0.1:7100/', { waitUntil: 'networkidle' })
  await expect(page.getByAltText('Fotografía de Hamburguesa de la casa')).toBeVisible()
  const imagesLoaded = await page.locator('.dish-image').evaluateAll((images) => images.every((image) => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0))
  if (!imagesLoaded) throw new Error('Una o más imágenes del menú no cargaron.')
  await page.screenshot({ path: path.join(output, '01-menu-escritorio.png'), fullPage: true })

  await page.getByRole('button', { name: /^Agregar$/i }).first().click()
  await page.getByRole('button', { name: /Finalizar pedido/i }).click()
  await page.getByRole('button', { name: /^Ingresar$/i }).click()
  await page.getByRole('button', { name: /^Menú$/i }).click()
  await page.getByRole('button', { name: /Finalizar pedido/i }).click()
  await expect(page.getByText('SIGR-001', { exact: true })).toBeVisible()
  await page.screenshot({ path: path.join(output, '02-pedido-confirmado.png'), fullPage: true })
  await page.getByRole('button', { name: /^Caja y reportes$/i }).click()
  await expect(page.getByText('Detalle de ventas')).toBeVisible()
  await expect(page.getByText('SIGR-001', { exact: true })).toBeVisible()
  await page.screenshot({ path: path.join(output, '03-reporte-ventas.png'), fullPage: true })

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 })
  await mobile.goto('http://127.0.0.1:7100/', { waitUntil: 'networkidle' })
  await expect(mobile.getByAltText('Fotografía de Perro caliente')).toBeVisible()
  const overflow = await mobile.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)
  if (overflow) throw new Error('La vista móvil presenta desbordamiento horizontal.')
  await mobile.screenshot({ path: path.join(output, '04-menu-movil.png'), fullPage: true })

  console.log(JSON.stringify({ ok: true, imagesLoaded, mobileOverflow: overflow, screenshots: output }, null, 2))
} finally {
  if (browser) await browser.close()
  spawnSync('taskkill', ['/PID', String(server.pid), '/T', '/F'], { stdio: 'ignore' })
}
