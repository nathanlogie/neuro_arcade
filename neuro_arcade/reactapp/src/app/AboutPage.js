import {Background} from "../components/Background";
import {Banner, MobileBanner} from "../components/Banner";
import {NavBar} from "../components/NavBar";
import styles from "../styles/App.module.css";
import {motion} from "framer-motion"
import { EditAbout } from "./EditAbout"

export function AboutPage( ) {
    return (
        <div>
            <Background />
            <Banner size={'big'} button_left={{
                name: 'edit about',
                link: '/edit_about',
                orientation: 'left',
                direction: 'left'
            }} button_right={{
                name: 'home',
                link: '/',
                orientation: 'right',
                direction: 'right'
            }} />
            <NavBar button_left={{
                name: 'edit about',
                link: '/edit_about',
                orientation: 'left',
                direction: 'left'
            }} button_right={{
                name: 'home',
                link: '/',
                orientation: 'right',
                direction: 'right'
            }}
            />
            <MobileBanner size={'big'} />
            <motion.div
                className={styles.MainBlock}
                initial={{opacity: 0, x: -100}}
                animate={{opacity: 1, x: 0}}
                exit={{opacity: 0, x: -100}}
            >
                <div className={styles.Content}>
                    <h1>About</h1>
                    <div className={styles.ContentBlock}>
                        <img src="https://loremflickr.com/300/300"  alt={'image'} // TODO add query for image here
                        />
                        <p>
                            Artificial intelligence (AI) research and human cognitive neuroscience have shared interests: AI researchers want to create AI models with human-like capabilities. Cognitive scientists want to use AI models to understand the brain computations that give rise to the human experience.In order for both fields to join forces, they need to engage and compare humans and AI models on the same set of tasks. We have developed a framework and toolbox that enables researchers to develop games (i.e., tasks) that both humans and AI models can engage with and where we can directly compare them. Our team is focusing on dynamic object vision games (e.g., "chasing and tracking visual objects"), which can be played on smartphones, in the web browser, and on lab computers in the cognitive neuroscience lab. The idea and the project, however, generalizes to all kinds of games.The proposed project will develop a platform that directly compares model and human behavior on these games, and showcases the outcome of the comparison to cognitive scientists, AI modelers, and the general public in a web app. A user will be able see and play the games on the web app. The user will also be able to see leaderboards of players (players can be models or humans) competing against each other. And the user can see how human-like particular AI models behave on these games on different kinds of metrics.The goal of the project is to develop a prototype that can be showcased to cognitive science and AI labs and can be potentially scaled up with demand, when more and more labs will join and use the platform.
                        </p>
                    </div>
                </div>
                <div className={styles.Side}></div>
            </motion.div>
            <div className={styles.MobileBannerBuffer} />
        </div>
    );
}