import {useState, useEffect} from 'react';
import {DescriptionForm} from "../../components/about/DescriptionForm"
import {PublicationsForm} from "../../components/about/PublicationsForm"
import {getAboutData} from "../../backendRequests";
import {Banner, MobileBanner} from "../../components/Banner";
import styles from "../../styles/App.module.css";
import {motion} from "framer-motion"
import {NavBar} from "../../components/NavBar";
import {Button} from "../../components/Button";

/**
 * @returns {JSX.Element} edit about page
 * @constructor builds edit about page
 */
export function EditAbout() {

    let nav_right = (
        <Button
            name={'home'}
            link={'/'}
            orientation={'right'}
            direction={'right'}
        />
    );

    const [aboutData, updateAboutData] = useState()

    useEffect(() => {
        getAboutData()
            .then(data => {
                updateAboutData(data)
            })
    }, [])

    let content = <>...</>;
    if (aboutData) {
        content = <>
            <div className={styles.Content} id={styles['big']}>
                <div className={styles.ContentBlock}>
                    <DescriptionForm description={aboutData.description}/>
                </div>
            </div>
            <div className={styles.Side}>
                <div className={styles.DataBlock}>
                    <div className={styles.Publications}>
                        <PublicationsForm publications={aboutData.publications}/>
                    </div>
                </div>
            </div>
        </>
    }

    return (
        <>
            <Banner size={'big'} right={nav_right}/>
            <MobileBanner/>
            <NavBar right={nav_right} />
            <motion.div
                className={styles.MainBlock}
                id={styles['big']}
                initial={{opacity: 0, x: -100}}
                animate={{opacity: 1, x: 0}}
                exit={{opacity: 0, x: -100}}
            >
                {content}
                <div className={styles.MobileBannerBuffer}/>
            </motion.div>
        </>
    );
}
