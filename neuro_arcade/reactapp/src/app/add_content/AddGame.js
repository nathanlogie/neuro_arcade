import {FormGame} from "../../components/add_content/FormGame";
import styles from "../../styles/App.module.css";
import {Background} from "../../components/Background";
import {Banner, MobileBanner} from "../../components/Banner";
import {NavBar} from "../../components/NavBar";

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

            <div className={styles.MainBlock}>
                <div className={styles.Content}>
                    <FormGame />
                </div>
            </div>
        </div>
    )

}
