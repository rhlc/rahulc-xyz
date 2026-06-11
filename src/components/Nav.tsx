import { links } from '../content'
import styles from './Nav.module.css'

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <a className={styles.host} href="#top">
        <b>rahul</b>@blr:~$
      </a>
      <div className={styles.links}>
        <a href={links.github} target="_blank" rel="noreferrer">
          github
        </a>
        <a href={links.linkedin} target="_blank" rel="noreferrer">
          linkedin
        </a>
        <a href={`mailto:${links.email}`}>email</a>
      </div>
    </nav>
  )
}
