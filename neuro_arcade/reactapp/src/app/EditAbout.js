import aboutJsonData from "../media/about.json"

// npm install primereact
// npm install quill
import { Editor } from 'primereact/editor';

// npm install --save formik


import { useState } from 'react';
import TextEditor from "../components/TextEditor.js"
import formik from "../components/TextEditor.js"
import {useFormik} from "formik";



// todo: find good json file editor
// todo: error handling
export function EditAbout() {

    const [displayTextEdit, setDisplayTextEdit] = useState(false)

    const formik = useFormik({
        initialValues: aboutJsonData,
    });

    const editDescription = (e) => {
        // todo edit description field, submit button for description: edit json data
        e.preventDefault();

        // console.log(formik.values.description.length)
        console.log("Description type: ~~~~~~~~" + typeof(formik.values.description))

        if (e.target.id === "save"){
            aboutJsonData.description = formik.values.description
        }
        setDisplayTextEdit(!displayTextEdit);


    }

    // const editImage = () => {
    //     // todo edit image field, just upload image field, submit button: upload file to json file
    // }
    //
    // const addPublication = () => {
    //     // todo implement new dynamic field
    // }
    //
    // const displayPublications = () => {
    //
    //     let showPublications =[]
    //     about.publications.forEach(function (publication) {
    //         showPublications.push(
    //             `<li><a href={publication.link}>publication.title - publication.author</a></li>`
    //         )
    //     })
    //
    //     // todo add edit and delete button for each publication
    //
    //     return showPublications;
    //
    // }

    return (
        <>

            <h1>Edit About</h1>
            <form>
                {displayTextEdit ? <TextEditor f ={formik} />: aboutJsonData.description}
                <button id = "save" onClick={editDescription}>Save</button>
                <button id = "edit" onClick= {editDescription}>
                    {displayTextEdit ? "Cancel": "Edit"}
                </button>
                { TextEditor.status ? editDescription : null}

                {/*<img src={about.image} alt="neuroarcade image" />*/}
                {/*<button onClick={editImage}>Upload new image</button>*/}

                {/*{ displayPublications() }*/}
                {/*<button onClick={addPublication}>Add Publication</button>*/}

            </form>
        </>
    );

}