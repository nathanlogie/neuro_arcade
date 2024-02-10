import styles from "../styles/components/Logo.module.css"
import logo from "../static/images/logo.png"
import {Link} from "react-router-dom";

/**
 * @param size for logo size
 * @returns {JSX.Element} logo
 * @constructor builds logo
 */
export function Logo({size}) {
    return  (
        <Link className={styles.Logo} id={styles[size]} to={'/'}>
            <img src={logo} alt="Neuro Arcade" />
            <h1 id={styles['title_1']}>neuro</h1>
            <h1 id={styles['title_2']}>arcade</h1>
        </Link>
    );
}