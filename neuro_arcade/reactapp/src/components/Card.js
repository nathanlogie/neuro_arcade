import styles from "../styles/components/Card.module.css";
import {Link} from "react-router-dom";
import {motion} from "framer-motion";
import {API_ROOT} from "../backendRequests";

/**
 * Interface for objects displayable in a Card
 * @typedef {Object} CardSubject
 * @property {string} name
 * @property {string} slug - appended to linkPrefix to make URL
 * @property {string} icon - URL
 */

/**
 * Component for rendering a card with a game's name and icon
 * Can be clicked to visit the game's view page
 * @param {Object} props
 *
 * @param {CardSubject?} props.subject - subject data to render
 * @param {string?} props.linkPrefix - base url to append the game's slug to
 *
 * @param {string?} props.link - full URL
 * @param {string?} props.text
 * @param {string?} props.icon - full URL
 *
 * @returns
 */
export function Card({subject, linkPrefix, link, text, icon, id}) {
    // Extract subject information
    if (subject) {
        link = linkPrefix + subject.slug;
        text = subject.name || "Name";
        icon = (
            <img
                src={subject.icon || `${API_ROOT}/media/game_icons/example.png`}
                alt='icon'
                // TODO Populate game icons
            />
        );
    }
    if (text && icon && link) {
        return (
            <motion.div whileHover={{scale: 1.05}} whileTap={{scale: 0.95}} className={styles.Card} id={styles[id]}>
                <Link to={link}>
                    <div className={styles.Icon}>{icon}</div>
                    <div className={styles.Text}>{text}</div>
                </Link>
            </motion.div>
        );
    } else {
        throw "Expected props missing for Card";
    }
}
