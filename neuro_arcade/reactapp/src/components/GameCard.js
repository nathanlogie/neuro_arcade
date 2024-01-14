import styles from '../styles/GameCard.module.css'

export function gameCard ({name, image, link}) {
    return (
        <div
            className={styles.GameCard}
            onClick={link} // TODO Django API
        >
            <img src={image} alt='game'/>
            {name}
        </div>
    );
}