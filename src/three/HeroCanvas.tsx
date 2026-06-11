import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import CloudSystem from './CloudSystem'
import { heroState } from '../lib/heroState'

type Props = {
  visible: boolean
  isMobile: boolean
  reducedMotion: boolean
  onContextLost: () => void
}

export default function HeroCanvas({ visible, isMobile, reducedMotion, onContextLost }: Props) {
  // pointer parallax for fine pointers — writes to the shared mutable state,
  // read by CloudSystem's useFrame; never touches React
  useEffect(() => {
    if (isMobile || reducedMotion) return
    const onMove = (e: PointerEvent) => {
      heroState.pointerX = (e.clientX / window.innerWidth) * 2 - 1
      heroState.pointerY = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [isMobile, reducedMotion])

  const frameloop = reducedMotion ? 'demand' : visible ? 'always' : 'never'

  return (
    <Canvas
      dpr={[1, isMobile ? 1.5 : 1.75]}
      camera={{ position: [0, 0.6, isMobile ? 11.5 : 7], fov: 45 }}
      gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}
      frameloop={frameloop}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault()
          onContextLost()
        })
      }}
      aria-hidden="true"
    >
      <CloudSystem isMobile={isMobile} animated={!reducedMotion} />
    </Canvas>
  )
}
