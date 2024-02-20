import {useNavigate, useParams} from "react-router-dom";
import {requestGame} from "../backendRequests";
import styles from "../styles/App.module.css";
import {Table} from "../components/game/Table";
import {LineC} from "../components/game/LineC";
import {RadarC} from "../components/game/RadarC";
import {SwarmPlot} from "../components/game/SwarmPlot";
import React, {useEffect, useState} from "react";
import {Banner, MobileBanner} from "../components/Banner";
import {Switcher} from "../components/Switcher";

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
    let graph;

    useEffect(() => {
        requestGame(gameSlug)
            .then(g => {
                setGameData(g);
                setLoading(false);
                type_count = g.table_headers.length;
            })
    }, []);

    const small = {
        table_headers: [
            { name: 'Line Chart' },
            { name: 'Swarm Plot' }
        ],
    };

    const big = {
        table_headers: [
            { name: 'Line Chart' },
            { name: 'Swarm Plot' },
            { name: 'Radar Chart' },
        ],
    };

    const [selectedSwitcherValue, setSelectedSwitcherValue] = React.useState('Line Chart');

    const handleSwitcherChange = (selectedValue) => {
        setSelectedSwitcherValue(selectedValue);
    }


    let content = <>...</>;
    if (!loading) {
        content = <>
            <div className={styles.Content}>
                <div className={styles.Title}>
                    <h1>{gameData.game.name}</h1>
                </div>
                <div className={styles.ContentBlock}>
                    <p>
                        <img src="https://loremflickr.com/500/500" alt={'image'} // TODO add query for image here
                        />
                        {gameData.game.description}
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
                                data={big}
                                onSwitcherChange={handleSwitcherChange}
                                switcherDefault={selectedSwitcherValue}
                                id={styles['vertical']}
                            /> :
                            <Switcher
                                data={small}
                                onSwitcherChange={handleSwitcherChange}
                                switcherDefault={selectedSwitcherValue}
                                id={styles['vertical']}
                            />
                        }
                    </div>
                    <div className={styles.Background}>
                        {selectedSwitcherValue === 'Line Chart' ? <LineC inputData={gameData}/> : <></>}
                        {selectedSwitcherValue === 'Swarm Plot' ? <SwarmPlot inputData={gameData}/> : <></>}
                        {selectedSwitcherValue === 'Radar Chart' ? <RadarC inputData={gameData}/> : <></>}
                    </div>
                </div>
            </div>
        </>;
    }

    return (
        <>
            <Banner size={'small'} selected={'Games'} />
                <MobileBanner/>
                <div className={styles.MainBlock} id={styles['small']}>
                    {content}
                </div>
            </>
        );
}
