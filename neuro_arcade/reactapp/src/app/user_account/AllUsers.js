import {Banner} from "../../components/Banner";
import styles from '../../styles/App.module.css';
import {NavBar} from "../../components/NavBar";
import {MobileBanner} from "../../components/Banner";
import {motion} from "framer-motion";
import {Card} from "../../components/Card";
import {FaGamepad} from "react-icons/fa6";
import {TbBoxModel} from "react-icons/tb";
import {getUser, userIsAdmin} from "../../backendRequests";
import {Link} from "react-router-dom";


/**
 * Page for admins only
 * Lets admins see all users and approve new ones
 */
export function AllUsers(){
    return (
        <>
            <Banner size={'big'} button_left={{
                name: 'Back to Account Page',
                link: '/user_account',
                orientation: 'left',
                direction: 'left'
            }} button_right={{
                link: '',
                orientation: 'right'
            }} />
            <NavBar button_left={{
                name: 'Back to Account Page',
                link: '/user_account',
                orientation: 'left',
                direction: 'left'
            }} button_right={{
                link: '...',
                direction: 'right'
            }}
            />
            <MobileBanner/>

            <motion.div
                className={styles.MainBlock}
                id={styles['big']}
                initial={{opacity: 0, x: 100}}
                animate={{opacity: 1, x: 0}}
                exit={{opacity: 0, x: 100}}
            >
                <div className={styles.Content} id={styles['small']}>
                    <div className={styles.Title}>
                        <h1>ALL USERS</h1>
                    </div>
                    <div className={styles.ContentBlock}>


                    </div>
                </div>
                <div className={styles.Side}></div>
            </motion.div>
            <div className={styles.MobileBannerBuffer} />
        </>
    )
}