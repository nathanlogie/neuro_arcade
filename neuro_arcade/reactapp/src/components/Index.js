import {Banner} from "./Banner";
import {GameGrid} from "./GameGrid";
import styles from '../styles/Index.module.css'
import {NavBar} from "./NavBar";
import {MobileBanner} from "./Banner";
import {Button} from "./Button";

export function Index() {
    return (
        <div>
            <Banner size={'big'} button_left={{
                name: 'About',
                link: '...', // TODO Django link API
                orientation: 'left',
                direction: 'left'
            }} button_right={{
                name: 'Add Content',
                link: '...', // TODO Django link API
                orientation: 'right',
                direction: 'right'
            }} />
            <NavBar button_left={{
                name: 'About',
                link: '...', // TODO Django link API
                orientation: 'left',
                direction: 'left'
            }} button_right={{
                name: 'Add Content',
                link: '...', // TODO Django link API
                orientation: 'right',
                direction: 'right'
            }}
            />
            <MobileBanner size={'big'} />
            <div className={styles.MainBlock}>
                <div className={styles.Content}>
                    <h1>Featured games</h1>
                    <GameGrid query={'?query=&tags=featured'} />
                    <Button
                        id={'MoreGames'}
                        name={'More Games'}
                        link={'...'} // TODO Django Link API
                        orientation={'right'}
                        direction={'down'}
                    />
                </div>
            </div>
            <div className={styles.MobileBannerBuffer} />
        </div>
    );
}