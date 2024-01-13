import styles from"../styles/Background.module.css"
import background from "../temp_static/images/background.png"
export function Background() {
    return (
        <div className={styles.Background}>
            <img
                src={background} //TODO Django API
                id={styles['hexagon']}
                alt={''}
            />
            <div className={styles.Gradient} />
        </div>
    );
}