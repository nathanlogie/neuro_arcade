import {Banner, MobileBanner} from "../components/Banner";
import {Background} from "../components/Background";
import styles from "../styles/App.module.css"
import {GameGrid} from "../components/game/GameGrid";
import {GameTagFilter} from "../components/game/GameTagFilter";
import {useState} from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";

/**
 * @returns {JSX.Element} all games page
 * @constructor builds all games page
 */
export function AllGames() {
    // name query for sorting the already fetched games
    // can be changed freely, as it only affect data displayed on the client
    let [nameQuery, setNameQuery] = useState('');
    let [selectedTags, setSelectedTags] = useState([]);

    return (
        <div>
            <Background/>
            <Banner state={'Games'} />
            <MobileBanner  />
            <div className={styles.MainBlock} id={styles['small']}>
                <div className={styles.Side}>
                    {/* TODO: this almost definitely shouldn't be here, but the background
                    image gets interacted with instead of the search bar without it */}
                    <div className={styles.Search}>
                        <input onChange={e => setNameQuery(e.target.value)} placeholder="search..."/>
                        <div className={styles.SearchIcon}>
                            <FaMagnifyingGlass />
                        </div>
                    </div>
                    <GameTagFilter onTagChange={setSelectedTags}/>
                    {/* (see above) */}
                </div>
                <div className={styles.Content} id={styles['AllGames']}>
                    <h1>All Games</h1>
                    <GameGrid nameQuery={nameQuery} tagQuery={selectedTags} linkPrefix={''} id={'AppGrid'}/>
                </div>
            </div>
        </div>
    );
}
