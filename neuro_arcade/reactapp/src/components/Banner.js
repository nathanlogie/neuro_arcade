import styles from '../styles/Banner.module.css';
import {Button} from "./Button";
import {Logo} from "./Logo";

export function Banner({size}) {
    return (
        <div
            className={styles.Banner}
            id={styles[size]}
        >
            <Button
                name={'About'}
                link={'...'}
                direction={'left'}
                orientation={'left'}
            />
            <Logo size={'big'}/>
            <Button
                name={'Add Content'}
                link={'hh'}
                direction={'right'}
                orientation={'right'}
            />
        </div>
    );
}