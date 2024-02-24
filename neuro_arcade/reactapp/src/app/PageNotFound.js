import {Link} from 'react-router-dom'
import styles from '../styles/App.module.css';
import {motion} from "framer-motion"

export function PageNotFound() {

    return (
        <>
            <div className={styles.Title}>
                <h1>404 Page Not Found</h1>
            </div>
            <div className={styles.Content}>
                <div className={styles.ContentBlock}>
                    <motion.div
                        className={styles.MainBlock}
                        id={styles['big']}
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                    >
                        <Link to={'/'}>Back to Neuroarcade</Link>
                    </motion.div>
                </div>
            </div>
        </>

    )

}