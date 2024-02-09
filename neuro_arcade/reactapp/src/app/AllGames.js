import {Banner, MobileBanner} from "../components/Banner";
import {Background} from "../components/Background";
import styles from "../styles/App.module.css"
import {CardGrid} from "../components/CardGrid";
import {TagFilter} from "../components/TagFilter";
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
            <Banner size={'small'} state={'Games'} />
            <MobileBanner  />
            <div className={styles.MainBlock} id={styles['small']}>
                <div className={styles.Side}>
                    <div className={styles.Search}>
                        <input onChange={e => setNameQuery(e.target.value)} placeholder="search..."/>
                        <div className={styles.SearchIcon}>
                            <FaMagnifyingGlass />
                        </div>
                    </div>
                    <TagFilter onTagChange={setSelectedTags} type={'game'} />
                </div>
                <div className={styles.Content} id={styles['AllGames']}>
                    <h1>All Games</h1>
                    <CardGrid type={'game'} nameQuery={nameQuery} tagQuery={selectedTags} linkPrefix={''} id={'AppGrid'} />
                </div>
            </div>
        </div>
    );
}
