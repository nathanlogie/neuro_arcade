import styles from '../styles/GameGrid.module.css'
import {GameCard} from "./GameCard";
import {requestGamesSorted} from "../backendRequests";
import {useEffect, useState} from "react";

/*
    Checks if a game's name or description contains a query string
    The check is case insensitive
    TODO: this should probably be made more advanced
*/
function nameQueryFilter(game, nameQuery) {
    var text = game.name.toLowerCase() + game.description.toLowerCase();
    return text.includes(nameQuery.toLowerCase());
}

/*
    Checks if a game is tagged with every tag in a query list
*/
function tagQueryFilter(game, tagQuery) {
    return tagQuery.every((tag) => game.tags.includes(tag));
}

/*
    Checks if a game should be displayed under a query
*/
function searchFilter(game, nameQuery, tagQuery) {
    return nameQueryFilter(game, nameQuery) && tagQueryFilter(game, tagQuery);
}

export function GameGrid({nameQuery='', tagQuery=[], num=0, linkPrefix, id}) {
    let [isLoading, setLoading] = useState(true);
    let [games, setGames] = useState([]);

    // Fetch games from server on initial load
    useEffect(() => {
        requestGamesSorted()
            .then(g => {
                setGames(g);
                setLoading(false);
            })
    }, []);

    // Display waiting message while waiting on server, then show games
    if (isLoading) {
        return (
            <div className={styles.GameGrid}>
                Loading...
            </div>
        )
    } else {
        // Select subset of names to display
        let shownGames = games.filter((game) => searchFilter(game, nameQuery, tagQuery));
        if (num > 0) {
            shownGames = shownGames.slice(0, num);
        }

        // Render a card for each selected game
        return (
            <div className={styles.GameGrid} id={styles[id]}>
                {shownGames.filter((game) => searchFilter(game, nameQuery, tagQuery))
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