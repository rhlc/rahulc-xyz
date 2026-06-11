import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, MotionPathPlugin)

ScrollTrigger.config({ ignoreMobileResize: true })

export { gsap, useGSAP, ScrollTrigger, SplitText, MotionPathPlugin }

// shared matchMedia conditions — every section uses the same breakpoints
export const MM = {
  isDesktop: '(min-width: 769px)',
  isMobile: '(max-width: 768px)',
  reduceMotion: '(prefers-reduced-motion: reduce)',
  allowMotion: '(prefers-reduced-motion: no-preference)',
} as const
