import {Link, Navigate, useParams} from "react-router-dom";
import {requestGame} from "../backendRequests";
import styles from "../styles/App.module.css";
import {Table} from "../components/game/Table";
import {RadarC} from "../components/game/RadarC";
import {SwarmPlot} from "../components/game/SwarmPlot";
import React, {useEffect, useState} from "react";
import {Banner, MobileBanner} from "../components/Banner";
import {Switcher} from "../components/Switcher";
import {motion} from "framer-motion";
import {MdBubbleChart} from "react-icons/md";
import {AiOutlineRadarChart} from "react-icons/ai";
import {AdminRanking} from "../components/AdminRanking";
import {Button} from "../components/Button";
import {isLoggedIn, isOwner} from "../backendRequests";
import { FaRegPenToSquare } from "react-icons/fa6";

/**
 *
 * @returns {JSX.Element} game view page
 * @constructor builds game view page
 */
export function GameView() {
    // see: https://reactrouter.com/en/main/start/concepts#data-access
    let gameSlug = useParams().game_slug;
    let [loading, setLoading] = useState(true);
    let [gameData, setGameData] = useState({});
    let type_count = 0;

    useEffect(() => {
        requestGame(gameSlug).then((g) => {
            setGameData(g);
            setLoading(false);
            type_count = g.table_headers.length;
        });
    }, []);

    const swarm = <MdBubbleChart />;
    const radar = <AiOutlineRadarChart />;

    const graphHeaders = {
        table_headers: [{name: swarm}, {name: radar}]
    };

    const [selectedSwitcherValue, setSelectedSwitcherValue] = React.useState(swarm);

    const handleSwitcherChange = (selectedValue) => {
        setSelectedSwitcherValue(selectedValue);
    };

    const editButton = (
        <Link
         to={'edit'}>
            <motion.div whileHover={{scale: 1.1}} whileTap={{scale: 0.9}}>
                <div>
                    <FaRegPenToSquare />
                </div>
            </motion.div>
        </Link>
    )

    let content = <>...</>;
    if (!loading) {
        content = (
            <motion.div className={styles.MainBlock} id={styles["small"]} initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                <div className={styles.Content}>
                    <div className={styles.Title}>
                        <h1>{gameData.game.name}</h1>
                        {isOwner(gameData.owner) ? editButton : null}
                    </div>
                    <div className={styles.Title}>
                        <AdminRanking game={gameData.game.id} rating={gameData.game.priority} />
                    </div>
                    <div className={styles.ContentBlock}>
                        <p>
                            <img
                                src='https://loremflickr.com/500/500'
                                alt={"image"} // TODO add query for image here
                            />
                            {gameData.game.description}
                        </p>
                    </div>
                </div>
                <div className={styles.DataBlock}>
                    <Table inputData={gameData} />
                    <div className={styles.Graphs}>
                        <h2>Trends</h2>
                        <div className={styles.GraphSwitcher}>
                            {gameData.table_headers.length > 2 ? (
                                <Switcher
                                    data={graphHeaders}
                                    onSwitcherChange={handleSwitcherChange}
                                    switcherDefault={selectedSwitcherValue}
                                    id={styles["vertical"]}
                                />
                            ) : (
                                <></>
                            )}
                        </div>
                        <div className={styles.Background}>
                            {selectedSwitcherValue.type.toString() === swarm.type.toString() ? <SwarmPlot inputData={gameData} /> : <></>}
                            {selectedSwitcherValue.type.toString() === radar.type.toString() ? <RadarC inputData={gameData} /> : <></>}
                        </div>
                    </div>
                </div>
                {isLoggedIn() ? <Button name={"Upload Scores"} link={"upload_scores"} orientation={"right"} direction={"down"} /> : null}
                <div className={styles.MobileBannerBuffer} />
            </motion.div>
        );
    }

    return (
        <>
            <Banner size={"small"} selected={"Games"} />
            <MobileBanner />
            {content}
        </>
    );
}
