import {Background} from "../components/Background";
import {Banner, MobileBanner} from "../components/Banner";
import styles from "../styles/App.module.css";
import {useState} from "react";
import {signupNewUser} from "../backendRequests";
import {Navigate} from "react-router-dom"

export function SignUp(){

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [success, setSuccess] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        await signupNewUser(username, email, password)
            .then (function() {
                setSuccess(true)
            })
            .catch (function(error){
                console.log("AN ERROR HAS OCCURRED: " + error)
            })
    }

    return (
        <>
            <Background/>
            <Banner size={'small'}/>
            <MobileBanner size={'small'} />
            <div className={styles.MainBlock} id={styles['small']}>

                <h1>{success ? <Navigate to={'/'}/> : "Create an Account"}</h1>
                <form onSubmit={handleSubmit}>

                    <label>Username: <input type={"text"} value={username} placeholder={"Username..."} onChange={(e) => setUsername(e.target.value)}/></label>
                    <label>Email: <input type={"email"} value={email} placeholder={"Email..."} onChange={(e) => setEmail(e.target.value)}/></label>
                    <label>Password: <input type={"password"} value={password} placeholder={"Password..."} onChange={(e) => setPassword(e.target.value)}/></label>

                    <button type={"submit"}>CREATE ACCOUNT</button>

                </form>

            </div>
        </>
    )

}