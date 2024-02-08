import {Editor} from "primereact/editor";
import {postDescription} from "../../backendRequests";
import {useState} from "react";
import {Description} from "./Description";

/**
 * @param description from backendRequests.js
 * @returns {JSX.Element} edit about page description form
 * @constructor builds the edit about page description form
 */
export function DescriptionForm ({description}) {

    const [displayTextEdit, setDisplayTextEdit] = useState(false)
    const [newDescription, setNewDescription] = useState(description)
    function update(e) {
        setNewDescription(e.htmlValue)
    }

    function editDescription(e) {

        e.preventDefault()

        setDisplayTextEdit(!displayTextEdit);

    }

    function onSave(e) {
        e.preventDefault()

        postDescription(newDescription)
        setDisplayTextEdit(false)
    }

    function edit() {
        return (
            <>
                <Editor
                name="description"
                value={newDescription}
                style={{ height: '320px' }}
                onTextChange= {update}
                />
                <button onClick={onSave}>Save</button>
            </>
        )
    }

    return (
        <>
            {displayTextEdit ? edit(): <Description description={newDescription} /> }
            <button id = "edit" onClick= {editDescription}>
                {displayTextEdit ? "Cancel": "Edit"}
            </button>
        </>
    )

}
