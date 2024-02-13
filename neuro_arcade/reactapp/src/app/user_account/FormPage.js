import {GameForm} from "../../components/add_content/GameForm";
import styles from "../../styles/App.module.css";
import {Banner, MobileBanner} from "../../components/Banner";
import {NavBar} from "../../components/NavBar";
import {motion} from "framer-motion";
import {ModelForm} from "../../components/add_content/ModelForm";

/**
 * @returns {JSX.Element} add game page
 * @constructor builds add game page
 */
export function FormPage({type}) {

    let form;
    if (type === 'game') {
        form = <GameForm />;
    } else if (type === 'model') {
        form  = <ModelForm/>
    } else {
        throw('invalid form type');
    }

    return(
        <>
            <Banner size={'big'} button_left={{
                name: 'user account',
                link: '/user_account',
                orientation: 'left',
                direction: 'left'
            }} button_right={{
                link: '',
                orientation: 'right'
            }}/>
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
            <MobileBanner/>
            <motion.div
                className={styles.MainBlock}
                id={styles['big']}
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
            >
                <div className={styles.Form}>
                    <h1 className={styles.Header}>Add {type}</h1>
                    {form}
                </div>
            </motion.div>
            <div className={styles.MobileBannerBuffer}/>
        </>
    )
}
