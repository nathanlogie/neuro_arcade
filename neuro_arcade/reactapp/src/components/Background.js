import styles from '../styles/App.module.css';
import overlay from '../static/images/backgroundOverlay.png';
import React from 'react';

/**
 * @returns {JSX.Element} background
 * @constructor builds background
 */
export function Background() {
  return (
    <>
      <img src={overlay} id={styles['hexagon']} alt={''} />
      <div className={styles.Gradient} />
    </>
  );
}
