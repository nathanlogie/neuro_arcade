import styles from '../styles/GameCard.module.css'
import gameImage from '../temp_static/images/game_icon.png'

export function GameCard ({key, game}) {
    // TODO implement onClick for GameCard
    return (
        <div
            className={styles.GameCard}
            // onClick={''}
        >
            <img src={game.icon || '/media/game_icons/example.png'} alt='game icon'/>
            {/*<img src={gameImage} alt='game icon' /> //TODO change game icon*/ }
            <p>
                {game.name || 'Game Name'}
            </p>
        </div>
    );
}