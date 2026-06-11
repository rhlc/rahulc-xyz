import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'
import { heroState } from '../lib/heroState'
import { clouds } from '../content'
import { getGlowTexture, makeLabelTexture } from './glowTexture'
import ParticleField from './ParticleField'

const GREEN = '#00ff9c'

type RingConfig = {
  radius: number
  tilt: [number, number, number]
  speed: number
}

// 3 tilted elliptical orbits, 2 provider nodes each
const rings: RingConfig[] = [
  { radius: 2.2, tilt: [0.5, 0, 0.2], speed: 0.22 },
  { radius: 2.8, tilt: [-0.4, 0.3, -0.15], speed: 0.17 },
  { radius: 3.4, tilt: [0.25, -0.2, 0.35], speed: 0.13 },
]

const nodeConfigs = clouds.map((cloud, i) => ({
  label: cloud.label,
  ring: i % 3,
  phase: i < 3 ? 0 : Math.PI,
}))

// sprite-based label: a small canvas texture, billboarded for free
function NodeLabel({ text }: { text: string }) {
  const texture = useMemo(() => makeLabelTexture(text), [text])
  const aspect = texture.image.width / texture.image.height
  return (
    <sprite position={[0, -0.45, 0]} scale={[0.22 * aspect, 0.22, 1]}>
      <spriteMaterial map={texture} transparent depthWrite={false} />
    </sprite>
  )
}

function ringPoints(radius: number): [number, number, number][] {
  const pts: [number, number, number][] = []
  for (let i = 0; i <= 96; i++) {
    const a = (i / 96) * Math.PI * 2
    pts.push([Math.cos(a) * radius, 0, Math.sin(a) * radius * 0.82])
  }
  return pts
}

export default function CloudSystem({
  isMobile,
  animated,
}: {
  isMobile: boolean
  animated: boolean
}) {
  const groupRef = useRef<THREE.Group>(null)
  const coreRef = useRef<THREE.Group>(null)
  const wireRef = useRef<THREE.Mesh>(null)
  const nodeRefs = useRef<(THREE.Group | null)[]>([])
  const linesRef = useRef<THREE.LineSegments>(null)
  const ringGroupRefs = useRef<(THREE.Group | null)[]>([])

  const glowMap = useMemo(() => getGlowTexture(), [])

  // node→core connection lines: 6 segments = 12 vertices, rewritten per frame
  const linePositions = useMemo(() => new Float32Array(nodeConfigs.length * 2 * 3), [])
  const worldPos = useMemo(() => new THREE.Vector3(), [])

  useFrame(({ clock, gl }, delta) => {
    const t = animated ? clock.elapsedTime : 0
    const progress = heroState.scrollProgress
    const contraction = 1 - 0.55 * progress

    // orbit the nodes (ring-local XZ ellipse)
    nodeConfigs.forEach((cfg, i) => {
      const node = nodeRefs.current[i]
      if (!node) return
      const ring = rings[cfg.ring]
      const angle = t * ring.speed + cfg.phase + (i % 3) * 0.6
      const r = ring.radius * contraction
      node.position.set(Math.cos(angle) * r, 0, Math.sin(angle) * r * 0.82)
    })

    // rings contract with scroll
    ringGroupRefs.current.forEach((rg) => {
      if (rg) rg.scale.setScalar(contraction)
    })

    // core grows as the system unifies
    if (coreRef.current) {
      const s = 1 + 0.35 * progress
      coreRef.current.scale.setScalar(s)
      coreRef.current.rotation.y = t * 0.15
    }
    if (wireRef.current) wireRef.current.rotation.y = -t * 0.25

    // pointer parallax (autonomous drift on touch)
    if (groupRef.current) {
      const targetY = isMobile ? Math.sin(t * 0.1) * 0.18 : heroState.pointerX * 0.25
      const targetX = isMobile ? Math.cos(t * 0.13) * 0.08 : heroState.pointerY * 0.12
      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y,
        targetY,
        2.5,
        delta,
      )
      groupRef.current.rotation.x = THREE.MathUtils.damp(
        groupRef.current.rotation.x,
        targetX,
        2.5,
        delta,
      )
    }

    // rewrite connection-line vertices from node world positions
    if (linesRef.current) {
      const posAttr = linesRef.current.geometry.getAttribute('position') as THREE.BufferAttribute
      nodeConfigs.forEach((_, i) => {
        const node = nodeRefs.current[i]
        if (!node) return
        node.getWorldPosition(worldPos)
        linesRef.current!.worldToLocal(worldPos)
        posAttr.setXYZ(i * 2, worldPos.x, worldPos.y, worldPos.z)
        posAttr.setXYZ(i * 2 + 1, 0, 0, 0)
      })
      posAttr.needsUpdate = true
      const mat = linesRef.current.material as THREE.LineBasicMaterial
      mat.opacity = 0.22 + Math.sin(t * 1.4) * 0.08 + progress * 0.3
    }

    // the whole scene dims as the hero scrolls away; on mobile it sits
    // further back visually so the headline stays legible
    gl.domElement.style.opacity = String((isMobile ? 0.65 : 1) * (1 - progress * 0.85))
  })

  return (
    <group ref={groupRef} position={isMobile ? [0, 1.4, 0] : [2.3, 0.1, 0]}>
      <ambientLight intensity={0.25} />
      <directionalLight position={[5, 4, 6]} intensity={1.4} color="#bfffe6" />
      <pointLight position={[0, 0, 0]} intensity={5} color={GREEN} />

      {/* unified core: dark faceted mass, glowing edges */}
      <group ref={coreRef}>
        <mesh>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial
            color="#0b3a26"
            emissive={GREEN}
            emissiveIntensity={0.05}
            roughness={0.45}
            metalness={0.25}
            flatShading
          />
        </mesh>
        <mesh ref={wireRef} scale={1.25}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial color={GREEN} wireframe transparent opacity={0.35} />
        </mesh>
        <sprite scale={[3.8, 3.8, 1]}>
          <spriteMaterial
            map={glowMap}
            transparent
            opacity={0.16}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      </group>

      {/* orbit rings + provider nodes */}
      {rings.map((ring, ri) => (
        <group
          key={ri}
          rotation={ring.tilt}
          ref={(el) => {
            ringGroupRefs.current[ri] = el
          }}
        >
          <Line
            points={ringPoints(ring.radius)}
            color={GREEN}
            transparent
            opacity={0.16}
            lineWidth={1}
          />
          {nodeConfigs
            .map((cfg, ni) => ({ cfg, ni }))
            .filter(({ cfg }) => cfg.ring === ri)
            .map(({ cfg, ni }) => (
              <group
                key={cfg.label}
                ref={(el) => {
                  nodeRefs.current[ni] = el
                }}
              >
                <mesh>
                  <octahedronGeometry args={[0.18, 0]} />
                  <meshStandardMaterial
                    color="#0a3524"
                    emissive={GREEN}
                    emissiveIntensity={0.9}
                    roughness={0.4}
                    flatShading
                  />
                </mesh>
                <sprite scale={[0.9, 0.9, 1]}>
                  <spriteMaterial
                    map={glowMap}
                    transparent
                    opacity={0.35}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                  />
                </sprite>
                {!isMobile && <NodeLabel text={cfg.label} />}
              </group>
            ))}
        </group>
      ))}

      {/* node → core data lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color={GREEN}
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      <ParticleField count={isMobile ? 600 : 1500} animated={animated} />
    </group>
  )
}
