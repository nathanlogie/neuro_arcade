import styles from '../styles/GameCard.module.css'
import {Link} from "react-router-dom";

export function GameCard ({key, game}) {
    return (
        <div className={styles.GameCard}>
            <img src={game.icon || '/media/game_icons/example.png'} alt='game icon'/>
            <Link to={'all_games/' + game.slug}>
                {game.name || 'Game Name'}
            </Link>
        </div>
    );
}