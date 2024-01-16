import styles from '../styles/GameCard.module.css'
import {Link} from "react-router-dom";

export function GameCard ({key, game}) {
    return (
        <Link className={styles.GameCard} to={'all_games/' + game.slug}>
            <img src={game.icon || '/media/game_icons/example.png'} alt='game icon'/>
            <p>
                {game.name || 'Game Name'}
            </p>
        </Link>
    );
}