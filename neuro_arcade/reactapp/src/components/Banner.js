import styles from '../styles/Banner.module.css';

export function Banner({size}) {
    return (
        <div
            className={styles.Banner}
            id={styles[size]}
        />
    );
}