import Nav from './components/Nav'
import Hero from './components/Hero'
import MultiCloud from './sections/MultiCloud'
import GoRewrite from './sections/GoRewrite'
import Web3 from './sections/Web3'
import ZeroToOne from './sections/ZeroToOne'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <a className="skip-link" href="#contact">
        skip to contact
      </a>
      <Nav />
      <main>
        <Hero />
        <MultiCloud />
        <GoRewrite />
        <Web3 />
        <ZeroToOne />
      </main>
      <Footer />
      <div className="vignette" aria-hidden="true" />
      <div className="crt-overlay" aria-hidden="true" />
    </>
  )
}
