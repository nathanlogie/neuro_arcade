import {Form} from "../../components/add_content/FormGame";
import styles from "../../styles/App.module.css";
import {Background} from "../../components/Background";
import {Banner, MobileBanner} from "../../components/Banner";
import {Table} from "../../components/game/Table";

/**
 * Component for rendering the Add Game page
 */
export function AddGame() {
    return(
        <div>
            <Background/>
            <Banner size={'small'}/>
            <MobileBanner />
            <div className={styles.MainBlock}>
                <div className={styles.Content}>
                    <Form>

                    </Form>
                </div>
            </div>
        </div>
    )

}




