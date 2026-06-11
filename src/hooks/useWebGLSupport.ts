let cached: boolean | null = null

export function useWebGLSupport(): boolean {
  if (cached === null) {
    try {
      const canvas = document.createElement('canvas')
      cached = !!canvas.getContext('webgl2')
    } catch {
      cached = false
    }
  }
  return cached
}
