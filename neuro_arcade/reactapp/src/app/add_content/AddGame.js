import {FormGame} from "../../components/add_content/FormGame";
import styles from "../../styles/App.module.css";
import {Background} from "../../components/Background";
import {Banner, MobileBanner} from "../../components/Banner";

/**
 * @returns {JSX.Element} add game page
 * @constructor builds add game page
 */
export function AddGame() {
    return(
        <div>
            <Background/>
            <Banner size={'small'}/>
            <MobileBanner />
            <div className={styles.MainBlock}>
                <div className={styles.Content}>
                    <FormGame />
                </div>
            </div>
        </div>
    )

}
