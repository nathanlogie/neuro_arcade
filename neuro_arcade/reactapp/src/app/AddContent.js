import {Banner} from "../components/Banner";
import {Link} from "react-router-dom";
import styles from '../styles/App.module.css';
import {NavBar} from "../components/NavBar";
import {MobileBanner} from "../components/Banner";
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
                <div className={styles.Content}>
                    <div className={styles.ContentBlock}>
                        <Link to='/add_game'> Add game </Link>
                        <Link to='/add_model'> Add model </Link>
                    </div>
                </div>
            </div>

            <div className={styles.MobileBannerBuffer} />
        </div>
    );
}