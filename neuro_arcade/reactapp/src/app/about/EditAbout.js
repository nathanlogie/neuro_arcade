import {useState, useEffect} from 'react';
import {DescriptionForm} from "../../components/about/DescriptionForm"
import {PublicationsForm} from "../../components/about/PublicationsForm"
import {getAboutData, isLoggedIn, userIsAdmin} from "../../backendRequests";
import {Banner, MobileBanner} from "../../components/Banner";
import styles from "../../styles/App.module.css";
import {motion} from "framer-motion"
import {NavBar} from "../../components/NavBar";
import { redirect } from "react-router-dom";
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

    // todo do this:
    // redirect if user is not logged in
    // if (!isLoggedIn())
    //     redirect("/login/");
    // if (!userIsAdmin())
    //     return (<p>Only Admins can edit this page!</p>);

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
            <Banner size={'big'} right={nav_right} />
            <MobileBanner/>
            <NavBar right={nav_right} />
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
