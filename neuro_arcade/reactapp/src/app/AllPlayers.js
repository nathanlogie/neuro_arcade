import {Banner, MobileBanner} from "../components/Banner";
import {Background} from "../components/Background";
import styles from "../styles/App.module.css"
import {PlayerGrid, PlayerGridMode} from "../components/PlayerGrid";
import {TagFilter} from "../components/TagFilter";
import {RadioList} from "../components/RadioList";
import {requestPlayerTags} from "../backendRequests";
import {useEffect, useState} from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";

/**
 * @returns {JSX.Element} all players page
 * @constructor builds all players page
 */
export function AllPlayers() {
    // name query for sorting the already fetched players
    // can be changed freely, as it only affect data displayed on the client
    let [textQuery, setTextQuery] = useState('');
    let [tags, setTags] = useState([]);
    let [selectedTags, setSelectedTags] = useState([]);
    let [loading, setLoading] = useState(true);

    let modes = [PlayerGridMode.ALL, PlayerGridMode.HUMAN, PlayerGridMode.AI];
    let [modeIdx, setModeIdx] = useState(0);

    useEffect(() => {
        requestPlayerTags()
            .then((tags) => {
                setTags(tags);
                setLoading(false);
            })
    }, [])

    if (loading) {
        return <>
            Loading...
        </>
    }

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

                    <TagFilter
                        tags={tags.map((tag) => tag.name)}
                        onTagChange={setSelectedTags}
                    />

                    <div>
                        <RadioList name='mode' options={modes} onChange={(i) => setModeIdx(i)} />
                    </div>
                </div>
                <div className={styles.Content} id={styles['AllGames']}>
                    <h1>All Players</h1>
                    <PlayerGrid
                        mode={modes[modeIdx]}
                        textQuery={textQuery}
                        tagQuery={tags.filter((tag, i) => selectedTags[i]).map((tag) => tag.id)}
                        id={'AppGrid'}
                    />
                </div>
            </div>
        </div>
    );
}
