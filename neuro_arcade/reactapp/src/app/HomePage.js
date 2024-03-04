import {Banner} from "../components/Banner";
import {GameGrid} from "../components/GameGrid";
import styles from '../styles/App.module.css';
import {NavBar} from "../components/NavBar";
import {MobileBanner} from "../components/Banner";
import {Button} from "../components/Button";
import {TagFilter} from "../components/TagFilter";
import {HomePageTable} from "../components/HomePageTable";
import {
    API_ROOT,
    getHumanPlayerFromCurrentUser,
    getUser,
    requestGameTags,
    requestPlayersRanked
} from "../backendRequests";
import {motion} from "framer-motion";
import {useEffect, useState} from "react";
import { IoFilter } from "react-icons/io5";
import {isLoggedIn} from "../backendRequests";
import {Card} from "../components/Card";
import { FaRegUserCircle } from "react-icons/fa";

/**
 * @returns {JSX.Element} home page
 * @constructor builds home page
 */
export function HomePage() {

    let [tags, setTags] = useState([]);
    let [selectedTags, setSelectedTags] = useState([]);
    let [loadingTags, setLoadingTags] = useState(true);

    let [players, setPlayers] = useState([]);
    let [loadingPlayers, setLoadingPlayers] = useState(true);

    const [show, setShow] = useState(false);
    const [hover, setHover] = useState(false);

    const [loggedIn, setLoggedIn] = useState(isLoggedIn());

    const [playerIcon, setPlayerIcon] = useState(<FaRegUserCircle/>)

    let nav_left = (
        <Button
            name={'about'}
            link={'/about'}
            orientation={'left'}
            direction={'left'}
        />
    );

    let nav_right = (
        <Card id={'nav'} link={'sign_up'} text={'Guest'} icon={<FaRegUserCircle/>}/>
    );

    if (isLoggedIn()) {
        getHumanPlayerFromCurrentUser().then(p => {
            if (p.data.icon) {
                setPlayerIcon(<img src={API_ROOT + p.data.icon}/>);
            }
        }).catch(() => {})
        nav_right = <Card id={'nav'} link={'user_account'} text={getUser().name} icon={playerIcon}/>;
    }

    // Fetch the data tags on load
    useEffect(() => {
        requestGameTags()
            .then((tags) => {
                setTags(tags.filter((tag) => tag.slug != 'featured'));
                setLoadingTags(false);
            })
    }, [])
    
    // Fetch the model rankings on load
    useEffect(() => {
        requestPlayersRanked()
            .then((players) => {
                setPlayers(players);
                setLoadingPlayers(false);
            })
    }, [])

    let content = <>...</>;
    if (!loadingTags && !loadingPlayers) {
        content =
            <motion.div
                className={styles.MainBlock}
                id={styles['big']}
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
            >
                <div className={styles.Content}>
                    <div className={styles.Title}>
                        <h1>Featured Games</h1>
                        <motion.div
                            className={styles.FilterButton} onClick={() => setShow(!show)}
                            whileHover={{scale: 1.1}} whileTap={{scale: 0.9}}
                        >
                            <IoFilter/>
                        </motion.div>
                    </div>
                    <TagFilter
                        onTagChange={setSelectedTags}
                        tags={tags.map((tag) => tag.name)}
                        id={show ? 'home' : 'invisible'}
                        onMouseOver={() => setHover(true)}
                        onMouseOut={() => setHover(false)}
                    />
                    <GameGrid
                        num={8}
                        tagQuery={
                            tags.filter((tag, i) => selectedTags[i])
                                .map((tag) => tag.id)
                        }
                    />
                    <Button
                        name={'more games'}
                        link={'all_games'}
                        orientation={'right'}
                        direction={'down'}
                    />
                </div>
                <div className={styles.Side}>
                    <div className={styles.DataBlock}>
                        <HomePageTable inputData={players}/>
                    </div>
                    <Button
                        name={'all players'}
                        link={'all_players'}
                        orientation={'right'}
                        direction={'down'}
                    />
                </div>
                <div className={styles.MobileBannerBuffer}/>
            </motion.div>;
    }

    return (
        <div onClick={() => show && !hover ? setShow(false) : null}>
            <Banner size={'big'} left={nav_left} right={nav_right}/>
            <MobileBanner/>
            <NavBar left={nav_left} right={nav_right} />
                {content}
        </div>
    );
}
