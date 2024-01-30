import {requestGameTags} from "../backendRequests";
import {useEffect, useState} from "react";

export function TagFilter({onTagChange, excluded=[]}) {
    let [isLoading, setLoading] = useState(true);
    let [tags, setTags] = useState([]);
    let [ticks, setTicks] = useState([]);

    // Fetch tags from server on initial run
    useEffect(() => {
        requestGameTags()
            .then(tags => {
                // TODO: exclude dynamically instead of at request to support
                // param change
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
            <div>
                Loading...
            </div>
        )
    } else {
        return (
            <div>
                {tags.map((tag, index) => {
                    return <label key={index}>
                        <input
                            type='checkbox'
                            checked={ticks[index]}
                            onChange={(e) => toggleTick(index)}
                        />

                        {tag.name}
                    </label>
                })}
            </div>
        );
    }
}
