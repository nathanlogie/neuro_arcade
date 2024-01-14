import {Banner} from "./Banner";
import {GameCard} from "./GameCard";
import game_image from '../temp_static/images/game_icon.png'

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
            <GameCard
                name={'test game'}
                image={game_image}
                link={''} // TODO Django Link API
            />
        </div>
    );
}