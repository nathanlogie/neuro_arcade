import {requestGameTags} from "../backendRequests";
import {useEffect, useState} from "react";
import styles from '../styles/components/TagFilter.module.css';

export function TagFilter({onTagChange}) {
    let [isLoading, setLoading] = useState(true);
    let [tags, setTags] = useState([]);
    let [ticks, setTicks] = useState([]);

    // Fetch tags from server on initial run
    useEffect(() => {
        requestGameTags()
            .then(tags => {
                setTags(tags);
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
            <div className={styles.FilterTable}>
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
