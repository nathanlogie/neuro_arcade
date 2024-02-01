import { useState } from "react";
import {postPublications} from "../backendRequests";
import { Message } from 'primereact/message';

export function PublicationsForm ({publications}) {

    const [publicationForms, setPublicationForms] = useState(publications)
    const [publicationsValue, setPublicationsValue] = useState(publications)
    const [editMode, setEditMode] = useState(false)
    const [valid, setValid] = useState(true)

    function handleChange (i, field, newValue) {
        const updated = [...publicationForms]
        updated[i][field] = newValue
        setPublicationForms(updated)
    }

    function regularButtons() {
        return (
            <>
                <button onClick={ () => setEditMode(!editMode) }>EDIT</button>
            </>
        )
    }

    function addFormFields(){
        setPublicationForms([...publicationForms, {title:"", author:"", link: ""}])
    }

    function onSave(e) {
        e.preventDefault()

        const isValid = publicationForms.every(p => p.title !== "" && p.author !== "");

        if (isValid){
            setValid(true)
            setPublicationsValue(publicationForms)
            postPublications(publications)
            setEditMode(!editMode)
        }
        else {
            setValid(false)
        }

    }

    function handleCancel() {
        setPublicationForms(publicationsValue)
        setEditMode(!editMode)
    }

    function editButtons() {
        return (
            <>
                <li><button onClick={addFormFields}>ADD NEW</button></li>
                <li><button onClick={onSave}>SAVE</button></li>
                <li><button onClick={handleCancel}>CANCEL</button></li>
            </>
        )
    }

    function displayPublications(){

        return (
            <>
                {publicationsValue.map((publication, i) => (
                    <li key={i}>{ publication.link ? (<a href={publication.link}>{publication.title} - {publication.author}</a>) : (<>{publication.title} - {publication.author}</>)}</li>
                ))}
            </>
        )

    }

    function removePublication(index){
        let newPublications = [...publicationForms]

        newPublications.splice(index, 1)
        setPublicationForms(newPublications)
    }

    function editPublications() {

        return (
            <>
                { publicationForms.map( (p,i) => (

                    <div key={i}>
                        <li><input type ={"text"} value={p.title} placeholder={"Title..."} onChange={ (e) =>handleChange(i, "title", e.target.value)}/></li>
                        <li><input type ={"text"} value={p.author} placeholder={"Author..."} onChange={ (e) => handleChange(i, "author", e.target.value)}/></li>
                        <li><input type={"url"} value={p.link} placeholder={"Link..."} onChange={ (e) => handleChange(i, "link", e.target.value)}/></li>
                        <button onClick={() => removePublication(i)}>DELETE</button>
                    </div>
                ))}
            </>
        )
    }

    return (
        <>
            { valid ? null : <Message style={{border: 'solid darkred', borderWidth: '1px', color: 'red'}} severity="error" text="Missing Fields" />}
            { editMode ? editPublications() : displayPublications() }
            { editMode ? editButtons() : regularButtons() }
        </>
    )

}