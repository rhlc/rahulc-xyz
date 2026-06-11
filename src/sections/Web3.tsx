import { useRef } from 'react'
import SectionShell from '../components/SectionShell'
import { gsap, useGSAP, MM } from '../lib/gsap'
import { useReveal } from '../hooks/useReveal'
import { web3 } from '../content'
import styles from './Web3.module.css'

export default function Web3() {
  const rootRef = useRef<HTMLElement>(null)

  useReveal(rootRef)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MM.allowMotion, () => {
        const hex = rootRef.current?.querySelector<SVGPolygonElement>('[data-hex]')
        if (!hex) return
        const len = hex.getTotalLength()
        gsap.fromTo(
          hex,
          { strokeDasharray: len, strokeDashoffset: len },
          {
            strokeDashoffset: 0,
            duration: 1.6,
            ease: 'power2.inOut',
            scrollTrigger: { trigger: hex, start: 'top 85%', once: true },
          },
        )
      })
    },
    { scope: rootRef },
  )

  return (
    <SectionShell ref={rootRef} index={web3.index} kicker={web3.kicker} className={styles.section}>
      <div className={styles.grid}>
        <div>
          <h2 className={styles.title} data-reveal="title">
            {web3.title}
          </h2>
          <p className={styles.body} data-reveal="body">
            {web3.body}
          </p>
          <svg className={styles.hex} viewBox="0 0 120 120" aria-hidden="true">
            <polygon
              data-hex
              points="60,8 105,34 105,86 60,112 15,86 15,34"
              fill="none"
              stroke="var(--green)"
              strokeWidth="1.5"
            />
            <polygon
              points="60,30 86,45 86,75 60,90 34,75 34,45"
              fill="rgba(0,255,156,0.06)"
              stroke="rgba(0,255,156,0.3)"
              strokeWidth="1"
            />
            <text x="60" y="64" textAnchor="middle" className={styles.hexLabel}>
              POLYGON
            </text>
          </svg>
        </div>

        <article className={styles.card} data-reveal="card">
          <p className={styles.cardKicker}>// shipped to mainnet</p>
          <h3 className={styles.cardName}>{web3.card.name}</h3>
          <p className={styles.cardDesc}>{web3.card.desc}</p>
          <ul className={styles.tags}>
            {web3.card.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </article>
      </div>
    </SectionShell>
  )
}
