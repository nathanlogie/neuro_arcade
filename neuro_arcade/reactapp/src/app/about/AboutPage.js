import {Banner, MobileBanner} from "../../components/Banner";
import {NavBar} from "../../components/NavBar";
import styles from "../../styles/App.module.css";
import {motion} from "framer-motion";
import React, {useEffect, useState} from "react";
import {getAboutData} from "../../backendRequests";
import {Description} from "../../components/about/Description";
import {Button} from "../../components/Button";
import {Link} from "react-router-dom";

/**
 * @returns {JSX.Element} about page
 * @constructor builds about page
 */
export function AboutPage() {
    let nav_right = <Button name={"home"} link={"/"} orientation={"right"} direction={"right"} />;

    const [aboutData, updateAboutData] = useState();

    useEffect(() => {
        getAboutData().then((data) => {
            updateAboutData(data);
        });
    }, []);

    let content = <>...</>;
    if (aboutData) {
        let publications = aboutData["publications"].map(function (publication) {
            return (
                <li key={publication.id + 1}>
                    {publication.link ? (
                        <Link to={publication.link}>
                            <label>{publication.title}</label>
                            <label>{publication.author}</label>
                        </Link>
                    ) : (
                        <span>
                            <label>{publication.title}</label>
                            <label>{publication.author}</label>
                        </span>
                    )}
                </li>
            );
        });

        content = (
            <>
                <div className={styles.Content} id={styles["big"]}>
                    <div className={styles.ContentBlock}>
                        <Description description={aboutData.description} />
                    </div>
                </div>
                <div className={styles.Side}>
                    <div className={styles.DataBlock}>
                        <div className={styles.Publications}>
                            <h2>Publications</h2>
                            <main>
                                <li key={0}>
                                    <span>
                                        <div>
                                            <strong>Title</strong>
                                        </div>
                                        <div>
                                            <strong>Author</strong>
                                        </div>
                                    </span>
                                </li>
                                {publications}
                            </main>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Banner size={"big"} right={nav_right} />
            <MobileBanner />
            <NavBar right={nav_right} />
            <motion.div
                className={styles.MainBlock}
                id={styles["big"]}
                initial={{opacity: 0, x: -100}}
                animate={{opacity: 1, x: 0}}
                exit={{opacity: 0, x: -100}}
            >
                {content}
                <div className={styles.MobileBannerBuffer} />
            </motion.div>
        </>
    );
}
