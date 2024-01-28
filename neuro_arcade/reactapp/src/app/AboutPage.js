import {Background} from "../components/Background";
import {Banner, MobileBanner} from "../components/Banner";
import {NavBar} from "../components/NavBar";
import styles from "../styles/App.module.css";
import {motion} from "framer-motion"
import { useState } from 'react'
import initialAboutData from "../static/about.json"


// const [aboutData, updateAboutData] = useState(initialAboutData)
export function AboutPage( ) {

    console.log("Description = " + initialAboutData.description)

    let publications = initialAboutData.publications.map( function(publication){
        return (<li key={publication.id}><a href = {publication.link}>{publication.title} - {publication.author}</a></li>)
    })
    console.log("Publications:" + publications[0])
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
            <MobileBanner size={'big'} />
            <motion.div
                className={styles.MainBlock}
                initial={{opacity: 0, x: -100}}
                animate={{opacity: 1, x: 0}}
                exit={{opacity: 0, x: -100}}
            >
                <div className={styles.Content}>
                    <h1>About</h1>
                    <div className={styles.ContentBlock}>
                        <img src={ initialAboutData.image }  alt={'image'} // TODO add query for image here
                        />
                        {initialAboutData.description}
                        <h2>Publications</h2>
                        <ul>
                            { publications }
                        </ul>
                    </div>
                </div>
                <div className={styles.Side}></div>
            </motion.div>
            <div className={styles.MobileBannerBuffer} />
        </div>
    );
}