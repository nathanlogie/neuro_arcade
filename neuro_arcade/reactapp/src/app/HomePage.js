import {Banner} from "../components/Banner";
import {GameGrid} from "../components/game/GameGrid";
import styles from "../styles/App.module.css";
import {NavBar} from "../components/NavBar";
import {MobileBanner} from "../components/Banner";
import {Button} from "../components/Button";
import {TagFilter} from "../components/TagFilter";
import {HomePageTable} from "../components/HomePageTable";
import {requestGameTags, requestModelsRanked} from "../backendRequests";
import {motion} from "framer-motion";
import {useEffect, useState} from "react";
import {IoFilter} from "react-icons/io5";
import {Link} from "react-router-dom";
import {logout} from "../backendRequests";
import {userIsAdmin} from "../backendRequests";
import {isLoggedIn} from "../backendRequests";

/**
 * @returns {JSX.Element} home page
 * @constructor builds home page
 */
export function HomePage() {
    let [selectedTags, setSelectedTags] = useState([]);
    let [loadingTags, setLoadingTags] = useState(true);

    let [models, setModels] = useState([]);
    let [loadingModels, setLoadingModels] = useState(true);

    const [show, setShow] = useState(false);
    const [hover, setHover] = useState(false);
    const [loggedIn, setLoggedIn] = useState(isLoggedIn());

    let aboutLink = "/about";
    let userAccount = ["", ""];
    if (isLoggedIn()) {
        if (userIsAdmin()) {
            aboutLink = "/edit_about";
        }
        userAccount = ["user account", "user_account"];
    }

    function onLogout(e) {
        e.preventDefault();
        logout();
        setLoggedIn(false);
    }

    // Fetch the game tags on load
    useEffect(() => {
        requestGameTags().then((tags) => {
            setTags(tags.filter((tag) => tag.slug != "featured"));
            setForcedTags(tags.filter((tag) => tag.slug == "featured"));
            setLoadingTags(false);
        });
    }, []);

    // Fetch the model rankings on load
    useEffect(() => {
        requestModelsRanked().then((models) => {
            setModels(models);
            setLoadingModels(false);
        });
    }, []);

    let content = <>...</>;
    if (!loadingTags && !loadingModels) {
        content = (
            <>
                <div className={styles.Content} id={styles["small"]}>
                    {loggedIn ? (
                        <button onClick={onLogout}>Logout</button>
                    ) : (
                        <>
                            <Link to='/sign_up'>Create an Account</Link>
                            <Link to='/login'>Login</Link>
                        </>
                    )}
                    <div className={styles.Title}>
                        <h1>Featured games</h1>
                        <motion.div
                            className={styles.FilterButton}
                            onClick={() => setShow(!show)}
                            whileHover={{scale: 1.1}}
                            whileTap={{scale: 0.9}}
                        >
                            <IoFilter />
                        </motion.div>
                    </div>
                    <TagFilter
                        onTagChange={setSelectedTags}
                        tags={tags.map((tag) => tag.name)}
                        id={show ? "home" : "invisible"}
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
                        tagQuery={tags
                            .filter((tag, i) => selectedTags[i])
                            .concat(forcedTags)
                            .map((tag) => tag.id)}
                    />
                    <Button name={"more games"} link={"all_games"} orientation={"right"} direction={"down"} />
                </div>
                <div className={styles.Side}>
                    <HomePageTable inputData={models} />
                    <Button name={"all players"} link={"all_players"} orientation={"right"} direction={"down"} />
                </div>
            </>
        );
    }

    return (
        <div onClick={() => (show && !hover ? setShow(false) : null)}>
            <Background />
            <Banner
                size={"big"}
                button_left={{
                    name: "about",
                    link: "about",
                    orientation: "left",
                    direction: "left"
                }}
                button_right={{
                    name: "add content",
                    link: "add_content",
                    orientation: "right",
                    direction: "right"
                }}
            />
            <MobileBanner />
            <motion.div className={styles.MainBlock} id={styles["big"]} initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                <div className={styles.Content} id={styles["small"]}>
                    <div className={styles.Title}>
                        <h1>Featured games</h1>
                        <motion.div
                            className={styles.FilterButton}
                            onClick={() => setShow(!show)}
                            whileHover={{scale: 1.1}}
                            whileTap={{scale: 0.9}}
                        >
                            <IoFilter />
                        </motion.div>
                    </div>
                    <GameTagFilter
                        onTagChange={setSelectedTags}
                        excluded={forcedTags}
                        id={show ? "home" : "invisible"}
                        onMouseOver={() => setHover(true)}
                        onMouseOut={() => setHover(false)}
                    />
                    {/*
                        The featured tag is always applied, so that's put in the query for server-side
                        filtering
                        TODO: GameGrid should probably abstract the query
                        TODO: only the first 8 featured games will be requested, so when additional tags are applied
                        there may be less than 8 games shown even if other valid ones exist. Either tag filtering should
                        be done server-side (resulting in a request on every check/uncheck), or num filtering should be
                        done locally
                    */}
                    <GameGrid num={8} linkPrefix={"all_games/"} tagQuery={selectedTags.concat(forcedTags)} />
                    <Button id={"MoreGames"} name={"more games"} link={"all_games"} orientation={"right"} direction={"down"} />
                </div>
                <div className={styles.Side}></div>
                <NavBar
                    button_left={{
                        name: "about",
                        link: "about",
                        orientation: "left",
                        direction: "left"
                    }}
                    button_right={{
                        name: "add content",
                        link: "add_content",
                        orientation: "right",
                        direction: "right"
                    }}
                />
                <div className={styles.MobileBannerBuffer} />
            </motion.div>
        </div>
    );
}
