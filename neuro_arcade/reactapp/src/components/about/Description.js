/**
 * @param description from backendRequests.js
 * @returns {JSX.Element} about page description
 * @constructor builds about page description
 */
export function Description ({description}) {
    return (
        <div dangerouslySetInnerHTML={{__html: description}} />
    )
}
