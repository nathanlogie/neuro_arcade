import {Background} from "../components/Background";
import {Banner, MobileBanner} from "../components/Banner";
import styles from "../styles/App.module.css";
import {useState} from "react";
import {login} from "../backendRequests";
import {Navigate, Link} from "react-router-dom";

export function Login() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [success, setSuccess] = useState(false);
    const [invalidMessage, setInvalidMessage] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        await login(username, email, password)
            .then(function () {
                setSuccess(true);
            })
            .catch(function (error) {
                console.log("AN ERROR HAS OCCURRED: " + error);
                setInvalidMessage("Invalid Details.");
            });
    }

    return (
        <>
            <Background />
            <Banner size={"big"} />
            <MobileBanner size={"big"} />
            <div className={styles.MainBlock} id={styles["small"]}>
                <div className={styles.Title}>
                    <h1>{success ? <Navigate to={"/"} /> : "Login"}</h1>
                </div>
                <div className={styles.Content}>
                    <p>{invalidMessage}</p>
                    <form onSubmit={handleSubmit}>
                        <p>
                            Username:{" "}
                            <input
                                type={"text"}
                                value={username}
                                placeholder={"Username..."}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </p>
                        <p>
                            Email:{" "}
                            <input type={"email"} value={email} placeholder={"Email..."} onChange={(e) => setEmail(e.target.value)} />
                        </p>
                        <p>
                            Password:{" "}
                            <input
                                type={"password"}
                                value={password}
                                placeholder={"Password..."}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </p>
                        <button type={"submit"}>LOGIN</button>
                    </form>

                    <p>
                        Don't have an account? <Link to='/sign_up'>Sign Up Here</Link>
                    </p>
                </div>
            </div>
        </>
    );
}
