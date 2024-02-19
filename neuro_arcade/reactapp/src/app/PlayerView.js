import {useParams} from "react-router-dom";
import {requestPlayer} from "../backendRequests";
import {useEffect, useState} from "react";

/**
 *
 * @returns {JSX.Element} game view page
 * @constructor builds game view page
 */
export function PlayerView() {
    // see: https://reactrouter.com/en/main/start/concepts#data-access
    let playerSlug = useParams().player_slug;
    let [loading, setLoading] = useState(true);
    let [playerData, setPlayerData] = useState({});
    useEffect(() => {
        requestPlayer(playerSlug)
            .then(g => {
                setPlayerData(g);
                setLoading(false);
            })
    }, []);
    return (
        <h2>HELLO</h2>
    );
}
