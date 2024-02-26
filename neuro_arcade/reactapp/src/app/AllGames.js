import {Banner, MobileBanner} from "../components/Banner";
import styles from "../styles/App.module.css"
import {GameGrid} from "../components/GameGrid";
import {TagFilter} from "../components/TagFilter";
import {requestGameTags} from "../backendRequests";
import {useEffect, useState} from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import {motion} from "framer-motion";
import {IoFilter} from "react-icons/io5";
import { useArraySearchParam, useSearchParam } from "../urlHelpers";

/**
 * @returns {JSX.Element} all games page
 * @constructor builds all games page
 */
export function AllGames() {
    // name query for sorting the already fetched games
    // can be changed freely, as it only affect data displayed on the client
    let [textQuery, setTextQuery] = useSearchParam('query', '');
    let [tags, setTags] = useState([]);
    let [selectedTags, setSelectedTags] = useArraySearchParam('tags');
    let [loading, setLoading] = useState(true);

    const [show, setShow] = useState(false);
    const [hover, setHover] = useState(false);

    useEffect(() => {
        requestGameTags()
            .then((tags) => {
                setTags(tags);
                setLoading(false);
            })
    }, [])

    function onTagChange(selection) {
        setSelectedTags(tags.filter((tag, i) => selection[i]).map((tag) => tag.slug))
    }

    const smallTagFilter =
        <TagFilter
            onTagChange={onTagChange}
            tags={tags.map((tag) => tag.name)}
            initialTicks={tags.map((tag) => selectedTags.includes(tag.slug))}
            id={show ? 'all' : 'invisible'}
            onMouseOver={() => setHover(true)}
            onMouseOut={() => setHover(false)}
        />;

    const largeTagFilter =
        <TagFilter
            onTagChange={onTagChange}
            tags={tags.map((tag) => tag.name)}
            initialTicks={tags.map((tag) => selectedTags.includes(tag.slug))}
            onMouseOver={() => setHover(true)}
            onMouseOut={() => setHover(false)}
        />;

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
                {largeTagFilter}
            </div>
            <div className={styles.Content} id={styles['big']}>
                <div className={styles.Title}>
                    <h1>All Games</h1>
                    <motion.div
                        className={styles.FilterButton} id={styles['all']} onClick={() => setShow(!show)}
                        whileHover={{scale: 1.1}} whileTap={{scale: 0.9}}
                    >
                        <IoFilter/>
                    </motion.div>
                </div>
                {smallTagFilter}
                <GameGrid
                    textQuery={textQuery}
                    tagQuery={tags.filter((tag) => selectedTags.includes(tag.slug)).map((tag) => tag.id)}
                />
            </div>
        </>
    }

    return (
        <div onClick={() => show && !hover ? setShow(false) : null}>
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
                <div className={styles.MobileBannerBuffer}></div>
            </motion.div>
        </div>
    );
}
