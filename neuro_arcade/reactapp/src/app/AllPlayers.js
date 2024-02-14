import {Banner, MobileBanner} from "../components/Banner";
import styles from "../styles/App.module.css";
import {PlayerGrid, PlayerGridMode} from "../components/PlayerGrid";
import {TagFilter} from "../components/TagFilter";
import {requestPlayerTags} from "../backendRequests";
import React, {useEffect, useState} from "react";
import {FaMagnifyingGlass} from "react-icons/fa6";
import {Switcher} from "../components/Switcher";
import {motion} from "framer-motion";

/**
 * @returns {JSX.Element} all players page
 * @constructor builds all players page
 */
export function AllPlayers() {
    // name query for sorting the already fetched players
    // can be changed freely, as it only affect data displayed on the client
    let [textQuery, setTextQuery] = useState("");
    let [tags, setTags] = useState([]);
    let [selectedTags, setSelectedTags] = useState([]);
    let [loading, setLoading] = useState(true);

    let modes = [PlayerGridMode.ALL, PlayerGridMode.HUMAN, PlayerGridMode.AI];
    let [modeIdx, setModeIdx] = useState(0);

    const [selectedSwitcherValue, setSelectedSwitcherValue] = React.useState("all");

    /**
     * @param selectedValue {string}
     */
    const handleSwitcherChange = (selectedValue) => {
        setSelectedSwitcherValue(selectedValue);
        if (selectedValue === "AI Platforms") {
            setModeIdx(2);
        }
        if (selectedValue === "Humans") {
            setModeIdx(1);
        }
        if (selectedValue === "all") {
            setModeIdx(0);
        }
    };

    const switcher_labels = {
        table_headers: [{name: "AI Platforms"}, {name: "all"}, {name: "Humans"}]
    };

    useEffect(() => {
        requestPlayerTags().then((tags) => {
            setTags(tags);
            setLoading(false);
        });
    }, []);

    let content = <>...</>;
    if (!loading) {
        content = (
            <>
                <div className={styles.Side}>
                    <div className={styles.Search}>
                        <input onChange={(e) => setTextQuery(e.target.value)} placeholder='search...' />
                        <div className={styles.SearchIcon}>
                            <FaMagnifyingGlass />
                        </div>
                    </div>
                    <div className={styles.Switcher}>
                        <Switcher data={switcher_labels} onSwitcherChange={handleSwitcherChange} switcherDefault={selectedSwitcherValue} />
                    </div>
                    <TagFilter tags={tags.map((tag) => tag.name)} onTagChange={setSelectedTags} />
                </div>
                <div className={styles.Content} id={styles["AllGames"]}>
                    <h1>All Players</h1>
                    <PlayerGrid
                        mode={modes[modeIdx]}
                        textQuery={textQuery}
                        tagQuery={tags.filter((tag, i) => selectedTags[i]).map((tag) => tag.id)}
                        id={"AppGrid"}
                    />
                </div>
            </>
        );
    }

    return (
        <>
            <Banner size={"small"} state={"Players"} />
            <MobileBanner />
            <motion.div
                className={styles.MainBlock}
                id={styles["small"]}
                initial={{opacity: 0, y: -100}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -100}}
            >
                {content}
            </motion.div>
        </>
    );
}
