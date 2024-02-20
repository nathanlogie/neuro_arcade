import {Banner} from "../components/Banner";
import {GameGrid} from "../components/GameGrid";
import styles from '../styles/App.module.css';
import {NavBar} from "../components/NavBar";
import {MobileBanner} from "../components/Banner";
import {Button} from "../components/Button";
import {TagFilter} from "../components/TagFilter";
import {HomePageTable} from "../components/HomePageTable";
import {requestGameTags, requestModelsRanked} from "../backendRequests";
import {motion} from "framer-motion"
import {useEffect, useState} from "react";
import { IoFilter } from "react-icons/io5";
import {Link} from "react-router-dom";
import {logout} from "../backendRequests";
import {userIsAdmin} from "../backendRequests";
import {isLoggedIn} from "../backendRequests";
import {Card} from "../components/Card";
import { FaRegUserCircle } from "react-icons/fa";

/**
 * @returns {JSX.Element} home page
 * @constructor builds home page
 */
export function HomePage() {

    let [tags, setTags] = useState([]);
    let [forcedTags, setForcedTags] = useState([]);
    let [selectedTags, setSelectedTags] = useState([]);
    let [loadingTags, setLoadingTags] = useState(true);

    let [models, setModels] = useState([]);
    let [loadingModels, setLoadingModels] = useState(true);

    const [show, setShow] = useState(false);
    const [hover, setHover] = useState(false);
    const [loggedIn, setLoggedIn] = useState(isLoggedIn());

    let aboutLink = '/about';

    let nav_left = (
        <Button
            name={'about'}
            link={aboutLink}
            orientation={'left'}
            direction={'left'}
        />
    );

    let nav_right = (
        <Card id={'nav'} link={'sign_up'} text={'guest'} icon={<FaRegUserCircle/>}/>
    );

    if (isLoggedIn()) {
        if (userIsAdmin()) {
            aboutLink = '/edit_about';
        }
        nav_right = (
            <div className={styles.NavBuffer}>
            <Card id={'nav'} link={'user_account'} text={'user'} icon={<FaRegUserCircle/>} //TODO signed in user profile display
            />
            </div>
        );
    }

    // Fetch the data tags on load
    useEffect(() => {
        requestGameTags()
            .then((tags) => {
                setTags(tags.filter((tag) => tag.slug != 'featured'));
                setForcedTags(tags.filter((tag) => tag.slug == 'featured'));
                setLoadingTags(false);
            })
    }, [])
    
    // Fetch the model rankings on load
    useEffect(() => {
        requestModelsRanked()
            .then((models) => {
                setModels(models);
                setLoadingModels(false);
            })
    }, [])

    let content = <>...</>;
    if (!loadingTags && !loadingModels) {
        content =
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
                    {/*
                        The featured tag is always applied, so that's put in the query for server-side
                        filtering
                        TODO: CardGrid should probably abstract the query
                        TODO: only the first 8 featured games will be requested, so when additional tags are applied
                        there may be less than 8 games shown even if other valid ones exist. Either tag filtering should
                        be done server-side (resulting in a request on every check/uncheck), or num filtering should be
                        done locally
                    */}
                    <GameGrid
                        num={8}
                        tagQuery={
                            tags.filter((tag, i) => selectedTags[i])
                                .concat(forcedTags)
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
                        <HomePageTable inputData={models}/>
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
