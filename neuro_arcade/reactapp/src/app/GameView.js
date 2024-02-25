import {useParams} from "react-router-dom";
import {requestGame} from "../backendRequests";
import styles from "../styles/App.module.css";
import {Table} from "../components/game/Table";
import {LineC} from "../components/game/LineC";
import {RadarC} from "../components/game/RadarC";
import {SwarmPlot} from "../components/game/SwarmPlot";
import {useEffect, useState} from "react";
import {Banner, MobileBanner} from "../components/Banner";
import {isLoggedIn, userIsAdmin} from "../backendRequests";
import {AdminRanking} from "../components/AdminRanking";

/**
 *
 * @returns {JSX.Element} game view page
 * @constructor builds game view page
 */
export function GameView() {
    // see: https://reactrouter.com/en/main/start/concepts#data-access
    let gameSlug = useParams().game_slug;
    let [loading, setLoading] = useState(true);
    let [gameData, setGameData] = useState({});
    let [showRating, setShowRating] = useState(false)

    // if (isLoggedIn() && userIsAdmin()){
    //     setShowRating(true);
    // }

    useEffect(() => {
        requestGame(gameSlug)
            .then(g => {
                setGameData(g);
                setLoading(false);
            })
    }, [gameSlug]);


    let content = <>...</>;
    if (!loading) {
        content = <>
            <div className={styles.Content}>
                <h1>{gameData.game.name}</h1>
                <div className={styles.ContentBlock}>
                    <p>
                        <img src="https://loremflickr.com/500/500" alt={'image'} // TODO add query for image here
                        />
                        {gameData.game.description}
                    </p>
                    { isLoggedIn() && userIsAdmin() ? <AdminRanking game={gameSlug}/> : null}
                </div>
            </div>
            <div className={styles.DataBlock}>
                <Table inputData={gameData}/>
                <div className={styles.Graphs}>
                    <LineC inputData={gameData}/>
                    <RadarC inputData={gameData}/>
                    <SwarmPlot inputData={gameData}/>
                </div>
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
