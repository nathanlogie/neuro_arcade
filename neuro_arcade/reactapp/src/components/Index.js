import {Banner} from "./Banner";

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
        </div>
    );
}