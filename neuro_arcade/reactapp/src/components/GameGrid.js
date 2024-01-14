import styles from '../styles/GameGrid.module.css'

export function GameGrid({gameCardList}) {
    return (
      <div className={styles.GameGrid}>
          {gameCardList}
      </div>
    );
}