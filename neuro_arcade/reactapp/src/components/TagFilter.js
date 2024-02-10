import {requestGameTags, requestPlayerTags} from "../backendRequests";
import {useEffect, useState} from "react";
import styles from '../styles/components/TagFilter.module.css';

/**
 * Prototype for TagFilter.onTagChange callback
 * 
 * @typedef {function} OnTagChange
 * @param {boolean[]} ticks - whether each index is checked or not
 */

/**
 * Displays a list of checkboxes for GameTags
 * 
 * @param {Object} props
 * @param {OnTagChange} props.onTagChange - callback for when a tag is checked/unchecked
 * @param {string[]} props.tags - list of tag names
*/
export function TagFilter({onTagChange, tags, id, onMouseOver, onMouseOut}) {
    let [ticks, setTicks] = useState([]);

    // Untick all tags initially
    useEffect(() => {
        var newTicks = tags.map(() => false);
        setTicks(newTicks);
        onTagChange(newTicks);
    }, [...tags]);

    // Update tick array on checkbox click
    function toggleTick(index) {
        // Avoid mutating old list
        var newTicks = ticks.slice();
        newTicks[index] = !newTicks[index];
        setTicks(newTicks);

        // Notify parent of new selected tags
        onTagChange(newTicks);
    }

    return (
        <div className={styles.FilterTable} id={styles[id]} onMouseOver={onMouseOver} onMouseOut={onMouseOut}>
            <h2>filters</h2>
            <div className={styles.Tags}>
                {tags.map((tag, index) => {
                    return <label key={index}>
                        {tag}
                        <input
                            type='checkbox'
                            checked={ticks[index]}
                            onChange={(e) => toggleTick(index)}
                        />
                    </label>
                })}
            </div>
        </div>
    );
}
