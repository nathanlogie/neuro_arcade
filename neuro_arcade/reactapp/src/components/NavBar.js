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

    const navbar = [];
    if (left) {
        navbar.push(
            <div className={styles.Buffer} key={0}>
                {left}
            </div>
        );
    } else {
        navbar.push(<div className={styles.Buffer} key={0}/>);
    }
    if (right) {
        <div className={styles.Buffer} key={2}>
            {right}
        </div>
    } else {
        navbar.push(<div className={styles.Buffer} key={2}/>);
    }

    return (
        <div className={styles.NavBar}>
            {navbar}
        </div>
    )
}
