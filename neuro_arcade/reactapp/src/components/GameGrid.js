import styles from '../styles/components/CardGrid.module.css'
import {GameTagKey, requestGames} from "../backendRequests";
import {CardGrid} from './CardGrid';
import {useEffect, useState} from "react";

/**
 * Component to render a grid of games (as Cards)
 *
 * @param {Object} props
 * @param {string} props.textQuery - string game names/descriptions must contain
 * @param {GameTagKey[]} props.tagQuery - tags which games must have applied
 * @param {number} props.num - max number of games to show
 * @param {string} props.id - element id for styling
 */
export function GameGrid({textQuery='', tagQuery=[], num=0, id}) {
    let [loading, setLoading] = useState(true);
    let [games, setGames] = useState([]);

    // Fetch games from server on initial load
    useEffect(() => {
        requestGames()
            .then(g => {
                setGames(g);
                setLoading(false);
            })
    }, []);

    // Display waiting message while waiting on server, then show games
    if (loading) {
        return null;
    } else {
        return <CardGrid
            subjects={games}
            textQuery={textQuery}
            tagQuery={tagQuery}
            num={num}
            id={id}
            linkPrefix='/all_games/'
        />
    }
}