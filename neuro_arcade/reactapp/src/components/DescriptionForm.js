import {Editor} from "primereact/editor";
import {postDescription} from "../backendRequests";
import {useEffect, useState, useRef} from "react";

const DescriptionForm = ({description, toggleDisplay}) => {

    // console.log("IN DESCRIPTION FORM: " + description)
    const [newDescription, setNewDescription] = useState(description)

    // const newDescription = useRef()
    useEffect(() => {
        console.log("IN DESCRIPTION FORM: " + description);
        console.log("NEW DES: " + newDescription);
    }, [description, newDescription]);
    const update = (e) => {
// todo parse the html to json file
        // todo fix bug where request sends null to json data
        if (e.textValue !== ""){
            setNewDescription(e.htmlValue)
        }
        // console.log("NEW DES: " + newDescription)
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