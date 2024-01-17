import {useLocation, useParams} from "react-router-dom";
import {requestGame, requestGamesSorted} from "../backendRequests";
import styles from "../styles/App.module.css";
import {Table} from "../components/Table";
import {Graph} from "../components/Graph";
import {useEffect, useState} from "react";


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
    if (isLoading) {
        return (
            <div className={styles.MainBlock}>
                Loading...
            </div>
        )
    } else {
        return (
            <div className={styles.MainBlock}>
                <p>GAME VIEW for {gameData.game.name} !!!</p>
                <Table inputData={gameData}/>
                <Graph inputData={gameData}/>
            </div>
        )
    }
}
