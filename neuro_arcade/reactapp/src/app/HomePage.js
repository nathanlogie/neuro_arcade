import {Banner} from "../components/Banner";
import {GameGrid} from "../components/GameGrid";
import styles from '../styles/App.module.css';
import {NavBar} from "../components/NavBar";
import {MobileBanner} from "../components/Banner";
import {Button} from "../components/Button";
import {Background} from "../components/Background";
import {Table} from "../components/Table";
import {GameTagFilter} from "../components/GameTagFilter";
import {motion} from "framer-motion"
import {useState} from "react";
import {Link} from "react-router-dom";

export function HomePage() {
    let [selectedTags, setSelectedTags] = useState([]);
    let forcedTags = ['featured'];

    return (
        <div>
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
            <MobileBanner size={'big'} />
            <motion.div
                className={styles.MainBlock}
                id={styles['big']}
                initial={{
                    opacity: 0
                }}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
            >
                <div className={styles.Content}>
                    <Link to={"sign_up"}>Sign Up</Link>
                    <h1>Featured games</h1>
                    {/*
                        The featured tag is always applied, so that's put in the query for server-side
                        filtering
                        TODO: GameGrid should probably abstract the query
                        TODO: only the first 8 featured games will be requested, so when additional tags are applied
                        there may be less than 8 games shown even if other valid ones exist. Either tag filtering should
                        be done server-side (resulting in a request on every check/uncheck), or num filtering should be
                        done locally
                    */}
                    <GameGrid num={8} linkPrefix={'all_games/'} tagQuery={selectedTags.concat(forcedTags)}/>
                    <Button
                        id={'MoreGames'}
                        name={'more games'}
                        link={'all_games'}
                        orientation={'right'}
                        direction={'down'}
                    />
                </div>
                <div className={styles.Side}>
                    <GameTagFilter onTagChange={setSelectedTags} excluded={forcedTags}/>
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