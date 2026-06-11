import { useRef } from 'react'
import { gsap, useGSAP, MM } from '../lib/gsap'
import { useReveal } from '../hooks/useReveal'
import { footer, links } from '../content'
import styles from './Footer.module.css'

export default function Footer() {
  const rootRef = useRef<HTMLElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)

  useReveal(rootRef)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add({ desktop: MM.isDesktop, motionOK: MM.allowMotion }, (ctx) => {
        if (!ctx.conditions?.desktop || !ctx.conditions?.motionOK) return
        const cta = ctaRef.current
        if (!cta) return

        const xTo = gsap.quickTo(cta, 'x', { duration: 0.4, ease: 'power3' })
        const yTo = gsap.quickTo(cta, 'y', { duration: 0.4, ease: 'power3' })

        const onMove = (e: PointerEvent) => {
          const r = cta.getBoundingClientRect()
          const dx = e.clientX - (r.left + r.width / 2)
          const dy = e.clientY - (r.top + r.height / 2)
          const within = Math.abs(dx) < r.width && Math.abs(dy) < r.height * 2
          xTo(within ? dx * 0.18 : 0)
          yTo(within ? dy * 0.3 : 0)
        }
        window.addEventListener('pointermove', onMove, { passive: true })
        return () => window.removeEventListener('pointermove', onMove)
      })
    },
    { scope: rootRef },
  )

  return (
    <footer ref={rootRef} id="contact" className={styles.footer}>
      <p className="prompt-kicker" data-reveal="kicker">
        {footer.kicker}
      </p>
      <h2 className={styles.title} data-reveal="title">
        {footer.title}
      </h2>
      <a
        ref={ctaRef}
        className={styles.cta}
        href={`mailto:${links.email}`}
        data-magnetic
        data-reveal="cta"
      >
        <span className={styles.ctaPrompt}>&gt;</span> {links.email}
      </a>
      <div className={styles.meta}>
        <div className={styles.metaLinks}>
          <a href={links.github} target="_blank" rel="noreferrer">
            github/rhlc
          </a>
          <a href={links.linkedin} target="_blank" rel="noreferrer">
            linkedin/in/rhlc
          </a>
        </div>
        <p className={styles.sign}>built with react + three.js + gsap — no templates</p>
      </div>
    </footer>
  )
}
