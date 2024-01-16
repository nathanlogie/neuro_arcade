import {useParams} from "react-router-dom";
import {requestGame} from "../backendRequests";
import styles from "../styles/App.module.css";
import {Table} from "../components/Table";


export function GameView() {
    // see: https://reactrouter.com/en/main/start/concepts#data-access
    let {game_slug} = useParams();
    let game_data = requestGame(game_slug);

    return (
        <div className={styles.MainBlock}>
            <p>GAME VIEW!!!</p>
            <Table inputData={game_data}/>
        </div>
    )
}
