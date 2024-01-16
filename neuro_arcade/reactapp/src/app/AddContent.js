import {Banner} from "../components/Banner";
import {GameGrid} from "../components/GameGrid";
import styles from '../styles/HomePage.module.css';
import {NavBar} from "../components/NavBar";
import {MobileBanner} from "../components/Banner";
import {Button} from "../components/Button";
import {Background} from "../components/Background";

export function AddContent() {
    return (
        <div>
            <Background />
            <Banner size={'big'} button_left={{
                name: 'home',
                link: '/',
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
            <MobileBanner size={'big'} />
            <div className={styles.MainBlock}>
            </div>
            <div className={styles.MobileBannerBuffer} />
        </div>
    );
}