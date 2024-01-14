import styles from '../styles/Banner.module.css';
import {Button} from "./Button";
import {Logo} from "./Logo";

export function Banner({size, button_left, button_right}) {
    if (size === 'big' && button_right !== null && button_left !== null) {
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
    } else if (size === 'big' && button_right !== null) {
        return (
            <div
                className={styles.Banner}
                id={styles[size]}
            >
                <Logo size={size}/>
                <Button
                    name={button_right.name}
                    link={button_right.link}
                    direction={button_right.direction}
                    orientation={button_right.orientation}
                />
            </div>
        );
    } else if (size === 'big' && button_left !== null) {
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
            </div>
        );
    } else {
        return (
            <div
                className={styles.Banner}
                id={styles[size]}
            >
                <Logo size={size}/>
            </div>
        );
    }
}