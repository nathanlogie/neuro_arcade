import {useParams} from "react-router-dom";
import {requestPlayer, requestPlayerScores} from "../backendRequests";
import styles from "../styles/App.module.css";
import {useEffect, useState} from "react";
import { PlayerViewTable } from "../components/PlayerViewTable";
import {Banner, MobileBanner} from "../components/Banner";
import {motion} from "framer-motion";

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
        content = 
            <motion.div
                className={styles.MainBlock}
                id={styles['small']}
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
            >
                <div className={styles.Content} id={styles['small']}>
                    <div className={styles.Title}>
                        <h1>{playerData.name}</h1>
                    </div>
                    <div className={styles.ContentBlock}>
                        <p>{playerData.description}</p>
                        <p>The tags for this player are: {tag_text}</p>
                    </div>
                </div>
                <div className={styles.Side}>          
                    <PlayerViewTable inputData={playerScores}/>
                </div>
            </motion.div>
    }

    return(
        <>
            <Banner size={'small'} selected={'Players'}/>
            <MobileBanner/>
            {content}
        </>
    );
}
