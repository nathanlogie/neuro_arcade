import {Background} from "../components/Background";
import {Banner, MobileBanner} from "../components/Banner";
import {NavBar} from "../components/NavBar";
import styles from "../styles/HomePage.module.css";

export function AboutPage() {
    return (
        <div>
            <Background />
            <Banner size={'big'} button_left={{
                link: '',
                orientation: 'left'
            }} button_right={{
                name: 'Home',
                link: '../react_test', // TODO Django link API
                orientation: 'right',
                direction: 'right'
            }} />
            <NavBar button_left={{
                link: '',
                orientation: 'left'
            }} button_right={{
                name: 'Home',
                link: '../react_test',
                orientation: 'right',
                direction: 'right'
            }}
            />
            <MobileBanner size={'big'} />
            <div className={styles.MainBlock}>
                <div className={styles.Content}>
                </div>
            </div>
            <div className={styles.MobileBannerBuffer} />
        </div>
    );
}