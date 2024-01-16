import styles from "../styles/Logo.module.css"
import logo from "../temp_static/images/logo.png"
import {Link} from "react-router-dom";

export function Logo({size}) {
    return  (
        <Link className={styles.Logo} id={styles[size]} to={'/'}>
            <img src={logo} alt="" onClick={'...'} /> {/*TODO Django link API*/}
            <h1 id={styles['title_1']}>neuro</h1>
            <h1 id={styles['title_2']}>arcade</h1>
        </Link>
    );
}