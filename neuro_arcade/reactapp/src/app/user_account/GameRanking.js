import {Button} from "../../components/Button";
import React from "react";
import {Banner, MobileBanner} from "../../components/Banner";
import {NavBar} from "../../components/NavBar";
import styles from "../../styles/App.module.css";
import {motion} from "framer-motion";

export function GameRanking(){

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
            <Banner size={'big'} left={nav_left}/>
            <MobileBanner/>
            <NavBar left={nav_left}/>
            <motion.div
                className={styles.MainBlock}
                id={styles['big']}
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
            >
                <div className={styles.Content}>
                    <div className={styles.Title}>
                        <h1>GAME RANKING</h1>
                    </div>
                    <div className={styles.ContentBlock}>
                        content
                    </div>
                </div>
            </motion.div>
        </>
    )
}