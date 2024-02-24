import {useParams} from "react-router-dom";
import {requestPlayer} from "../backendRequests";
import styles from "../styles/App.module.css";
import {useEffect, useState} from "react";

/**
 *
 * @returns {JSX.Element} player view page
 * @constructor builds player view page
 */
export function PlayerView() {
    // see: https://reactrouter.com/en/main/start/concepts#data-access
    let playerSlug = useParams().player_slug;
    let [loading, setLoading] = useState(true);
    let [playerData, setPlayerData] = useState({});
    useEffect(() => {
        setLoading(true);
        requestPlayer(playerSlug)
            .then(g => {
                setPlayerData(g);
                setLoading(false);
            })
    }, []);

    let tag_text = playerData.tags ? playerData.tags.join(", ") : "";
    
    return (
        <div>
            <h1>{playerData.name}</h1>
            <p>{playerData.description}</p>
            <p>The tags for this player are: {tag_text}</p>
        </div>
    );
}
