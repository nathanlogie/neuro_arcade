import styles from '../styles/GameGrid.module.css'
import {GameCard} from "./GameCard";
import {requestGamesSorted} from "../backendRequests";
import {useEffect, useState} from "react";

export function GameSearch({query, num, linkPrefix, id}) {
    let [isLoading, setLoading] = useState(true);
    let [games, setGames] = useState({});
    useEffect(() => {
        requestGamesSorted(query)
            .then(g => {
                setGames(g);
                setLoading(false);
            })
    }, []);
    if (isLoading) {
        return (
            <div className={styles.GameGrid}>
                Loading...
            </div>
        )
    } else {
        return (
            <div className={styles.GameGrid} id={styles[id]}>
                {games.map((game, index) => (
                    <GameCard
                        key={index}
                        game={game}
                        linkPrefix={linkPrefix}
                    />
                ))}
            </div>
        );
    }
}