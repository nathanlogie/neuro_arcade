import {Editor} from "primereact/editor";
import {postDescription} from "../backendRequests";
import {useEffect, useState} from "react";

const DescriptionForm = ({description, toggleDisplay}) => {

    const [newDescription, setNewDescription] = useState(description)

    useEffect(() => {
        console.log("IN DESCRIPTION FORM: " + description);
        console.log("NEW DES: " + newDescription);
    }, [description, newDescription]);
    const update = (e) => {
        if (e.textValue !== ""){
            setNewDescription(e.htmlValue)
        }
    }
    const onSave = (e) => {
        e.preventDefault()

        console.log("DESCRIPTION RIGHT BEFORE CALLING POST: " + typeof(newDescription))
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