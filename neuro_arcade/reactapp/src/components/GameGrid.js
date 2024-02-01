import styles from '../styles/GameGrid.module.css'
import {GameCard} from "./GameCard";
import {requestGamesSorted} from "../backendRequests";
import {useEffect, useState} from "react";

/*
    Checks if a game matches a text query
    A query is considered matching if the text is present in the name
    or description of a game, ignoring case
    TODO: this should probably be made more advanced
*/
function searchFilter(game, query)
{
    var text = game.name.toLowerCase() + game.description.toLowerCase();
    return text.includes(query.toLowerCase());
}

export function GameGrid({query, nameQuery='', num, linkPrefix, id}) {
    let [isLoading, setLoading] = useState(true);
    let [games, setGames] = useState([]);

    // If query has changed, fetch games from server
    useEffect(() => {
        requestGamesSorted(query)
            .then(g => {
                setGames(g);
                setLoading(false);
            })
    }, [query]);

    // Display waiting message while waiting on server, then show games
    if (isLoading) {
        return (
            <div className={styles.GameGrid}>
                Loading...
            </div>
        )
    } else {
        return (
            <div className={styles.GameGrid} id={styles[id]}>
                {games.filter((game) => searchFilter(game, nameQuery))
                    .map((game, index) => {
                        return <GameCard
                            key={index}
                            game={game}
                            linkPrefix={linkPrefix}
                        />
                })}
            </div>
        );
    }
}