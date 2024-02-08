import {Button} from "./Button";
import styles from "../styles/components/NavBar.module.css";
import {Logo} from "./Logo";
import React from "react";

export function NavBar({button_left, button_right}) {

    const navbar = [];
    if (button_left) {
        navbar.push(
            <Button
                name={button_left.name}
                link={button_left.link}
                direction={button_left.direction}
                orientation={button_left.orientation}
            />)
        ;
    }
    if (button_right) {
        navbar.push(
            <Button
                name={button_right.name}
                link={button_right.link}
                direction={button_right.direction}
                orientation={button_right.orientation}
            />
        );
    }

    return (
        <div className={styles.NavBar}>
            {navbar}
        </div>
    )
}
