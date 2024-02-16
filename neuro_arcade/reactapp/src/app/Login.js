import {Banner, MobileBanner} from "../../components/Banner";
import styles from "../../styles/App.module.css";
import React, {useState} from "react";
import {login} from "../../backendRequests";
import {Navigate, Link} from "react-router-dom"
import {NavBar} from "../../components/NavBar";
import {Button} from "../../components/Button";
import {motion} from "framer-motion";
import { FaArrowDown } from "react-icons/fa6";

export function Login() {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [success, setSuccess] = useState(false);
    const [invalidMessage, setInvalidMessage] = useState("")

    async function handleSubmit(e) {
        e.preventDefault();

        await login(username, email, password)
            .then (function() {
                setSuccess(true)
            })
            .catch (function(error){
                console.log("AN ERROR HAS OCCURRED: " + error)
                setInvalidMessage("Invalid Details.")
            })
    }

    let nav_left = (
        <Button
            name={'home'}
            link={'/'}
            orientation={'left'}
            direction={'left'}
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
                            value={username}
                            placeholder={"User"}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <h3>Email</h3>
                        <input
                            type={"email"}
                            value={email}
                            placeholder={"example@email.address"}
                            onChange={(e) => setEmail(e.target.value)}
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