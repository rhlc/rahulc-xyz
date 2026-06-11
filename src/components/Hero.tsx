import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { gsap, useGSAP, SplitText, MM } from '../lib/gsap'
import { heroState } from '../lib/heroState'
import { useIsMobile } from '../hooks/useIsMobile'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { useWebGLSupport } from '../hooks/useWebGLSupport'
import HeroFallback from './HeroFallback'
import { hero, links } from '../content'
import styles from './Hero.module.css'

const HeroCanvas = lazy(() => import('../three/HeroCanvas'))

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null)
  const isMobile = useIsMobile()
  const reducedMotion = usePrefersReducedMotion()
  const hasWebGL = useWebGLSupport()

  // mount the three.js chunk only after the browser is idle — it must never
  // compete with the LCP headline paint
  const [canvasReady, setCanvasReady] = useState(false)
  const [glFailed, setGlFailed] = useState(false)
  useEffect(() => {
    if (!hasWebGL) return
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => setCanvasReady(true))
      return () => window.cancelIdleCallback(id)
    }
    const id = setTimeout(() => setCanvasReady(true), 350)
    return () => clearTimeout(id)
  }, [hasWebGL])

  // kill the render loop entirely once the hero is out of view
  const [heroVisible, setHeroVisible] = useState(true)
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(MM.allowMotion, () => {
        const nameSplit = SplitText.create('[data-hero-nametext]', {
          type: 'chars',
          mask: 'chars',
        })
        const tagSplit = SplitText.create('[data-hero="tagline"]', {
          type: 'lines',
          mask: 'lines',
        })

        gsap
          .timeline({ defaults: { ease: 'power4.out' } })
          .from(nameSplit.chars, { yPercent: 110, duration: 0.9, stagger: 0.035 })
          .from('.caret', { autoAlpha: 0, duration: 0.2 }, '-=0.4')
          .from(tagSplit.lines, { yPercent: 100, duration: 0.7, stagger: 0.1 }, '-=0.45')
          .from(
            '[data-hero="bootline"]',
            {
              autoAlpha: 0,
              clipPath: 'inset(0 100% 0 0)',
              duration: 0.45,
              ease: 'power2.out',
              stagger: 0.13,
            },
            '-=0.3',
          )
          .from('[data-hero="hint"]', { autoAlpha: 0, duration: 0.6 }, '-=0.1')

        // scroll-out: feed the 3D scene + slide the headline away
        gsap.to('[data-hero-content]', {
          yPercent: -25,
          autoAlpha: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
            onUpdate: (st) => {
              heroState.scrollProgress = st.progress
            },
          },
        })
      })

      // even under reduced motion the 3D scene should know scroll position
      mm.add(MM.reduceMotion, () => {
        gsap.to(heroState, {
          scrollProgress: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })
      })
    },
    { scope: rootRef },
  )

  return (
    <section ref={rootRef} id="top" className={styles.hero}>
      <div className={styles.canvasSlot} aria-hidden="true">
        {hasWebGL && !glFailed ? (
          canvasReady && (
            <Suspense fallback={null}>
              <HeroCanvas
                visible={heroVisible}
                isMobile={isMobile}
                reducedMotion={reducedMotion}
                onContextLost={() => setGlFailed(true)}
              />
            </Suspense>
          )
        ) : (
          <HeroFallback />
        )}
      </div>
      <div className={styles.content} data-hero-content>
        <h1 className={styles.name}>
          <span data-hero-nametext>{hero.name}</span>
          <span className="caret" aria-hidden="true" />
        </h1>
        <p className={styles.tagline} data-hero="tagline">
          {hero.tagline}
        </p>
        <div className={styles.bootLog}>
          {hero.bootLog.map((line) => (
            <p key={line.prompt} className={styles.bootLine} data-hero="bootline">
              <span className={styles.bootPrompt}>$ {line.prompt}</span>
              <span className={styles.bootOutput}>{line.output}</span>
            </p>
          ))}
          <p className={styles.bootLine} data-hero="bootline">
            <span className={styles.bootPrompt}>$ contact --all</span>
            <span className={styles.bootOutput}>
              <a href={links.github} target="_blank" rel="noreferrer">
                github/rhlc
              </a>
              {' · '}
              <a href={links.linkedin} target="_blank" rel="noreferrer">
                in/rhlc
              </a>
              {' · '}
              <a href={`mailto:${links.email}`}>{links.email}</a>
            </span>
          </p>
        </div>
      </div>
      <p className={styles.scrollHint} data-hero="hint" aria-hidden="true">
        scroll ↓
      </p>
    </section>
  )
}
