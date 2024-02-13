import styles from '../styles/components/Card.module.css'
import {Link} from "react-router-dom";
import {motion} from "framer-motion";

/**
 * Component for rendering a card with a game's name and icon
 * Can be clicked to visit the game's view page
 * @param {Object} props
 * @param {Object} props.subject - subject data to render
 * @param {string} props.linkPrefix - base url to append the game's slug to
 * @returns 
 */
export function Card ({subject, linkPrefix, link, text, icon}) {
    // Extract subject information
    if (subject) {
        link = linkPrefix + subject.slug;
        text = subject.name || 'Name';
        icon = <img src={subject.icon || 'http://localhost:8000/media/game_icons/example.png'} alt='icon'
                    // TODO Populate game icons
                    />
    }
    if (text && icon && link) {
        return (
            <motion.div
                whileHover={{scale: 1.05}}
                whileTap={{scale: 0.95}}
            >
                <Link className={styles.Card} to={link}>
                    <div className={styles.Icon}>
                        {icon}
                    </div>
                    <div className={styles.Text}>
                        {text}
                    </div>
                </Link>
            </motion.div>
        );
    } else {
        throw('Expected props missing for Card');
    }
}