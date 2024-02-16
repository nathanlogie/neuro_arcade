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
        navbar.push(<div className={styles.Buffer}/>)
    }
    if (right) {
        navbar.push(right);
    }

    return (
        <div className={styles.NavBar}>
            {navbar}
        </div>
    )
}
