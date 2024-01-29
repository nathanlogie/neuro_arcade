import {Form} from "../components/FormGame";
import {useState} from "react";
import styles from "../styles/App.module.css";
import {Background} from "../components/Background";
import {Banner, MobileBanner} from "../components/Banner";
import {Table} from "../components/Table";

export function AddGame() {
    let [isLoading, setLoading] = useState(true);
    if (isLoading) {
        return (
            <div className={styles.MainBlock}>
                Loading...
            </div>
        )
    } else {
        return (
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
}




