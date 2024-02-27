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
    let [loadingPlayer, setLoadingPlayer] = useState(true);
    let [playerData, setPlayerData] = useState({});

    let [loadingScores, setLoadingScores] = useState(true);
    let [playerScores, setPlayerScores] = useState([]);
    useEffect(() => {
        requestPlayer(playerSlug)
            .then(data => {
                setPlayerData(data);
                setLoadingPlayer(false);
            })

        requestPlayerScores(playerSlug)
            .then(scores => {
                setPlayerScores(scores);
                setLoadingScores(false);
            })
    }, []);

    let tag_text = playerData.tags ? playerData.tags.join(", ") : "";

    let content = <>...</>;
    if(!loadingPlayer && !loadingScores){
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
                        <img src="https://loremflickr.com/500/500" alt={'image'} // TODO add query for image here
                        />
                        <p>{playerData.description}</p>
                        <p>User: {playerData.user}</p>
                        <p>Tags: {tag_text}</p>
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
