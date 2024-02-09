import styles from '../styles/components/CardGrid.module.css'
import {Card} from "./Card";
import {requestGamesSorted} from "../backendRequests";
import {useEffect, useState} from "react";

/**
 * Checks if a subject's name or description contains a query string
 * The check is case insensitive
 * TODO: this should probably be made more advanced
 *
 * @param {Object} subject - the subject data to test
 * @param {string} textQuery - the string to search for
 *
 * @returns {boolean} true if the filter is passed
 */
function textQueryFilter(subject, textQuery) {
    var text = subject.name.toLowerCase() + subject.description.toLowerCase();
    return text.includes(textQuery.toLowerCase());
}

/**
 * Checks if a subject is tagged with every tag in a query list
 * 
 * @param {Object} subject - the subject data to test
 * @param {string[]} tagQuery - the list of required tag slugs
 * 
 * @returns {boolean} true if the filter is passed
 */
function tagQueryFilter(subject, tagQuery) {
    return tagQuery.every((tag) => subject.tags.includes(tag));
}

/**
 * Checks if a subject should be displayed under a query
 * 
 * @param {Object} subject - the subject data to test
 * @param {string} textQuery - string to search name/description for
 * @param {string[]} tagQuery - required tag slugs
 * 
 * @returns {boolean} true if the filter is passed
 */
function searchFilter(subject, textQuery, tagQuery) {
    return textQueryFilter(subject, textQuery) && tagQueryFilter(subject, tagQuery);
}

/**
 * Component to render a grid of subjects (as subjectCards)
 *
 * @param {Object} props
 * @param {string} props.nameQuery - string subject names/descriptions must contain
 * @param {string[]} props.tagQuery - slugs of tags which subjects must have applied
 * @param {number} props.num - max number of subjects to show
 * @param {string} props.linkPrefix - link prefix passed to Card
 * @param {string} props.id - element id for styling
 */
export function CardGrid({nameQuery='', tagQuery=[], num=0, linkPrefix, id, type}) {
    let [isLoading, setLoading] = useState(true);
    let [subjects, setSubjects] = useState([]);

    // Fetch subjects from server on initial load
    if (type === 'game') {
        useEffect(() => {
            requestGamesSorted()
                .then(g => {
                    setSubjects(g);
                    setLoading(false);
                })
        }, []);
    } else {
        // TODO request players/models
    }

    // Display waiting message while waiting on server, then show subjects
    if (isLoading) {
        return (
            <div className={styles.CardGrid}>
                Loading...
            </div>
        )
    } else {
        // Select subset of names to display
        let shownCards = subjects.filter((subject) => searchFilter(subject, nameQuery, tagQuery));
        if (num > 0) {
            shownCards = shownCards.slice(0, num);
        }

        // Render a card for each selected subject
        return (
            <div className={styles.CardGrid} id={styles[id]}>
                {shownCards.filter((subject) => searchFilter(subject, nameQuery, tagQuery))
                    .map((subject, index) => {
                        return <Card
                            key={index}
                            subject={subject}
                            linkPrefix={linkPrefix}
                        />
                })}
            </div>
        );
    }
}