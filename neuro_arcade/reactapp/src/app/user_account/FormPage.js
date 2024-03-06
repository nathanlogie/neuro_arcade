import {GameForm} from "../../components/add_content/GameForm";
import styles from "../../styles/App.module.css";
import {Banner, MobileBanner} from "../../components/Banner";
import {NavBar} from "../../components/NavBar";
import {motion} from "framer-motion";
import {ModelForm} from "../../components/add_content/ModelForm";
import {ScoreForm} from "../../components/add_content/ScoreForm";
import {Button} from "../../components/Button";
import {useState} from "react";
import {useParams} from "react-router-dom";

/**
 * @returns {JSX.Element} add game page
 * @constructor builds add game page
 */
export function FormPage({type}) {

    let gameSlug = "";

    let nav_left = (
        <Button
            name={'user account'}
            link={'/user_account'} //TODO add user specific page
            orientation={'left'}
            direction={'left'}
        />
    );

    let form;
    if (type === 'game') {
        form = <GameForm/>;
    } else if (type === 'model') {
        form  = <ModelForm/>;
    } else if (type === 'score') {
        form = <ScoreForm/>;
        gameSlug = useParams().game_slug;
        nav_left = (
            <Button
                name={'Back'}
                link={`/all_games/${gameSlug}`}
                orientation={'left'}
                direction={'left'}
            />
        )
    }
    else {
        throw('invalid form type');
    }

    return(
        <>
            <Banner size={'big'} left={nav_left} />
            <MobileBanner/>
            <NavBar left={nav_left} />
            <motion.div
                className={styles.MainBlock}
                id={styles['big']}
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
            >
                <div className={styles.Form}>
                    <h1 className={styles.Header}>Add {type}</h1>
                    {form}
                </div>
            </motion.div>
            <div className={styles.MobileBannerBuffer}/>
        </>
    )
}
