import styles from "../styles/App.module.css";
import {Button} from "../components/Button"
import logo from "../static/images/logo.png"

export function PageNotFound() {
    return (
        <div className={styles.PageNotFound}>
            {/*<div className={styles.Title}>*/}
            {/*    <h1>404 Page Not Found</h1>*/}
            {/*</div>*/}
            {/*<div className={styles.Content}>*/}
            {/*    <div className={styles.ContentBlock}>*/}
            {/*        <motion.div*/}
            {/*            className={styles.MainBlock}*/}
            {/*            id={styles["big"]}*/}
            {/*            initial={{opacity: 0}}*/}
            {/*            animate={{opacity: 1}}*/}
            {/*            exit={{opacity: 0}}*/}
            {/*        >*/}
            {/*            <Link to={"/"}>Back to Neuroarcade</Link>*/}
            {/*        </motion.div>*/}
            {/*    </div>*/}
            {/*</div>*/}
            <img src={logo} alt={""}/>
            <h1>404</h1>
            <h2>Page Not Found</h2>
            <Button name={"Back to Neuroarcade"} link={"/"} orientation={"left"} direction={"left"} />
        </div>
    );
}
