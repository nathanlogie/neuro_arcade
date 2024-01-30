import {Banner, MobileBanner} from "../components/Banner";
import {Background} from "../components/Background";
import styles from "../styles/App.module.css"
import {GameGrid} from "../components/GameGrid";
import {useState} from "react";

export function AllGames() {
    let [query, setQuery] = useState('');

    return (
        <div>
            <Background/>
            <Banner size={'small'}/>
            <MobileBanner size={'small'} />
            <div className={styles.MainBlock} id={styles['small']}>
                <div className={styles.Side}>
                    {/* TODO: this almost definitely shouldn't be here, but the background
                    image gets interacted with instead of the search bar without it */}
                    <div className={styles.Content}><div className={styles.ContentBlock}>

                    <input onChange={e => setQuery(e.target.value)} placeholder="Search..." />

                    {/* (see above) */}
                    </div></div>
                </div>
                <div className={styles.Content} id={styles['AllGames']}>
                    <h1>All Games</h1>
                    <GameGrid query={query} linkPrefix={''} id={'AppGrid'}/>
                </div>
            </div>
        </div>
    );
}