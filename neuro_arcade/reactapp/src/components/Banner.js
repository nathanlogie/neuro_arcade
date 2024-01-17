import styles from '../styles/Banner.module.css';
import {Button} from "./Button";
import {Logo} from "./Logo";
import React from "react";
import {motion} from "framer-motion"

export function Banner({size, button_left, button_right}) {
    if (size === 'big') {
        return (
            <div
                className={styles.Banner}
                id={styles[size]}
            >
                <motion.div
                    className={styles.AnimationContainer}
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                >
                    <Button
                        name={button_left.name}
                        link={button_left.link}
                        direction={button_left.direction}
                        orientation={button_left.orientation}
                    />
                    <Logo size={size}/>
                    <Button
                        name={button_right.name}
                        link={button_right.link}
                        direction={button_right.direction}
                        orientation={button_right.orientation}
                    />
                </motion.div>
            </div>
        );
    } else {
        return (
            <div
                className={styles.Banner}
                id={styles['small']}>
                <motion.div
                    className={styles.AnimationContainer}
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                >
                    <Logo size={size}/>
                </motion.div>
            </div>
        );
    }
}

export function MobileBanner({size}) {
        return (
            <div
                className={styles.MobileBanner}
                id={styles[size]}
            >
                <motion.div
                    className={styles.AnimationContainer}
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                >
                    <Logo size={size}/>
                </motion.div>
            </div>
        );
}