import styles from '../../styles/components/CardGrid.module.css'
import {Card} from "./Card";

/**
 * Type of item in a GridSubject's tag array.
 * Typically a primary key
 *
 * @typedef {any} SubjectTag
 */

/**
 * Interface for objects displayable in a CardGrid
 *
 * @typedef {Object} GridSubject
 * @property {string} name
 * @property {string} description
 * @property {SubjectTag[]} tags
 */

/**
 * Checks if a subject's name or description contains a query string
 * The check is case insensitive
 * TODO: this should probably be made more advanced
 *
 * @param {GridSubject} subject - the subject data to test
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
 * @param {GridSubject} subject - the subject data to test
 * @param {SubjectTag[]} tagQuery - the list of required tags
 * 
 * @returns {boolean} true if the filter is passed
 */
function tagQueryFilter(subject, tagQuery) {
    return tagQuery.every((tag) => subject.tags.includes(tag));
}

/**
 * Checks if a subject should be displayed under a query
 * 
 * @param {GridSubject} subject - the subject data to test
 * @param {string} textQuery - string to search name/description for
 * @param {SubjectTag[]} tagQuery - required tags
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
 * @param {GridSubject[]} props.subjects - subjects to display
 * @param {string} props.textQuery - string subject names/descriptions must contain
 * @param {SubjectTag[]} props.tagQuery - tags which subjects must have applied
 * @param {number} props.num - max number of subjects to show
 * @param {string} props.linkPrefix - link prefix passed to Card
 * @param {string} props.id - element id for styling
 */
export function CardGrid({subjects, textQuery='', tagQuery=[], num=0, linkPrefix, id}) {
    // Select subset of names to display
    let shownCards = subjects.filter((subject) => searchFilter(subject, textQuery, tagQuery));
    if (num > 0) {
        shownCards = shownCards.slice(0, num);
    }

    // Render a card for each selected subject
    return (
        <div className={styles.CardGrid} id={styles[id]}>
            {shownCards.filter((subject) => searchFilter(subject, textQuery, tagQuery))
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

export const exportedForTesting = {
    textQueryFilter,
    tagQueryFilter,
    searchFilter,
};
