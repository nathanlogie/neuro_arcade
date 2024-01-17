import {Banner} from "../components/Banner";
import {Background} from "../components/Background";
import styles from "../styles/App.module.css"

export function AllGames() {
    return (
        <div>
            <Background />
            <Banner size={'small'} />
        </div>
    );
}