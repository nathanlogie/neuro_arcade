import styles from '../styles/components/Banner.module.css';
import {Button} from "./Button";
import {Logo} from "./Logo";
import React from "react";
import {Switcher} from "./Switcher";
import { useNavigate } from 'react-router-dom';

/**
 * @param size height
 * @param left left component
 * @param right right component
 * @param selected switcher active state parameter
 * @returns {JSX.Element} banner
 * @constructor builds banner
 */
export function Banner({size, left, right, selected}) {

    const switcher_labels = {table_headers: [
            { name: 'Games' },
            { name: 'Players' }
        ],
    };

    const [selectedSwitcherValue, setSelectedSwitcherValue] = React.useState(selected);
    const navigate = useNavigate();

    const handleSwitcherChange = (selectedValue) => {
        setSelectedSwitcherValue(selectedValue);
            if (selectedValue === 'Games') {
                navigate('/all_games');
            }
            if (selectedValue === 'Players') {
                navigate('/all_players');
            }
    }

    if (size === 'big') {
        const banner = [];
        if (left) {
            banner.push(
                <div className={styles.Buffer} key={0}>
                    {left}
                </div>
            );
        } else {
            banner.push(<div className={styles.Buffer} key={0}/>)
        }
        banner.push(<Logo size={size} key={1}/>)
        if (right) {
            banner.push(
                <div className={styles.Buffer} key={2}>
                    {right}
                </div>
            );
        } else {
            banner.push(<div className={styles.Buffer} key={2}/>)
        }
        return (
            <div
                className={styles.Banner}
                id={styles[size]}
            >
                {banner}
            </div>
        );
    } else {
        return (
            <div
                className={styles.Banner}
                id={styles['small']}>
                    <Button
                        name={'back'}
                        link={'../'}
                        direction={'up'}
                        orientation={'left'}
                    />
                    <Logo size={size}/>
                    <div className={styles.TabSwitcher}>
                        <Switcher
                            data={switcher_labels}
                            onSwitcherChange={handleSwitcherChange}
                            switcherDefault={selectedSwitcherValue}
                        />
                    </div>
            </div>
        );
    }
}

/**
 * @returns {JSX.Element} mobile banner
 * @constructor builds mobile banner
 */
export function MobileBanner() {
    return (
            <div
                className={styles.MobileBanner}
                id={styles['small']}
            >
                <Logo size={'small'}/>
            </div>
        );
}
