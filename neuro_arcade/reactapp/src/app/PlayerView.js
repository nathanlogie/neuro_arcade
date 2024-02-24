import {useParams} from "react-router-dom";
import {requestPlayer, requestPlayerScores} from "../backendRequests";
import styles from "../styles/App.module.css";
import {useEffect, useState} from "react";
import { PlayerViewTable } from "../components/PlayerViewTable";
import {Banner, MobileBanner} from "../components/Banner";

/**
 *
 * @returns {JSX.Element} player view page
 * @constructor builds player view page
 */
export function PlayerView() {
    let playerSlug = useParams().player_slug;
    let [loading, setLoading] = useState(true);
    let [playerData, setPlayerData] = useState({});
    let [playerScores, setPlayerScores] = useState([]);
    useEffect(() => {
        setLoading(true);
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

    let content = <>...</>;
    if(!loading){
        content = <>
            <div className={styles.Content}>
                <h1>{playerData.name}</h1>
                <div className={styles.ContentBlock}>
                    <p>
                        <img src="https://loremflickr.com/500/500" alt={'image'} // TODO add query for image here
                        />
                        {playerData.description}
                    </p>
                    <p>
                        The tags for this player are: {tag_text}
                    </p>
                </div>
            </div>
            <div className={styles.DataBlock}>
                <PlayerViewTable inputData={playerScores}/>
            </div>
        </>;
    }
    return (
        <>
            <Banner size={'small'} selected={'Games'} />
            <MobileBanner/>
            <div className={styles.MainBlock} id={styles['small']}>
                {content}
            </div>
        </>
    );
}
