import {Background} from "../components/Background";
import {Banner, MobileBanner} from "../components/Banner";
import {NavBar} from "../components/NavBar";
import styles from "../styles/App.module.css";
import {motion} from "framer-motion"

export function AboutPage() {
    return (
        <div>
            <Background />
            <Banner size={'big'} button_left={{
                link: '',
                orientation: 'left'
            }} button_right={{
                name: 'home',
                link: '/',
                orientation: 'right',
                direction: 'right'
            }} />
            <NavBar button_left={{
                link: '',
                orientation: 'left'
            }} button_right={{
                name: 'home',
                link: '/',
                orientation: 'right',
                direction: 'right'
            }}
            />
            <MobileBanner size={'big'} />
            <motion.div
                className={styles.MainBlock}
                initial={{x: -100}}
                animate={{x: 0}}
                exit={{x: -100}}
            >
                <div className={styles.Content}>
                    <h1>About</h1>
                    <div className={styles.ContentBlock}>
                        <img src="https://loremflickr.com/1920/1920"  alt={'image'}/> // TODO add query for image here
                        // TODO add text here
                    </div>
                </div>
                <div className={styles.Side}></div>
            </motion.div>
            <div className={styles.MobileBannerBuffer} />
        </div>
    );
}