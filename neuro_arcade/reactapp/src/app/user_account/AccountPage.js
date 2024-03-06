import {Banner} from "../../components/Banner";
import styles from '../../styles/App.module.css';
import {NavBar} from "../../components/NavBar";
import {MobileBanner} from "../../components/Banner";
import {Card} from '../../components/Card';
import { FaGamepad } from "react-icons/fa6";
import { TbBoxModel } from "react-icons/tb";
import {motion} from "framer-motion";
import {Button} from "../../components/Button";
import {Link, useNavigate} from "react-router-dom";
import React, {useState} from "react";
import {API_ROOT, getHumanPlayerFromCurrentUser, logout} from "../../backendRequests";
import {getUser} from "../../backendRequests";
import {userIsAdmin} from "../../backendRequests";
import {FaRegUserCircle, FaSave} from "react-icons/fa";
import { IoExit } from "react-icons/io5";
import placeholder from "../../static/images/placeholder.webp";


/**
 * @returns {JSX.Element} add content page
 * @constructor builds add content page
 */
export function AccountPage() {

    const navigate = useNavigate();
    function onLogout(e) {
        e.preventDefault();
        logout();
        navigate('/');
    }

    let nav_left = (
        <Button
            name={'home'}
            link={'/'}
            orientation={'left'}
            direction={'left'}
        />
    );


    const [user, setUser] = useState(getUser());
    const [userContent, setUserContent] = useState();

    const pendingUser = <div>Your account is still pending. <br /> Once an admin approves you can post models and games.</div>
    const regularContent =
        <div className={styles.AddContent}>
            <div className={styles.FormMenu}>
                <Card link={'/add_game'} text={'New Game'} icon={<FaGamepad/>}/>
                <Card link={'/add_model'} text={'New Model'} icon={<TbBoxModel/>}/>
            </div>
            {user && userIsAdmin() ?
                <Button name={'all users'} link={'all_users'} orientation={'right'} direction={'down'}/> : null}
        </div>

    getHumanPlayerFromCurrentUser().then(p => {
        let icon = <img src={placeholder} alt="icon"/>;
        if (p.data.icon) {
            icon = <img src={API_ROOT + p.data.icon} alt={'image'}/>;
        }
         setUserContent(
             <p>
                 {icon}
                 {p.data.description}
             </p>
         );
    }).catch(() => {
    });


    return (
        <>
        <Banner size={'big'} left={nav_left}/>
            <MobileBanner/>
            <NavBar left={nav_left}/>
            <motion.div
                className={styles.MainBlock}
                id={styles['big']}
                initial={{opacity: 0, x: 100}}
                animate={{opacity: 1, x: 0}}
                exit={{opacity: 0, x: 100}}
            >
                <div className={styles.Content} id={styles['small']}>
                    <div className={styles.ContentBlock}>
                        {userContent}
                        <div>Contact <Link to="mailto:benjamin.peters@glasgow.ac.uk">benjamin.peters@glasgow.ac.uk</Link> for account removal</div>
                        <motion.button
                            onClick={onLogout}
                            whileHover={{scale: 1.1}}
                            whileTap={{scale: 0.9}}
                            id={styles['logout']}
                        >
                            log out
                            <div>
                                <IoExit/>
                            </div>
                        </motion.button>
                    </div>
                </div>
                <div className={styles.Side}>
                    <div className={styles.Title}>
                        <h1>Add Content</h1>
                    </div>
                    <div className={styles.ContentBlock}>
                        {user.status === "pending" ? pendingUser : regularContent}
                    </div>
                </div>
            </motion.div>
            <div className={styles.MobileBannerBuffer}/>
        </>
    );
}
