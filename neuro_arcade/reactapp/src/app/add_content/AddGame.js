import {GameForm} from "../../components/add_content/GameForm";
import styles from "../../styles/App.module.css";
import {Background} from "../../components/Background";
import {Banner, MobileBanner} from "../../components/Banner";
import {NavBar} from "../../components/NavBar";
import {motion} from "framer-motion";

/**
 * @returns {JSX.Element} add game page
 * @constructor builds add game page
 */
export function AddGame() {
    return(
        <div>
            <Background/>
            <Banner size={'big'} button_left={{
                name: 'add content',
                link: '/add_content',
                orientation: 'left',
                direction: 'left'
            }} button_right={{
                link: '',
                orientation: 'right'
            }} />
            <NavBar button_left={{
                name: 'home',
                link: 'home',
                orientation: 'left',
                direction: 'left'
            }} button_right={{
                link: '...',
                direction: 'right'
            }}
            />
            <MobileBanner />
            <motion.div
                className={styles.MainBlock}
                id={styles['big']}
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
            >
                <div className={styles.Content}>
                    <GameForm />
                </div>
            </motion.div>
        </div>
    )

}
