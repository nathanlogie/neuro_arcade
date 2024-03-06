import styles from '../styles/components/CardGrid.module.css'
import {PlayerTagKey, requestPlayers} from "../backendRequests";
import {CardGrid} from './CardGrid';
import {useEffect, useState} from "react";

/**
 * Player type filtering mode
 * @enum {string}
 */
export const PlayerGridMode = {
    // Show all players
    ALL: "All players",
    // Show only human players
    HUMAN: "Human players",
    // Show only AI models
    AI: "AI model players",
}

/**
 * Component to render a grid of players (as Cards)
 *
 * @param {Object} props
 * @param {PlayerGridMode} props.mode - types of players to show
 * @param {string} props.textQuery - string player names/descriptions must contain
 * @param {PlayerTagKey[]} props.tagQuery - tags which players must have applied
 * @param {number} props.num - max number of players to show
 * @param {string} props.id - element id for styling
 */
export function PlayerGrid({mode=PlayerGridMode.ALL, textQuery='', tagQuery=[], num=0, id}) {
    let [loading, setLoading] = useState(true);
    let [players, setPlayers] = useState([]);

    // Fetch games from server on initial load
    useEffect(() => {
        requestPlayers()
            .then(g => {
                setPlayers(g);
                setLoading(false);
            })
    }, []);

    // Display waiting message while waiting on server, then show players
    if (loading) {
        return null;
    } else {
        // Filter players by mode
        let displayed = players.filter((player) => (
            (mode === PlayerGridMode.ALL)
            || (mode === PlayerGridMode.AI && player.is_ai)
            || (mode === PlayerGridMode.HUMAN && !player.is_ai)
        ));

        return <CardGrid
            subjects={displayed}
            textQuery={textQuery}
            tagQuery={tagQuery}
            num={num}
            id={id}
            linkPrefix={'/all_players/'}
        />
    }
}
