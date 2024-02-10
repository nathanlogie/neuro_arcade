import {Banner} from "../components/Banner";
import {CardGrid} from "../components/CardGrid";
import styles from '../styles/App.module.css';
import {NavBar} from "../components/NavBar";
import {MobileBanner} from "../components/Banner";
import {Button} from "../components/Button";
import {Background} from "../components/Background";
import {TagFilter} from "../components/TagFilter";
import {requestGameTags} from "../backendRequests";
import {motion} from "framer-motion"
import {useEffect, useState} from "react";
import { IoFilter } from "react-icons/io5";

/**
 * @returns {JSX.Element} home page
 * @constructor builds home page
 */
export function HomePage() {
    let [tags, setTags] = useState([]);
    let [forcedTags, setForcedTags] = useState([]);
    let [selectedTags, setSelectedTags] = useState([]);
    let [loading, setLoading] = useState(true);

    const [show, setShow] = useState(false);
    const [hover, setHover] = useState(false);

    // Fetch the game tags on load
    useEffect(() => {
        requestGameTags()
            .then((tags) => {
                setTags(tags.filter((tag) => tag.slug != 'featured'));
                setForcedTags(tags.filter((tag) => tag.slug == 'featured'));
                setLoading(false);
            })
    }, [])

    if (loading) {
        return <>
            Loading...
        </>
    }

    return (
        <div onClick={() => show && !hover ? setShow(false) : null}>
            <Background />
            <Banner size={'big'} button_left={{
                name: 'about',
                link: 'about',
                orientation: 'left',
                direction: 'left'
            }} button_right={{
                name: 'add content',
                link: 'add_content',
                orientation: 'right',
                direction: 'right'
            }} />
            <MobileBanner  />
            <motion.div
                className={styles.MainBlock}
                id={styles['big']}
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
            >
                <div className={styles.Content} id={styles['small']}>
                    <div className={styles.Title}>
                        <h1>Featured games</h1>
                        <motion.div
                            className={styles.FilterButton} onClick={() => setShow(!show)}
                            whileHover={{scale: 1.1}} whileTap={{scale: 0.9}}
                        >
                            <IoFilter />
                        </motion.div>
                    </div>
                    <TagFilter
                        onTagChange={setSelectedTags}
                        tags={tags.map((tag) => tag.name)}
                        id={show ? 'home' : 'invisible'}
                        onMouseOver={() => setHover(true)}
                        onMouseOut={() => setHover(false)}
                    />
                    {/*
                        The featured tag is always applied, so that's put in the query for server-side
                        filtering
                        TODO: CardGrid should probably abstract the query
                        TODO: only the first 8 featured games will be requested, so when additional tags are applied
                        there may be less than 8 games shown even if other valid ones exist. Either tag filtering should
                        be done server-side (resulting in a request on every check/uncheck), or num filtering should be
                        done locally
                    */}
                    <CardGrid
                        type={'game'}
                        num={8}
                        linkPrefix={'all_games/'}
                        tagQuery={
                            tags.filter((tag, i) => selectedTags[i])
                                .concat(forcedTags)
                                .map((tag) => tag.id)
                        }
                    />
                    <Button
                        id={'MoreGames'}
                        name={'more games'}
                        link={'all_games'}
                        orientation={'right'}
                        direction={'down'}
                    />
                </div>
                <div className={styles.Side}>
                </div>
                <NavBar button_left={{
                    name: 'about',
                    link: 'about',
                    orientation: 'left',
                    direction: 'left'
                }} button_right={{
                    name: 'add content',
                    link: 'add_content',
                    orientation: 'right',
                    direction: 'right'
                }}
                />
                <div className={styles.MobileBannerBuffer}/>
            </motion.div>
        </div>
    );
}
