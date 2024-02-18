import {Banner, MobileBanner} from "../components/Banner";
import styles from "../styles/App.module.css";
import React, {useState} from "react";
import {login} from "../backendRequests";
import {Navigate, Link} from "react-router-dom"
import {NavBar} from "../components/NavBar";
import {Button} from "../components/Button";
import {motion} from "framer-motion";
import { FaArrowDown } from "react-icons/fa6";

export function Login() {
    // userID is either a username or an email address.
    const [userID, setUserID] = useState("");
    const [password, setPassword] = useState("");
    const [success, setSuccess] = useState(false);
    const [invalidMessage, setInvalidMessage] = useState("")

    async function handleSubmit(e) {
        e.preventDefault();
        await login(userID, password).then(() => {
            setSuccess(true);
            setInvalidMessage("");
        }).catch((error) => setInvalidMessage("Invalid Details. Error: " + error.toString()))
    }

    let nav_left = (
        <Button
            name={'home'}
            link={'/'}
            orientation={'left'}
            direction={'left'}
            key={0}
        />
    );

    return (
        <>
            <Banner size={'big'} left={nav_left}/>
            <MobileBanner/>
            <NavBar left={nav_left}/>
            <motion.div
                className={styles.MainBlock}
                id={styles['big']}
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
            >

                <div className={styles.Form}>
                    <h1>{success ? <Navigate to={'/'}/> : "Sign in"}</h1>
                    <form onSubmit={handleSubmit}>
                        <h3>Username</h3>
                        <input
                            type={"text"}
                            value={userID}
                            placeholder={"type in your email or username"}
                            onChange={(e) => setUserID(e.target.value)}
                        />
                        <h3>Password</h3>
                        <input
                            type={"password"}
                            value={password}
                            placeholder={"..."}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div>{invalidMessage}</div>
                        <motion.button
                            type={"submit"}
                            whileHover={{scale: 1.1}}
                            whileTap={{scale: 0.9}}
                        >
                            sign in
                            <div>
                                <FaArrowDown/>
                            </div>
                        </motion.button>
                        <p>Don't have an account? <Link to='/sign_up'>Sign Up Here</Link></p>
                    </form>
                </div>
            </motion.div>
        </>
    )

}