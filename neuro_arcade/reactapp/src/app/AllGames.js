import {Banner, MobileBanner} from "../components/Banner";
import styles from "../styles/App.module.css"
import {GameGrid} from "../components/GameGrid";
import {TagFilter} from "../components/TagFilter";
import {requestGameTags} from "../backendRequests";
import {useEffect, useState} from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import {motion} from "framer-motion";

/**
 * @returns {JSX.Element} all games page
 * @constructor builds all games page
 */
export function AllGames() {
    // name query for sorting the already fetched games
    // can be changed freely, as it only affect data displayed on the client
    let [textQuery, setTextQuery] = useState('');
    let [tags, setTags] = useState([]);
    let [selectedTags, setSelectedTags] = useState([]);
    let [loading, setLoading] = useState(true);

    useEffect(() => {
        requestGameTags()
            .then((tags) => {
                setTags(tags);
                setLoading(false);
            })
    }, [])

    let content = <>...</>;
    if (!loading) {
        content = <>
            <div className={styles.Side}>
                <div className={styles.Search}>
                    <input onChange={e => setTextQuery(e.target.value)} placeholder="search..."/>
                    <div className={styles.SearchIcon}>
                        <FaMagnifyingGlass/>
                    </div>
                </div>
                <TagFilter
                    tags={tags.map((tag) => tag.name)}
                    onTagChange={setSelectedTags}
                />
            </div>
            <div className={styles.Content} id={styles['big']}>
                <h1>All Games</h1>
                <GameGrid
                    textQuery={textQuery}
                    tagQuery={tags.filter((tag, i) => selectedTags[i]).map((tag) => tag.id)}
                    id={'AppGrid'}
                />
            </div>
        </>
    }

    return (
        <>
            <Banner size={'small'} selected={'Games'}/>
            <MobileBanner/>
            <motion.div
                className={styles.MainBlock}
                id={styles['small']}
                initial={{opacity: 0, y: -100}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -100}}
            >
                {content}
            </motion.div>
        </>
    );
}
