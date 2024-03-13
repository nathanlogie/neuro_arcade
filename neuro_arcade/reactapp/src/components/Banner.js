import styles from "../styles/components/Banner.module.css";
import {Button} from "./Button";
import {Logo} from "./Logo";
import React from "react";
import {Switcher} from "./Switcher";
import {useNavigate} from "react-router-dom";
import {NavBar} from "./NavBar";

/**
 * @param size height
 * @param left left component
 * @param right right component
 * @param selected switcher active state parameter
 * @returns {JSX.Element} banner
 * @constructor builds banner
 */
export function Banner({size, left, right, selected}) {
    const switcher_labels = {table_headers: [{name: "Games"}, {name: "Players"}]};

    const [selectedSwitcherValue, setSelectedSwitcherValue] = React.useState(selected);
    const navigate = useNavigate();
    let link = "/all-games";
    if (window.location.pathname === "/all-games" || window.location.pathname === "/all-players") {
        link = "/";
    } else if (window.location.pathname.includes("players")) {
        link = "/all-players";
    }
    if (left) {
        link = -1;
    }

    const handleSwitcherChange = (selectedValue) => {
        setSelectedSwitcherValue(selectedValue);
        if (selectedValue === "Games") {
            navigate("/all-games");
        }
        if (selectedValue === "Players") {
            navigate("/all-players");
        }
    };

    if (size === "big") {
        return (
            <div className={styles.Banner} id={styles[size]}>
                <div className={styles.Buffer}>{left}</div>
                <Logo size={size} />
                <div className={styles.Buffer}>{right}</div>
            </div>
        );
    } else {
        return (
            <>
                <div className={styles.Banner} id={styles["small"]}>
                    <div className={styles.Buffer}>
                        <Button name={"back"} link={link} direction={"up"} orientation={"left"} />
                    </div>
                    <Logo size={size} />
                    <div className={styles.Buffer}>
                        <div className={styles.TabSwitcher}>
                            <Switcher
                                data={switcher_labels}
                                onSwitcherChange={handleSwitcherChange}
                                switcherDefault={selectedSwitcherValue}
                            />
                        </div>
                    </div>
                </div>
                <NavBar
                    left={<Button name={"back"} link={link} direction={"up"} orientation={"left"} />}
                    right={
                        <Switcher data={switcher_labels} onSwitcherChange={handleSwitcherChange} switcherDefault={selectedSwitcherValue} />
                    }
                />
            </>
        );
    }
}

/**
 * @returns {JSX.Element} mobile banner
 * @constructor builds mobile banner
 */
export function MobileBanner() {
    return (
        <>
            <div className={styles.MobileBanner} id={styles["small"]}>
                <Logo size={"small"} />
            </div>
        </>
    );
}
