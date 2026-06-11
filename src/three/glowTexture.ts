import * as THREE from 'three'

// canvas-generated radial gradient — the entire "bloom" budget of the scene
let cached: THREE.CanvasTexture | null = null

export function getGlowTexture(): THREE.CanvasTexture {
  if (cached) return cached
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  grad.addColorStop(0, 'rgba(0, 255, 156, 0.85)')
  grad.addColorStop(0.25, 'rgba(0, 255, 156, 0.35)')
  grad.addColorStop(0.6, 'rgba(0, 255, 156, 0.08)')
  grad.addColorStop(1, 'rgba(0, 255, 156, 0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)
  cached = new THREE.CanvasTexture(canvas)
  return cached
}

export function makeLabelTexture(text: string): THREE.CanvasTexture {
  const fontSize = 44
  const pad = 16
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  const font = `600 ${fontSize}px 'IBM Plex Mono', monospace`
  ctx.font = font
  canvas.width = Math.ceil(ctx.measureText(text).width) + pad * 2
  canvas.height = fontSize + pad * 2
  ctx.font = font // resizing the canvas resets context state
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#8a9a8e'
  ctx.fillText(text, canvas.width / 2, canvas.height / 2)
  const texture = new THREE.CanvasTexture(canvas)
  texture.anisotropy = 4
  return texture
}
