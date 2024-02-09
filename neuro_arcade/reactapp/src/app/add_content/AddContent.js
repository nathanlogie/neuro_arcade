import {Banner} from "../../components/Banner";
import styles from '../../styles/App.module.css';
import {NavBar} from "../../components/NavBar";
import {MobileBanner} from "../../components/Banner";
import {Background} from "../../components/Background";
import {Card} from '../../components/Card';
import { FaGamepad } from "react-icons/fa6";
import { TbBoxModel } from "react-icons/tb";

/**
 * @returns {JSX.Element} add content page
 * @constructor builds add content page
 */
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
            <MobileBanner  />

            <div className={styles.MainBlock}>
                <div className={styles.DataBlock}>
                    <Card link={'/add_game'} text={'New Game'} icon={<FaGamepad />} />
                    <Card link={'/add_model'} text={'New Model'} icon={<TbBoxModel />} />
                </div>
            </div>

            <div className={styles.MobileBannerBuffer} />
        </div>
    );
}
