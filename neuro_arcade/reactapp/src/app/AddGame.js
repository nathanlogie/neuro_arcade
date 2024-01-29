import {Form} from "../components/FormGame";
import styles from "../styles/App.module.css";
import {Background} from "../components/Background";
import {Banner, MobileBanner} from "../components/Banner";

export function AddGame() {
    return(
            <div>
                <Background/>
                <Banner size={'small'}/>
                <MobileBanner size={'small'}/>
                <div className={styles.MainBlock}>
                    <div className={styles.Content}>
                        <Form></Form>
                    </div>
                </div>
            </div>
        )

}




