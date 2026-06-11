// GSAP ↔ react-three-fiber bridge: GSAP/event handlers mutate this plain
// object; the R3F render loop reads it in useFrame. Never goes through React
// state, so scroll/pointer updates cost zero re-renders.
export const heroState = {
  scrollProgress: 0,
  pointerX: 0,
  pointerY: 0,
}
