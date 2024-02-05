import styles from '../styles/components/Banner.module.css';
import {Button} from "./Button";
import {Logo} from "./Logo";
import React from "react";
import {motion} from "framer-motion"
import Switcher from "./Switcher";

export function Banner({size, button_left, button_right, state}) {

    const switcher_labels = {table_headers: [
            { name: 'Games' },
            { name: 'Players' }
        ],
    };

    const [selectedSwitcherValue, setSelectedSwitcherValue] = React.useState(state);

    const handleSwitcherChange = (selectedValue) => {
        setSelectedSwitcherValue(selectedValue);
            if (selectedValue === 'Games') {
                window.location.href = '/all_games';
            }
            if (selectedValue === 'AI Platforms') {
                window.location.href = '/'; // TODO Add AI Platforms page
            }
    }

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
                    <Button
                        name={'back'}
                        link={'../'}
                        direction={'up'}
                        orientation={'left'}
                    />
                    <Logo size={size}/>
                    <div className={styles.TabSwitcher}>
                        <Switcher
                            data={switcher_labels}
                            onSwitcherChange={handleSwitcherChange}
                            switcherDefault={selectedSwitcherValue}
                        />
                    </div>
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