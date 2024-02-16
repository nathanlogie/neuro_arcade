import {Banner} from "../../components/Banner";
import styles from '../../styles/App.module.css';
import {NavBar} from "../../components/NavBar";
import {MobileBanner} from "../../components/Banner";
import {Card} from '../../components/Card';
import { FaGamepad } from "react-icons/fa6";
import { TbBoxModel } from "react-icons/tb";
import {motion} from "framer-motion";
import {Button} from "../../components/Button";


/**
 * @returns {JSX.Element} add content page
 * @constructor builds add content page
 */
export function AccountPage() {

    let nav_left = (
        <Button
            name={'home'}
            link={'/'}
            orientation={'left'}
            direction={'left'}
        />
    );

    return (
        <>
            <Banner size={'big'} left={nav_left} />
            <MobileBanner/>
            <NavBar left={nav_left} />
            <motion.div
                className={styles.MainBlock}
                id={styles['big']}
                initial={{opacity: 0, x: 100}}
                animate={{opacity: 1, x: 0}}
                exit={{opacity: 0, x: 100}}
            >
                <div className={styles.Content} id={styles['small']}>
                    <div className={styles.Title}>
                        <h1>Add Content</h1>
                    </div>
                    <div className={styles.ContentBlock}>
                        <Card link={'/add_game'} text={'New Game'} icon={<FaGamepad />} />
                        <Card link={'/add_model'} text={'New Model'} icon={<TbBoxModel />} />
                    </div>
                </div>
                <div className={styles.Side}>
                </div>
            </motion.div>
            <div className={styles.MobileBannerBuffer} />
        </>
    );
}
