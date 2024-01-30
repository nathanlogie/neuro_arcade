import {Editor} from "primereact/editor";
import {postDescription} from "../backendRequests";
import {useState} from "react";

const DescriptionForm = ({description, toggleDisplay}) => {

    const [newDescription, setNewDescription] = useState(description)
    const update = (e) => {
        if (e.textValue !== ""){
            setNewDescription(e.htmlValue)
        }
    }
    const onSave = (e) => {
        e.preventDefault()

        postDescription(newDescription)
        toggleDisplay(false)
    }

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

export default DescriptionForm