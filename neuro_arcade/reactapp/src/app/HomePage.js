import {Banner} from "../components/Banner";
import {GameGrid} from "../components/GameGrid";
import styles from '../styles/App.module.css';
import {NavBar} from "../components/NavBar";
import {MobileBanner} from "../components/Banner";
import {Button} from "../components/Button";
import {Background} from "../components/Background";
import {Table} from "../components/Table";
import {motion} from "framer-motion"

export function HomePage() {
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
            <MobileBanner size={'big'} />
            <motion.div
                className={styles.MainBlock}
                initial={{
                    opacity: 0

                }}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
            >
                <div className={styles.Content}>
                    <h1>Featured games</h1>
                    <GameGrid query={'?query=&tags=featured&num=10'} linkPrefix={'all_games/'}/>
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
            </motion.div>
            <div className={styles.MobileBannerBuffer} />
        </div>
    );
}