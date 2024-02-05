import styles from '../styles/GameCard.module.css'
import {Link, useLocation} from "react-router-dom";
import {motion} from "framer-motion"

export function GameCard ({key, game, linkPrefix}) {
    // let loc = useLocation();
    // let s = loc.toString().split('/');
    // s.pop();
    // let link = game.slug;
    // if (s.pop() !== 'all_games') {
    //     link = 'all_games/' + link;
    // }
    let link = linkPrefix + game.slug;
    return (
        <motion.div
            whileHover={{scale: 1.05}}
            whileTap={{scale: 0.95}}
        >
            <Link className={styles.GameCard} to={link}>
                <img src={game.icon || 'http://localhost:8000/media/game_icons/example.png'} alt='game icon'/>
                <p>
                    {game.name || 'Game Name'}
                </p>
            </Link>
        </motion.div>
    );
}