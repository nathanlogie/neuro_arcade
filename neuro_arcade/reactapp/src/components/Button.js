import { FaArrowRight } from "react-icons/fa6";
import { FaArrowLeft } from "react-icons/fa6";
import { FaArrowUp } from "react-icons/fa6";
import { FaArrowDown } from "react-icons/fa6";
import styles from '../styles/Button.module.css';
import {Link} from "react-router-dom";

export function Button({id, name, link, direction, orientation}) {
    return (
        <div className={styles.Button} id={styles[id]}>
            <Link
                className={styles.ButtonBlock}
                id={styles[orientation]}
                to={link}
            >
                {name}
            </Link>
            <Link className={styles.Arrow}
                  id={styles[orientation]}
                  to={link}
            >
                <Arrow direction={direction} />
            </Link>
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
