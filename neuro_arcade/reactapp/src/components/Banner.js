import styles from '../styles/Banner.module.css';
import {Button} from "./Button";
import {Logo} from "./Logo";
import React from "react";

export function Banner({size, button_left, button_right}) {
    return (
        <div
            className={styles.Banner}
            id={styles[size]}
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
        </div>
    );
}

export function MobileBanner({size}) {
    if (size === 'small') {
        return (
          <div>

          </div>
        );
    } else {
        return (
            <div
                className={styles.MobileBanner}
                id={styles[size]}
            >
                <Logo size={size}/>
            </div>
        );
    }
}