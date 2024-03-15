import {Link, useParams} from "react-router-dom";
import {API_ROOT, requestPlayer, requestPlayerScores, isOwner, MEDIA_ROOT} from "../backendRequests";
import styles from "../styles/App.module.css";
import React, {useEffect, useState} from "react";
import {PlayerViewTable} from "../components/PlayerViewTable";
import {Banner, MobileBanner} from "../components/Banner";
import {motion} from "framer-motion";
import {FaRegPenToSquare} from "react-icons/fa6";
import placeholder from "../static/images/placeholder.webp";

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
        requestPlayer(playerSlug).then((data) => {
            setPlayerData(data);
            setLoadingPlayer(false);
        });

        requestPlayerScores(playerSlug).then((scores) => {
            setPlayerScores(scores);
            setLoadingScores(false);
        });
    }, []);

    let tags =
        playerData.tags && playerData.tags.length > 0 ? (
            <div>
                <h3>Tags</h3>
                <ul>
                    {playerData.tags.map((tag) => {
                        return (
                            <li>
                                <p>{tag}</p>
                            </li>
                        );
                    })}
                </ul>
            </div>
        ) : (
            <></>
        );
    let owner =
        playerData.user === playerData.name ? (
            <p>This is a registered player</p>
        ) : (
            <div>
                <h3>Uploaded by</h3>
                <div>{playerData.user}</div>
            </div>
        );

    const editButton = (
        <Link to={"edit"}>
            <motion.div className={styles.EditButton} whileHover={{scale: 1.1}} whileTap={{scale: 0.9}}>
                <div>
                    <FaRegPenToSquare />
                </div>
            </motion.div>
        </Link>
    );

    let content = <>...</>;
    if (!loadingPlayer && !loadingScores) {
        let table = <div className={styles.Text}>There are currently no scores for this player.</div>
        if (playerScores.length !== 0){
          table = <PlayerViewTable inputData={playerScores} />
        }
        let icon = <img src={placeholder} alt='icon' />;
        if (playerData.icon) {
            icon = <img src={MEDIA_ROOT + playerData.icon} alt={"image"} />;
        }

        content = (
            <motion.div className={styles.MainBlock} id={styles["small"]} initial={{opacity: 0}} animate={{opacity: 1}}
                        exit={{opacity: 0}}>
                <div className={styles.Content}>
                    <div className={styles.Title}>
                        <h1>{playerData.name}</h1>
                        {isOwner("player") ? editButton : null}
                    </div>
                    <div className={styles.ContentBlock}>
                        <p>
                            {icon}
                            {playerData.description}
                        </p>
                    </div>
                    <div className={styles.ContentBlock} id={styles["details"]}>
                        {tags}
                        {owner}
                    </div>
                </div>
                <div className={styles.Side}>
                    <div className={styles.DataBlock}>
                        {table}
                    </div>
                </div>
                <div className={styles.MobileBannerBuffer}/>
            </motion.div>
        );
    }

    return (
        <>
            <Banner size={"small"} selected={"Players"} />
            <MobileBanner />
            {content}
        </>
    );
}
