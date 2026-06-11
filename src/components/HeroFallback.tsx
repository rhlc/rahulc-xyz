import { clouds } from '../content'
import styles from './HeroFallback.module.css'

// static SVG stand-in for the WebGL scene — same orbital composition
export default function HeroFallback() {
  const positions = [
    { x: 200, y: 130 },
    { x: 620, y: 90 },
    { x: 750, y: 240 },
    { x: 580, y: 410 },
    { x: 180, y: 380 },
    { x: 90, y: 240 },
  ]

  return (
    <svg className={styles.svg} viewBox="0 0 800 500" aria-hidden="true">
      <ellipse cx="400" cy="250" rx="230" ry="120" className={styles.ring} />
      <ellipse cx="400" cy="250" rx="300" ry="160" className={styles.ring} transform="rotate(-12 400 250)" />
      <ellipse cx="400" cy="250" rx="360" ry="190" className={styles.ring} transform="rotate(8 400 250)" />
      <circle cx="400" cy="250" r="60" className={styles.core} />
      <circle cx="400" cy="250" r="42" className={styles.coreInner} />
      {clouds.map((c, i) => (
        <g key={c.id}>
          <line x1={positions[i].x} y1={positions[i].y} x2="400" y2="250" className={styles.link} />
          <circle cx={positions[i].x} cy={positions[i].y} r="6" className={styles.node} />
          <text x={positions[i].x} y={positions[i].y + 22} textAnchor="middle" className={styles.label}>
            {c.label}
          </text>
        </g>
      ))}
    </svg>
  )
}
