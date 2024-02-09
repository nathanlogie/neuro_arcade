import {Banner, MobileBanner} from "../components/Banner";
import {Background} from "../components/Background";
import styles from "../styles/App.module.css"
import {CardGrid} from "../components/CardGrid";
import {TagFilter} from "../components/TagFilter";
import {useState} from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";

/**
 * @returns {JSX.Element} all players page
 * @constructor builds all players page
 */
export function AllPlayers() {
    // name query for sorting the already fetched players
    // can be changed freely, as it only affect data displayed on the client
    let [textQuery, setTextQuery] = useState('');
    let [selectedTags, setSelectedTags] = useState([]);

    return (
        <div>
            <Background/>
            <Banner size={'small'} state={'Players'} />
            <MobileBanner  />
            <div className={styles.MainBlock} id={styles['small']}>
                <div className={styles.Side}>
                    <div className={styles.Search}>
                        <input onChange={e => setTextQuery(e.target.value)} placeholder="search..."/>
                        <div className={styles.SearchIcon}>
                            <FaMagnifyingGlass />
                        </div>
                    </div>
                    <TagFilter onTagChange={setSelectedTags} type={'player'} />
                </div>
                <div className={styles.Content} id={styles['AllGames']}>
                    <h1>All Players</h1>
                    <CardGrid type={'player'} textQuery={textQuery} tagQuery={selectedTags} linkPrefix={''} id={'AppGrid'} />
                </div>
            </div>
        </div>
    );
}
