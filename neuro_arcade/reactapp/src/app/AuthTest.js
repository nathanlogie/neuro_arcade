import {Background} from "../components/Background";
import {MobileBanner} from "../components/Banner";
import styles from "../styles/App.module.css";
import {createNewPlayer, deletePlayer, ping, login, logout, postGameScore, signupNewUser} from "../backendRequests";
import {useState} from "react";
import {motion} from "framer-motion";

/**
 * Page for testing various authentication related functions.
 * Make sure it is deleted before production.
 */
export function AuthTest() {
    let [response, setResponse] = useState({});
    let [userInfo, setUserInfo] = useState(localStorage.getItem("user"));
    return (
        <div>
            <Background />
            <MobileBanner size={"big"} />
            <motion.div className={styles.MainBlock} initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                <div className={styles.Content}>
                    <button
                        onClick={() =>
                            signupNewUser("newGuy", "newGuy@gmail.com", "asdfqwer112!").then((r) => {
                                setResponse(r);
                                setUserInfo(localStorage.getItem("user"));
                            })
                        }
                    >
                        signup as 'newGuy'
                    </button>
                    <button
                        onClick={() =>
                            login("newGuy", "newGuy@gmail.com", "asdfqwer112!").then((r) => {
                                setResponse(r);
                                setUserInfo(localStorage.getItem("user"));
                            })
                        }
                    >
                        login as 'newGuy'
                    </button>
                    <button
                        onClick={() => {
                            logout();
                            setUserInfo(localStorage.getItem("user"));
                        }}
                    >
                        logout
                    </button>
                    <button onClick={() => createNewPlayer("newGuyPlayer", true).then((r) => setResponse(r))}>create newGuyPlayer</button>
                    <button onClick={() => deletePlayer("newGuyPlayer").then((r) => setResponse(r))}>delete newGuyPlayer</button>
                    <button
                        onClick={() =>
                            postGameScore("words", "newGuyPlayer", {Points: 20}).then((r) => {
                                setResponse(r);
                                setUserInfo(localStorage.getItem("user"));
                            })
                        }
                    >
                        postGameScore
                    </button>
                    <button onClick={() => ping().then((r) => setResponse(r))}>ping!</button>
                    <h2>CURRENT USER:</h2>
                    {userInfo}
                    <h2>RESPONSE:</h2>
                    status: {response.status} <br />
                    data: {JSON.stringify(response.data)}
                </div>
            </motion.div>
        </div>
    );
}
