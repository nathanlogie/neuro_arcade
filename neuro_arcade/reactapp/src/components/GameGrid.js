import styles from '../styles/GameGrid.module.css'
import {GameCard} from "./GameCard";
import {Game, requestGamesSorted} from "../backendRequests";
import {useEffect, useState} from "react";

/**
 * Checks if a game's name or description contains a query string
 * The check is case insensitive
 * TODO: this should probably be made more advanced
 *
 * @param {Game} game - the game data to test 
 * @param {string} textQuery - the string to search for
 *
 * @returns {boolean} true if the filter is passed
 */
function textQueryFilter(game, textQuery) {
    var text = game.name.toLowerCase() + game.description.toLowerCase();
    return text.includes(textQuery.toLowerCase());
}

/**
 * Checks if a game is tagged with every tag in a query list
 * 
 * @param {Game} game - the game data to test
 * @param {string[]} tagQuery - the list of required tag slugs
 * 
 * @returns {boolean} true if the filter is passed
 */
function tagQueryFilter(game, tagQuery) {
    return tagQuery.every((tag) => game.tags.includes(tag));
}

/**
 * Checks if a game should be displayed under a query
 * 
 * @param {Game} game - the game data to test
 * @param {string} textQuery - string to search name/description for
 * @param {string[]} tagQuery - required tag slugs
 * 
 * @returns {boolean} true if the filter is passed
 */
function searchFilter(game, textQuery, tagQuery) {
    return textQueryFilter(game, textQuery) && tagQueryFilter(game, tagQuery);
}

/**
 * Component to render a grid of games (as GameCards)
 *
 * @param {Object} props
 * @param {string} props.nameQuery - string game names/descriptions must contain
 * @param {string[]} props.tagQuery - slugs of tags which games must have applied
 * @param {number} props.num - max number of games to show
 * @param {string} props.linkPrefix - link prefix passed to GameCard
 * @param {string} props.id - element id for styling
 */
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