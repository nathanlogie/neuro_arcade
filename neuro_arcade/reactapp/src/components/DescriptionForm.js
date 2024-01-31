import {Editor} from "primereact/editor";
import {postDescription} from "../backendRequests";
import {useState} from "react";
import Description from "./Description";

const DescriptionForm = ({description}) => {

    const [displayTextEdit, setDisplayTextEdit] = useState(false)
    const [newDescription, setNewDescription] = useState(description)
    const update = (e) => {
        if (e.textValue !== ""){
            setNewDescription(e.htmlValue)
        }
    }

    const editDescription = (e) => {

        e.preventDefault()

        setDisplayTextEdit(!displayTextEdit);

    }

    const onSave = (e) => {
        e.preventDefault()

        postDescription(newDescription)
        setDisplayTextEdit(false)
    }

    const edit = () => {
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

export default DescriptionForm