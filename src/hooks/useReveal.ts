import type { RefObject } from 'react'
import { gsap, useGSAP, MM } from '../lib/gsap'

// Generic entrance choreography for any section: elements tagged
// [data-reveal] rise in once on scroll, [data-counter] tick up from 0.
export function useReveal(ref: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MM.allowMotion, () => {
        gsap.utils.toArray<HTMLElement>('[data-reveal]', ref.current).forEach((el) => {
          const isCard = el.dataset.reveal === 'card'
          gsap.from(el, {
            y: 32,
            autoAlpha: 0,
            ...(isCard && { rotationX: -10, transformPerspective: 900 }),
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 82%', once: true },
          })
        })

        gsap.utils.toArray<HTMLElement>('[data-counter]', ref.current).forEach((el) => {
          const target = Number(el.dataset.counter)
          const obj = { v: 0 }
          el.textContent = '0'
          gsap.to(obj, {
            v: target,
            duration: 1.6,
            ease: 'power2.out',
            snap: { v: 1 },
            onUpdate: () => {
              el.textContent = String(Math.round(obj.v))
            },
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          })
        })
      })
    },
    { scope: ref },
  )
}
