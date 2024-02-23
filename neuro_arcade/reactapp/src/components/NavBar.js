import {Button} from "./Button";
import styles from "../styles/components/NavBar.module.css";
import React from "react";

/**
 * @param left left component
 * @param right right component
 * @returns {JSX.Element} navigation bar for mobile
 * @constructor builds navigation bar
 */
export function NavBar({left, right}) {
    return (
        <div className={styles.NavBar}>
            <div className={styles.Buffer}>
                {left}
            </div>
            <div className={styles.Buffer}>
                {right}
            </div>
        </div>
    )
}
