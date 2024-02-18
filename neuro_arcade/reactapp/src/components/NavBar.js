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
        navbar.push(left);
    } else {
        navbar.push(<div className={styles.Buffer} key={0}/>);
    }
    if (right) {
        navbar.push(right);
    } else {
        navbar.push(<div className={styles.Buffer} key={1}/>);
    }

    return (
        <div className={styles.NavBar}>
            {navbar}
        </div>
    )
}
