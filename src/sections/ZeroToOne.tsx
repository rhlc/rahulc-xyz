import { useRef } from 'react'
import SectionShell from '../components/SectionShell'
import StatsStrip from '../components/StatsStrip'
import { useReveal } from '../hooks/useReveal'
import { zeroToOne } from '../content'
import styles from './ZeroToOne.module.css'

export default function ZeroToOne() {
  const rootRef = useRef<HTMLElement>(null)

  useReveal(rootRef)

  return (
    <SectionShell
      ref={rootRef}
      index={zeroToOne.index}
      kicker={zeroToOne.kicker}
      className={styles.section}
    >
      <h2 className={styles.title} data-reveal="title">
        {zeroToOne.title}
      </h2>
      <div className={styles.cards}>
        {zeroToOne.cards.map((card) => (
          <article key={card.name} className={styles.card} data-reveal="card">
            <h3 className={styles.cardName}>
              <span aria-hidden="true">./</span>
              {card.name}
            </h3>
            <p className={styles.cardDesc}>{card.desc}</p>
          </article>
        ))}
      </div>
      <StatsStrip />
    </SectionShell>
  )
}
