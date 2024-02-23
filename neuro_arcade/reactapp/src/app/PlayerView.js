import {useParams} from "react-router-dom";
import {requestPlayer, requestPlayerScores} from "../backendRequests";
import styles from "../styles/App.module.css";
import {useEffect, useState} from "react";

/**
 *
 * @returns {JSX.Element} player view page
 * @constructor builds player view page
 */
// export function PlayerView() {
//     // see: https://reactrouter.com/en/main/start/concepts#data-access
//     let playerSlug = useParams().player_slug;
//     let [loading, setLoading] = useState(true);
//     let [playerData, setPlayerData] = useState({});
//     useEffect(() => {
//         requestPlayer(playerSlug)
//             .then(g => {
//                 setPlayerData(g);
//                 setLoading(false);
//             })
//     }, []);

//     let [playerScores, setPlayerScores] = useState({});
//     useEffect(() => {
//         requestPlayerScores(playerSlug)
//             .then(g => {
//                 setPlayerScores(g);
//                 setLoading(false);
//             })
//     }, []);

//     let tag_text = playerData.tags ? playerData.tags.join(", ") : "";
    
//     return (
//         <div>
//             <h1>{playerData.name}</h1>
//             <p>{playerData.description}</p>
//             <p>The tags for this player are: {tag_text}</p>
//             <div>
//                 <h2>Scores:</h2>
//                 <ul>
//                     {playerScores.map((score, index) => (
//                         <li key={index}>
//                             Game: {score.game_name}, Score: {score.value}
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//         </div>
//     );
// }

export function PlayerView() {
    let playerSlug = useParams().player_slug;
    let [loading, setLoading] = useState(true);
    let [playerData, setPlayerData] = useState({});
    let [playerScores, setPlayerScores] = useState([]);
    useEffect(() => {
        requestPlayer(playerSlug)
            .then(data => {
                setPlayerData(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching player data:', error);
            });

        requestPlayerScores(playerSlug)
            .then(scores => {
                setPlayerScores(scores);
            })
            .catch(error => {
                console.error('Error fetching player scores:', error);
            });
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
