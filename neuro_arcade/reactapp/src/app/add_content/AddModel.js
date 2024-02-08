import {Banner} from "../../components/Banner";
import {Link} from "react-router-dom";
import styles from '../../styles/App.module.css';
import {NavBar} from "../../components/NavBar";
import {MobileBanner} from "../../components/Banner";
import {Background} from "../../components/Background";

/**
 * Component for rendering the Add Model page
 */
export function AddModel() {
    return (
        <div>
            <Background />
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
            <MobileBanner  />

            <div className={styles.MainBlock}>
                <div className={styles.Content}>
                    <div className={styles.ContentBlock}>
                        <h1>Add model</h1>
                    </div>
                </div>
            </div>

            <div className={styles.MobileBannerBuffer} />
        </div>
    );
}