import {requestGameTags} from "../../backendRequests";
import {useEffect, useState} from "react";
import styles from '../../styles/components/GameTagFilter.module.css';

/**
 * Prototype for GameTagFilter.onTagChange callback
 * 
 * @typedef {function} OnTagChange
 * @param {string[]} activeTags - list of currently checked tags' slugs
 */

/**
 * Displays a list of checkboxes for GameTags
 * 
 * @param {Object} props
 * @param {OnTagChange} props.onTagChange - callback for when a tag is checked/unchecked
 * @param {string[]} props.excluded - list of tag slugs to hide from display, currently
 *                                   doesn't support being changed dynamically
*/
export function GameTagFilter({onTagChange, excluded=[], id, onMouseOver, onMouseOut}) {
    let [isLoading, setLoading] = useState(true);
    let [tags, setTags] = useState([]);
    let [ticks, setTicks] = useState([]);

    // Fetch tags from server on initial run
    useEffect(() => {
        requestGameTags()
            .then(tags => {
                setTags(tags.filter((tag) => !excluded.includes(tag.slug)));
                setTicks(new Array(tags.length).fill(false));
                setLoading(false);
            })
    }, []);

    function toggleTick(index) {
        var newTicks = ticks.slice();
        newTicks[index] = !newTicks[index];
        setTicks(newTicks);

        onTagChange(
            tags.filter((tag, index) => newTicks[index])
                .map((tag) => tag.slug)
        );
    }

    // Display waiting message while waiting on server, then show tags
    if (isLoading) {
        return (
            <>
                Loading...
            </>
        )
    } else {
        return (
            <div className={styles.FilterTable} id={styles[id]} onMouseOver={onMouseOver} onMouseOut={onMouseOut}>
                <h2>filters</h2>
                <div className={styles.Tags}>
                    {tags.map((tag, index) => {
                        return <label key={index}>
                            {tag.name}
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
}
