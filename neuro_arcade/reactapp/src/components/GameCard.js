import styles from '../styles/GameCard.module.css'
import {Link} from "react-router-dom";
import {motion} from "framer-motion"

export function GameCard ({key, game}) {
    return (
        <motion.div
            whileHover={{scale: 1.05}}
            whileTap={{scale: 0.95}}
        >
            <Link className={styles.GameCard} to={'all_games/' + game.slug}>
                <img src={game.icon || '/media/game_icons/example.png'} alt='game icon'/>
                <p>
                    {game.name || 'Game Name'}
                </p>
            </Link>
        </motion.div>
    );
}