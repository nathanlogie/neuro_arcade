import {Banner} from "../components/Banner";
import {Background} from "../components/Background";
import styles from "../styles/App.module.css"
import {GameGrid} from "../components/GameGrid";
import {useState} from "react";

export function AllGames() {
    let [query, setQuery] = useState('');
    //todo add a search bar
    return (
        <div>
            <Background/>
            <Banner size={'small'}/>
            <div className={styles.Side}>
                {/* search bar + tags here */}
            </div>
            <div className={styles.Content}>
                <h1>Games:</h1>
                <GameGrid query={query} />
            </div>
        </div>
    );
}