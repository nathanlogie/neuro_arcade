import styles from '../styles/GameCard.module.css'

export function GameCard ({key, game}) {
    // TODO implement onClick for GameCard
    return (
        <div
            className={styles.GameCard}
            // onClick={''}
        >
            <img src={game.icon || '/media/game_icons/example.png'} alt='game icon'/>
            <p>
                {game.name || 'Game Name'}
            </p>
        </div>
    );
}