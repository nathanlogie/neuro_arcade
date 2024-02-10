import styles from '../styles/components/CardGrid.module.css'
import {requestPlayers} from "../backendRequests";
import {CardGrid} from './CardGrid';
import {useEffect, useState} from "react";

/**
 * Component to render a grid of players (as Cards)
 *
 * @param {Object} props
 * @param {string} props.textQuery - string subject names/descriptions must contain
 * @param {SubjectTag[]} props.tagQuery - tags which subjects must have applied
 * @param {number} props.num - max number of subjects to show
 * @param {string} props.id - element id for styling
 */
export function PlayerGrid({textQuery='', tagQuery=[], num=0, id}) {
    let [isLoading, setLoading] = useState(true);
    let [players, setPlayers] = useState([]);

    // Fetch games from server on initial load
    useEffect(() => {
        requestPlayers()
            .then(g => {
                setPlayers(g);
                setLoading(false);
            })
    }, []);

    // Display waiting message while waiting on server, then show subjects
    if (isLoading) {
        return (
            <div className={styles.CardGrid}>
                Loading...
            </div>
        )
    } else {
        return <CardGrid
            subjects={players}
            textQuery={textQuery}
            tagQuery={tagQuery}
            num={num}
            id={id}
            linkPrefix='/all_players/'
        />
    }
}
