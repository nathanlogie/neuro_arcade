import styles from '../styles/GameGrid.module.css'
import {GameCard} from "./GameCard";
import {requestGamesSorted} from "../backendRequests";
import {useEffect, useState} from "react";

export function GameGrid({query}) {
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
            <div className={styles.GameGrid}>
                {games.map((game, index) => (
                    <GameCard
                        key={index}
                        game={game}
                    />
                ))}
            </div>
        );
    }
}