import { FaArrowRight } from "react-icons/fa6";
import { FaArrowLeft } from "react-icons/fa6";
import { FaArrowUp } from "react-icons/fa6";
import { FaArrowDown } from "react-icons/fa6";
import styles from '../styles/Button.module.css';

export function Button({id, name, link, direction, orientation}) {
    return (
        <div className={styles.Button} id={styles[id]}>
            <div
                className={styles.ButtonBlock}
                id={styles[orientation]}
                onClick={link} // TODO Django API
            >
                {name}
            </div>
            <div className={styles.Arrow} id={styles[orientation]}>
                <Arrow direction={direction} />
            </div>
        </div>
    );
}

function Arrow({direction}) {
    if (direction === 'left') {
        return (
            <FaArrowLeft />
        );
    } else if (direction === 'up') {
        return (
            <FaArrowUp />
        );
    } else if (direction === 'down') {
        return (
            <FaArrowDown />
        )
    } else {
        return (
            <FaArrowRight />
        );
    }
}
