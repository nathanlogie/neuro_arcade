import {useNavigate, useParams} from "react-router-dom";
import {requestGame} from "../backendRequests";
import styles from "../styles/App.module.css";
import {Table} from "../components/game/Table";
import {RadarC} from "../components/game/RadarC";
import {SwarmPlot} from "../components/game/SwarmPlot";
import React, {useEffect, useState} from "react";
import {Banner, MobileBanner} from "../components/Banner";
import {Switcher} from "../components/Switcher";
import {motion} from "framer-motion";
import {AdminRanking} from "../components/AdminRanking";

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
        requestGame(gameSlug)
            .then(g => {
                setGameData(g);
                setLoading(false);
                type_count = g.table_headers.length;
            })
    }, []);

    const graphHeaders = {
        table_headers: [
            { name: 'Swarm Plot' },
            { name: 'Radar Chart' },
        ],
    };

    const [selectedSwitcherValue, setSelectedSwitcherValue] = React.useState('Swarm Plot');

    const handleSwitcherChange = (selectedValue) => {
        setSelectedSwitcherValue(selectedValue);
    }

    let content = <>...</>;
    if (!loading) {
        content =
            <motion.div
                className={styles.MainBlock}
                id={styles['small']}
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
            >
                <div className={styles.Content}>
                    <div className={styles.Title}>
                        <h1>{gameData.game.name}</h1>
                    </div>
                    <div className={styles.ContentBlock}>
                        <p>
                            <img src="https://loremflickr.com/500/500" alt={'image'} // TODO add query for image here
                            />
                            {gameData.game.description}
                            <AdminRanking game={gameData.game.id} rating={gameData.game.priority}/>
                        </p>
                    </div>
                </div>
                <div className={styles.DataBlock}>
                    <Table inputData={gameData}/>
                    <div className={styles.Graphs}>
                        <h2>Trends</h2>
                        <div className={styles.GraphSwitcher}>
                            {gameData.table_headers.length > 2 ?
                                <Switcher
                                    data={graphHeaders}
                                    onSwitcherChange={handleSwitcherChange}
                                    switcherDefault={selectedSwitcherValue}
                                    id={styles['vertical']}
                                /> : <></>
                            }
                        </div>
                        <div className={styles.Background}>
                            {selectedSwitcherValue === 'Swarm Plot' ? <SwarmPlot inputData={gameData}/> : <></>}
                            {selectedSwitcherValue === 'Radar Chart' ? <RadarC inputData={gameData}/> : <></>}
                        </div>
                    </div>
                </div>
            </motion.div>;
    }

    return (
        <>
            <Banner size={'small'} selected={'Games'}/>
            <MobileBanner/>
            {content}
        </>
    );
}
