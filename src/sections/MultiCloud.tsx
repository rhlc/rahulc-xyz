import { useRef } from 'react'
import { gsap, useGSAP, MM } from '../lib/gsap'
import { clouds, multiCloud } from '../content'
import styles from './MultiCloud.module.css'

// chip home positions + curved approach path to the core (500,300), viewBox 1000x600
const chipPaths: Record<string, { x: number; y: number; d: string }> = {
  aws: { x: 110, y: 100, d: 'M 110 100 C 280 130, 360 210, 500 300' },
  azure: { x: 500, y: 64, d: 'M 500 64 C 470 150, 530 220, 500 300' },
  gcp: { x: 890, y: 100, d: 'M 890 100 C 720 130, 640 210, 500 300' },
  alibaba: { x: 110, y: 500, d: 'M 110 500 C 280 470, 360 390, 500 300' },
  tencent: { x: 500, y: 536, d: 'M 500 536 C 530 450, 470 380, 500 300' },
  huawei: { x: 890, y: 500, d: 'M 890 500 C 720 470, 640 390, 500 300' },
}

export default function MultiCloud() {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(
        { motionOK: MM.allowMotion, mobile: MM.isMobile },
        (ctx) => {
          if (!ctx.conditions?.motionOK) return
          const root = rootRef.current!
          root.setAttribute('data-animated', '')

          const trails = clouds.map(
            (c) => root.querySelector<SVGPathElement>(`[data-mc-trail="${c.id}"]`)!,
          )
          const chips = clouds.map(
            (c) => root.querySelector<SVGGElement>(`[data-mc-chip="${c.id}"]`)!,
          )
          const counter = root.querySelector('[data-mc-counter]')!
          const count = { v: 0 }

          // initial state: nothing has converged yet
          trails.forEach((t) => {
            const len = t.getTotalLength()
            gsap.set(t, { strokeDasharray: len, strokeDashoffset: len })
          })
          gsap.set('[data-mc-core]', { transformOrigin: '500px 300px', scale: 0.7, opacity: 0.4 })
          counter.textContent = '0/6 clouds'

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: root,
              start: 'top top',
              end: ctx.conditions?.mobile ? '+=160%' : '+=250%',
              pin: true,
              scrub: 1,
            },
          })

          // chips ride their trails into the core, in two waves of three
          chips.forEach((chip, i) => {
            const at = 0.5 + (i % 3) * 0.55 + Math.floor(i / 3) * 1.6
            tl.to(
              trails[i],
              { strokeDashoffset: 0, duration: 0.9, ease: 'none' },
              at,
            )
              .to(
                chip,
                {
                  motionPath: {
                    path: trails[i],
                    align: trails[i],
                    alignOrigin: [0.5, 0.5],
                  },
                  scale: 0.25,
                  duration: 0.9,
                  ease: 'power1.in',
                },
                at,
              )
              .to(chip, { opacity: 0, duration: 0.12 }, at + 0.82)
              .to(
                count,
                {
                  v: i + 1,
                  duration: 0.1,
                  snap: { v: 1 },
                  onUpdate: () => {
                    counter.textContent = `${Math.round(count.v)}/6 clouds`
                  },
                },
                at + 0.85,
              )
              .to(
                '[data-mc-core]',
                { scale: 0.7 + (i + 1) * 0.05, opacity: 0.4 + (i + 1) * 0.1, duration: 0.2 },
                at + 0.85,
              )
          })

          // copy beats crossfade in thirds
          const beats = gsap.utils.toArray<HTMLElement>('[data-mc-beat]', root)
          const total = tl.duration()
          beats.forEach((beat, i) => {
            const slice = total / beats.length
            tl.fromTo(
              beat,
              { autoAlpha: 0, y: 14 },
              { autoAlpha: 1, y: 0, duration: slice * 0.25 },
              i * slice,
            )
            if (i < beats.length - 1) {
              tl.to(beat, { autoAlpha: 0, y: -14, duration: slice * 0.2 }, (i + 1) * slice - slice * 0.2)
            }
          })

          tl.to('[data-mc-core]', { scale: 1.05, opacity: 1, duration: 0.4 }, total - 0.4)
        },
      )
    },
    { scope: rootRef },
  )

  return (
    <section ref={rootRef} className={styles.section} aria-label="Multi-cloud platform">
      <div className={styles.stage} data-mc="stage">
        <header className={styles.header}>
          <span className="section-index">[{multiCloud.index}]</span>
          <p className="prompt-kicker">{multiCloud.kicker}</p>
        </header>
        <h2 className={styles.title} data-mc="title">
          {multiCloud.title}
        </h2>

        <svg
          className={styles.scene}
          viewBox="0 0 1000 600"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          {/* approach trails */}
          {clouds.map((c) => (
            <path
              key={`trail-${c.id}`}
              data-mc-trail={c.id}
              d={chipPaths[c.id].d}
              fill="none"
              stroke="rgba(0,255,156,0.25)"
              strokeWidth="1"
              strokeDasharray="4 7"
            />
          ))}

          {/* unified core */}
          <g data-mc-core className={styles.core}>
            <circle cx="500" cy="300" r="74" fill="rgba(0,255,156,0.04)" stroke="rgba(0,255,156,0.35)" />
            <circle cx="500" cy="300" r="52" fill="none" stroke="rgba(0,255,156,0.5)" strokeDasharray="3 5" />
            <text x="500" y="295" textAnchor="middle" className={styles.coreLabel}>
              ONE PLATFORM
            </text>
            <text x="500" y="318" textAnchor="middle" className={styles.coreCounter} data-mc-counter>
              6/6 clouds
            </text>
          </g>

          {/* provider chips */}
          {clouds.map((c) => (
            <g key={c.id} data-mc-chip={c.id} transform={`translate(${chipPaths[c.id].x}, ${chipPaths[c.id].y})`}>
              <rect x="-52" y="-17" width="104" height="34" rx="3" className={styles.chipBox} />
              <text y="5" textAnchor="middle" className={styles.chipLabel}>
                {c.label}
              </text>
            </g>
          ))}
        </svg>

        <div className={styles.beats}>
          {multiCloud.beats.map((beat, i) => (
            <p key={i} className={styles.beat} data-mc-beat={i}>
              {beat}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
