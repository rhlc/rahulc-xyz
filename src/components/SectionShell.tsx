import { forwardRef, type ReactNode } from 'react'
import styles from './SectionShell.module.css'

type Props = {
  index: string
  kicker: string
  id?: string
  className?: string
  children: ReactNode
}

const SectionShell = forwardRef<HTMLElement, Props>(function SectionShell(
  { index, kicker, id, className, children },
  ref,
) {
  return (
    <section ref={ref} id={id} className={`${styles.section} ${className ?? ''}`}>
      <header className={styles.header}>
        <span className="section-index">[{index}]</span>
        <p className="prompt-kicker" data-reveal="kicker">
          {kicker}
        </p>
      </header>
      {children}
    </section>
  )
})

export default SectionShell
