import {Background} from "../components/Background";
import {Banner, MobileBanner} from "../components/Banner";
import styles from "../styles/App.module.css";
import {useState} from "react";
import {signupNewUser} from "../backendRequests";
import {Navigate, Link} from "react-router-dom"

export function SignUp(){

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isPasswordMatch, setIsPasswordMatch] = useState(true)
    const [success, setSuccess] = useState(false);
    const [invalidResponse, setInvalidResponse] = useState("")

    async function handleSubmit(e) {
        e.preventDefault();

        if (password!==confirmPassword){
            setIsPasswordMatch(false)
            return;
        }
        setIsPasswordMatch(true)

        await signupNewUser(username, email, password)
            .then (function() {
                setSuccess(true)
            })
            .catch (function(error){
                console.log("AN ERROR HAS OCCURRED: " + error)
                setInvalidResponse(error.response.data)
            })
    }

    return (
        <>
            <Background/>
            <Banner size={'big'}/>
            <MobileBanner size={'big'} />
            <div className={styles.MainBlock} id={styles['small']}>

                <div className={styles.Title}>
                    <h1>{success ? <Navigate to={'/login'}/> : "Create an Account"}</h1>
                </div>
                <div className={styles.Content}>
                    <p>{ invalidResponse }</p>
                    <form onSubmit={handleSubmit}>

                        <p>Username: <input type={"text"} value={username} placeholder={"Username..."} onChange={(e) => setUsername(e.target.value)}/></p>
                        <p>Email: <input type={"email"} value={email} placeholder={"Email..."} onChange={(e) => setEmail(e.target.value)}/></p>

                        { isPasswordMatch ? null : "Passwords don't match" }
                        <p>Password: <input type={"password"} value={password} placeholder={"Password..."} onChange={(e) => setPassword(e.target.value)}/></p>
                        <p>Confirm Password: <input type={"password"} value={confirmPassword} placeholder={"Confirm Password..."} onChange={(e) => setConfirmPassword(e.target.value)}/></p>

                        <button type={"submit"}>CREATE ACCOUNT</button>

                    </form>

                    <p>Already have an account? <Link to='/login'>Login Here</Link></p>

                </div>

            </div>
        </>
    )

}