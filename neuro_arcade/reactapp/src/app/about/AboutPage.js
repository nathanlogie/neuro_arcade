import {Background} from "../../components/Background";
import {Banner, MobileBanner} from "../../components/Banner";
import {NavBar} from "../../components/NavBar";
import styles from "../../styles/App.module.css";
import {motion} from "framer-motion"
import {useEffect, useState} from "react";
import {getAboutData} from "../../backendRequests";
import {Description} from "../../components/about/Description"

/**
 * @returns {JSX.Element} about page
 * @constructor builds about page
 */
export function AboutPage() {

    const [aboutData, updateAboutData] = useState()

    useEffect(() => {
        getAboutData()
            .then(data => {
                updateAboutData(data)
            })
    }, [])


    if (!aboutData){
        return (
            <div>
                Loading...
            </div>
        )
    }

    let publications = aboutData["publications"].map( function(publication){
        return (
            <li key={publication.id}>{ publication.link ? (<a href={publication.link}>{publication.title} - {publication.author}</a>) : (<>{publication.title} - {publication.author}</>)}</li>
        )
    })

    return (
        <div>
            <Background />
            <Banner size={'big'} button_left={{
                name: 'edit about',
                link: '/edit_about',
                orientation: 'left',
                direction: 'left'
            }} button_right={{
                name: 'home',
                link: '/',
                orientation: 'right',
                direction: 'right'
            }} />
            <NavBar button_left={{
                name: 'edit about',
                link: '/edit_about',
                orientation: 'left',
                direction: 'left'
            }} button_right={{
                name: 'home',
                link: '/',
                orientation: 'right',
                direction: 'right'
            }}
            />
            <MobileBanner />
            <motion.div
                className={styles.MainBlock}
                id={styles['big']}
                initial={{opacity: 0, x: -100}}
                animate={{opacity: 1, x: 0}}
                exit={{opacity: 0, x: -100}}
            >
                <div className={styles.Content}>

                    <div className={styles.ContentBlock}>

                        <Description description= {aboutData.description} />
                        <h2>Publications</h2>
                        <ul>
                            { publications }
                        </ul>

                    </div>
                </div>
                <div className={styles.Side}></div>
                <NavBar button_left={{
                    link: '',
                    orientation: 'left'
                }} button_right={{
                    name: 'home',
                    link: '/',
                    orientation: 'right',
                    direction: 'right'
                }}
                />
                <div className={styles.MobileBannerBuffer}/>
            </motion.div>

        </div>
    );
}
