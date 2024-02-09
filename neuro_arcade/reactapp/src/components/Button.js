import { FaArrowRight } from 'react-icons/fa6';
import { FaArrowLeft } from 'react-icons/fa6';
import { FaArrowUp } from 'react-icons/fa6';
import { FaArrowDown } from 'react-icons/fa6';
import styles from '../styles/components/Button.module.css';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import React from 'react';

/**
 * @param id for button positioning
 * @param name for button name
 * @param link for button link
 * @param direction for arrow direction
 * @param orientation for arrow position
 * @returns {JSX.Element} button
 * @constructor builds button
 */
export function Button({ id, name, link, direction, orientation }) {
  if (link !== '') {
    return (
      <motion.div className={styles.Button} id={styles[id]} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Link className={styles.ButtonBlock} id={styles[orientation]} to={link}>
          {name}
        </Link>
        <Link className={styles.Arrow} id={styles[orientation]} to={link}>
          <Arrow direction={direction} />
        </Link>
      </motion.div>
    );
  } else {
    return <div className={styles.Button} id={styles[id]} />;
  }
}

function Arrow({ direction }) {
  if (direction === 'left') {
    return <FaArrowLeft />;
  } else if (direction === 'up') {
    return <FaArrowUp />;
  } else if (direction === 'down') {
    return <FaArrowDown />;
  } else {
    return <FaArrowRight />;
  }
}
