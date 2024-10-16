import {Banner} from "../../components/Banner";
import styles from "../../styles/App.module.css";
import {NavBar} from "../../components/NavBar";
import {MobileBanner} from "../../components/Banner";
import {Card} from "../../components/Card";
import {FaGamepad} from "react-icons/fa6";
import {TbBoxModel} from "react-icons/tb";
import {motion} from "framer-motion";
import {Button} from "../../components/Button";
import {Link, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {API_ROOT, getGamesFromCurrentUser, getPlayersFromCurrentUser, logout, MEDIA_ROOT} from "../../backendRequests";
import {getUser} from "../../backendRequests";
import {userIsAdmin} from "../../backendRequests";
import {IoExit} from "react-icons/io5";
import placeholder from "../../static/images/placeholder.webp";
import {CardGrid} from "../../components/CardGrid";

/**
 * @returns {JSX.Element} add content page
 * @constructor builds add content page
 */
export function AccountPage() {
    const navigate = useNavigate();
    function onLogout(e) {
        e.preventDefault();
        logout();
        navigate("/");
    }

    let nav_left = <Button name={"home"} link={"/"} orientation={"left"} direction={"left"} />;

    const user = getUser();
    const [userContent, setUserContent] = useState(<p>not a registered player</p>);
    const [modelGrid, setModelGrid] = useState(<p>no registered models</p>);
    const [gameGrid, setGameGrid] = useState(<p>no registered games</p>);

    const pendingUser = (
        <div>
            Your account is still pending. <br /> Once an admin approves you can post models and games.
        </div>
    );
    const regularContent = (
        <div className={styles.AddContent}>
            <div className={styles.FormMenu}>
                <Card link={"/add-game"} text={"New Game"} icon={<FaGamepad />} />
                <Card link={"/add-model"} text={"New Model"} icon={<TbBoxModel />} />
            </div>
            {user && userIsAdmin() ? <Button name={"all users"} link={"all-users"} orientation={"right"} direction={"down"} /> : null}
        </div>
    );

    useEffect(() => {
        getPlayersFromCurrentUser()
            .then((m) => {
                let models = [];
                let player;
                m.data.map((model) => {
                    if (!model.is_ai) {
                        player = model;
                    } else {
                        models.push(model);
                    }
                });
                if (player) {
                    let icon = <img src={placeholder} alt={"icon"} />;
                    if (player.icon) {
                        icon = <img src={MEDIA_ROOT + player.icon} alt={"image"} />;
                    }
                    setUserContent(
                        <div className={styles.ContentBlock} id={styles["vertical"]}>
                            <p>
                                {icon}
                                {player.description}
                            </p>
                            <Button name={"view page"} link={"/all-players/" + player.slug} orientation={"right"} direction={"right"} />
                        </div>
                    );
                }
                if (models.length > 0) {
                    setModelGrid(<CardGrid subjects={models} linkPrefix={"/all-players/"} />);
                }
            })
            .catch(() => {});
        getGamesFromCurrentUser()
            .then((g) => {
                let games = [];
                g.data.map((game) => games.push(game));
                if (games.length > 0)
                    setGameGrid(<CardGrid subjects={games} linkPrefix={"/all-games/"} />);
            })
            .catch(() => {});
    }, []);

    return (
        <>
            <Banner size={"big"} left={nav_left} />
            <MobileBanner />
            <NavBar left={nav_left} />
            <motion.div
                className={styles.MainBlock}
                id={styles["big"]}
                initial={{opacity: 0, x: 100}}
                animate={{opacity: 1, x: 0}}
                exit={{opacity: 0, x: 100}}
            >
                <div className={styles.Content} id={styles["small"]}>
                    <div className={styles.Title}>
                        <h1>{user.name}</h1>
                    </div>
                    {userContent}
                    <div className={styles.Title}>
                        <h1>Registered models</h1>
                    </div>
                    {modelGrid}
                    <div className={styles.Title}>
                        <h1>Registered games</h1>
                    </div>
                    {gameGrid}
                    <div className={styles.ContentBlock} id={styles["vertical"]}>
                        <p>
                            Contact <Link to='mailto:benjamin.peters@glasgow.ac.uk'>benjamin.peters@glasgow.ac.uk</Link> for account
                            removal.
                        </p>
                        <motion.button onClick={onLogout} whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} id={styles["logout"]}>
                            log out
                            <div>
                                <IoExit />
                            </div>
                        </motion.button>
                    </div>
                </div>
                <div className={styles.Side} id={styles["addContent"]}>
                    <div className={styles.Title}>
                        <h1>Add Content</h1>
                    </div>
                    <div className={styles.ContentBlock}>{user.status === "pending" ? pendingUser : regularContent}</div>
                </div>
                <div className={styles.MobileBannerBuffer} />
            </motion.div>
        </>
    );
}
