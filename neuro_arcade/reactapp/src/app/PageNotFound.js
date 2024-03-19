import styles from "../styles/App.module.css";
import {Button} from "../components/Button"
import logo from "../static/images/logo.png"

export function PageNotFound() {
    return (
        <div className={styles.PageNotFound}>
            <img src={logo} alt={""}/>
            <h1>404</h1>
            <h2>Page Not Found</h2>
            <Button name={"Back to Neuroarcade"} link={"/"} orientation={"left"} direction={"left"} />
        </div>
    );
}
