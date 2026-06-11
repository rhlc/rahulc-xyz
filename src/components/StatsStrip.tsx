import { stats } from '../content'
import styles from './StatsStrip.module.css'

export default function StatsStrip() {
  return (
    <dl className={styles.strip}>
      {stats.map((s) => (
        <div key={s.label} className={styles.stat} data-reveal="stat">
          <dd className={styles.value}>
            <span data-counter={s.value}>{s.value}</span>
            {s.suffix}
          </dd>
          <dt className={styles.label}>{s.label}</dt>
        </div>
      ))}
    </dl>
  )
}
