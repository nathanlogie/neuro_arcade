import {useParams} from "react-router-dom";
import {requestGame} from "../backendRequests";
import styles from "../styles/App.module.css";
import {Table} from "../components/game/Table";
import {Graph} from "../components/game/Graph";
import {RadarC} from "../components/game/RadarC";
import {useEffect, useState} from "react";
import {Banner, MobileBanner} from "../components/Banner";
import {Background} from "../components/Background";

/**
 *
 * @returns {JSX.Element} game view page
 * @constructor builds game view page
 */
export function GameView() {
    // see: https://reactrouter.com/en/main/start/concepts#data-access
    let gameSlug = useParams().game_slug;
    let [isLoading, setLoading] = useState(true);
    let [gameData, setGameData] = useState({});
    useEffect(() => {
        requestGame(gameSlug)
            .then(g => {
                setGameData(g);
                setLoading(false);
            })
    }, []);

    console.log("HELLO");
    if (isLoading) {
        return (
            <>
                <Background />
                <Banner size={'small'} state={'Games'} />
                <MobileBanner />
                <div className={styles.MainBlock} id={styles['small']}>
                    Loading...
                </div>
            </>
        )
    } else {
        return (
            <>
                <Background />
                <Banner size={'small'} state={'Games'} />
                <MobileBanner />
                <div className={styles.MainBlock} id={styles['small']}>
                    <div className={styles.Content}>
                        <h1>{gameData.game.name}</h1>
                        <div className={styles.ContentBlock}>
                            <img src="https://loremflickr.com/500/500"  alt={'image'} // TODO add query for image here
                                />
                            <p>{gameData.game.description}</p>
                        </div>
                    </div>
                    <div className={styles.DataBlock}>
                        <Table inputData={gameData}/>
                        <Graph inputData={gameData}/>
                        <RadarC inputData={gameData}/>
                    </div>
                </div>
            </>

        )
    }
}
