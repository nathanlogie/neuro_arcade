import {Banner, MobileBanner} from "../components/Banner";
import {Background} from "../components/Background";
import styles from "../styles/App.module.css"
import {GameGrid} from "../components/GameGrid";
import {useState} from "react";

export function AllGames() {
    // query for the fetch request sent to the server
    // should only be changed when necessary
    let [query, setQuery] = useState('');
    // name query for sorting the already fetched games
    // can be changed freely, as it only affect data displayed on the client
    let [nameQuery, setNameQuery] = useState('');
    return (
        <div>
            <Background/>
            <Banner size={'small'}/>
            <MobileBanner size={'small'} />
            <div className={styles.MainBlock}>
                <div className={styles.Side}>
                    {/* TODO: this almost definitely shouldn't be here, but the background
                    image gets interacted with instead of the search bar without it */}
                    <div className={styles.Content}><div className={styles.ContentBlock}>

                    <input onChange={e => setNameQuery(e.target.value)} placeholder="Search..." />

                    {/* (see above) */}
                    </div></div>
                </div>
                <div className={styles.Content} id={styles['AllGames']}>
                    <h1>All Games</h1>
                    <GameGrid query={'?query=' + query} nameQuery={nameQuery} linkPrefix={''} id={'AppGrid'}/>
                </div>
            </div>
        </div>
    );
}