import { useRef } from 'react'
import { gsap, useGSAP, MM } from '../lib/gsap'
import { goRewrite } from '../content'
import styles from './GoRewrite.module.css'

const AMBER_FILL = 'rgba(255, 180, 84, 0.45)'
const GREEN_FILL = 'rgba(0, 255, 156, 0.4)'

export default function GoRewrite() {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(
        { motionOK: MM.allowMotion, mobile: MM.isMobile },
        (ctx) => {
          if (!ctx.conditions?.motionOK) return
          const root = rootRef.current!

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: root,
              start: 'top top',
              end: ctx.conditions?.mobile ? '+=140%' : '+=200%',
              pin: true,
              scrub: 1,
            },
          })

          // beat 1 — the rewrite pays off: bars drop from the NestJS baseline
          goRewrite.bars.forEach((bar, i) => {
            const fill = root.querySelector<HTMLElement>(`[data-go-bar="${bar.label}"]`)!
            const readout = root.querySelector<HTMLElement>(`[data-go-readout="${bar.label}"]`)!
            const num = { v: bar.from }
            readout.textContent = String(bar.from)

            tl.fromTo(
              fill,
              { scaleY: 1, backgroundColor: AMBER_FILL },
              { scaleY: bar.to / 100, backgroundColor: GREEN_FILL, duration: 1, ease: 'power2.inOut' },
              i * 0.15,
            ).to(
              num,
              {
                v: bar.to,
                duration: 1,
                snap: { v: 1 },
                onUpdate: () => {
                  readout.textContent = String(Math.round(num.v))
                },
              },
              i * 0.15,
            )
          })

          // beat 2 — the monolith splits into five services
          const services = gsap.utils.toArray<HTMLElement>('[data-go-service]', root)
          const first = services[0].getBoundingClientRect()
          services.forEach((svc, i) => {
            if (i === 0) return
            const r = svc.getBoundingClientRect()
            tl.from(
              svc,
              {
                x: first.left - r.left + i * 5,
                y: first.top - r.top + i * 5,
                duration: 0.8,
                ease: 'power3.inOut',
              },
              1.5 + i * 0.12,
            )
          })
          tl.fromTo(
            '[data-go-monolith-label]',
            { color: 'var(--amber)' },
            { color: 'var(--green)', duration: 0.5 },
            2.2,
          )
          tl.add(() => {
            const label = root.querySelector('[data-go-monolith-label]')!
            label.textContent = tl.scrollTrigger!.progress > 0.7 ? 'go-services/' : goRewrite.monolithLabel
          }, 2.4)

          // outro lands once the split is done
          tl.fromTo('[data-go-outro]', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 2.6)
        },
      )
    },
    { scope: rootRef },
  )

  return (
    <section ref={rootRef} className={styles.section} aria-label="The Go rewrite">
      <div className={styles.stage} data-go="stage">
        <header className={styles.header}>
          <span className="section-index">[{goRewrite.index}]</span>
          <p className="prompt-kicker">{goRewrite.kicker}</p>
        </header>
        <h2 className={styles.title}>
          {goRewrite.title} <span className={styles.subtitle}>{goRewrite.subtitle}</span>
        </h2>

        <div className={styles.grid}>
          <div className={styles.barsPanel}>
            {goRewrite.bars.map((bar) => (
              <div key={bar.label} className={styles.barBlock}>
                <p className={styles.readout}>
                  <span data-go-readout={bar.label}>{bar.to}</span>
                  <span className={styles.readoutUnit}>%</span>
                </p>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFill}
                    data-go-bar={bar.label}
                    data-from={bar.from}
                    data-to={bar.to}
                    style={{ transform: `scaleY(${bar.to / 100})` }}
                  />
                </div>
                <p className={styles.barLabel}>{bar.label}</p>
              </div>
            ))}
            <p className={styles.barsCaption}>relative to the NestJS baseline (100%)</p>
          </div>

          <div className={styles.monolithPanel}>
            <p className={styles.monolithLabel} data-go-monolith-label>
              {goRewrite.monolithLabel}
            </p>
            <div className={styles.services} data-go-services>
              {goRewrite.services.map((svc, i) => (
                <div key={svc} className={styles.service} data-go-service={i}>
                  <span className={styles.serviceDot} aria-hidden="true" />
                  {svc}.go
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className={styles.outro} data-go-outro>
          {goRewrite.outro}
        </p>
      </div>
    </section>
  )
}
