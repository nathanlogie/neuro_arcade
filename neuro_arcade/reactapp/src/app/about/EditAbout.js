import {useState, useEffect} from 'react';
import {DescriptionForm} from "../../components/about/DescriptionForm"
import {PublicationsForm} from "../../components/about/PublicationsForm"
import {getAboutData} from "../../backendRequests";
import {Banner, MobileBanner} from "../../components/Banner";
import styles from "../../styles/App.module.css";
import {motion} from "framer-motion"
import {NavBar} from "../../components/NavBar";

/**
 * @returns {JSX.Element} edit about page
 * @constructor builds edit about page
 */
export function EditAbout() {

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
            <div className={styles.Content}>
                <div className={styles.ContentBlock}>
                    <DescriptionForm description={aboutData.description}/>
                    <PublicationsForm publications={aboutData.publications}/>
                </div>
            </div>
        </>
    }

    return (
        <>
            <Banner size={'big'} button_right={{
                name: 'home',
                link: '/',
                orientation: 'right',
                direction: 'right'
            }} />
            <NavBar  button_right={{
                name: 'home',
                link: '/',
                orientation: 'right',
                direction: 'right'
            }} />
            <MobileBanner  />
            <motion.div
                className={styles.MainBlock}
                initial={{opacity: 0, x: -100}}
                animate={{opacity: 1, x: 0}}
                exit={{opacity: 0, x: -100}}
            >
                {content}
            </motion.div>
        </>
    );
}
