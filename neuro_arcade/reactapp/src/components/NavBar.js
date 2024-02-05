import {Button} from "./Button";
import styles from "../styles/components/NavBar.module.css";

export function NavBar({button_left, button_right}) {
    if (button_left !== null && button_right !== null) {
        return (
            <div className={styles.NavBar}>
                <Button
                    name={button_left.name}
                    link={button_left.link}
                    direction={button_left.direction}
                    orientation={button_left.orientation}
                />
                <Button
                    name={button_right.name}
                    link={button_right.link}
                    direction={button_right.direction}
                    orientation={button_right.orientation}
                />
            </div>
        );
    } else if (button_left !== null) {
        return (
            <div className={styles.NavBar}>
                <Button
                    name={button_left.name}
                    link={button_left.link}
                    direction={button_left.direction}
                    orientation={button_left.orientation}
                />
            </div>
        );
    } else if (button_right !== null) {
        return (
            <div className={styles.NavBar}>
                <Button
                    name={button_right.name}
                    link={button_right.link}
                    direction={button_right.direction}
                    orientation={button_right.orientation}
                />
            </div>
        );
    } else {
        return (
            <div className={styles.NavBar}>
            </div>
        );
    }
}