import { useState } from "react";
import {postPublications} from "../../backendRequests";
import { Message } from 'primereact/message';
import {getAboutData} from "../../backendRequests";
import styles from "../../styles/components/Button.module.css";
import {Link} from "react-router-dom";

/**
 * @param publications from backendRequests.js
 * @returns {JSX.Element} edit about page publications table
 * @constructor builds the edit about page publications table
 */
export function PublicationsForm ({publications}) {

    // dynamic publications = publications which are dynamically being changed, after every change
    const [dynamicPublications, setDynamicPublications] = useState(publications)
    const [editMode, setEditMode] = useState(false)
    const [valid, setValid] = useState(true)

    function handleChange (i, field, newValue) {
        const updated = [...dynamicPublications]
        updated[i][field] = newValue
        setDynamicPublications(updated)
    }

    function regularButtons() {
        return (
            <>
                <button onClick={ () => setEditMode(!editMode) }>EDIT</button>
            </>
        )
    }

    function addFormFields(e){
        e.preventDefault()
        setDynamicPublications([...dynamicPublications, {title:"", author:"", link: ""}])
    }

    async function onSave(e) {
        e.preventDefault()

        const isValid = dynamicPublications.every(p => p.title !== "" && p.author !== "");

        if (isValid) {
            setValid(true)
            await postPublications(dynamicPublications)
            setEditMode(!editMode)

        } else {
            setValid(false)
        }

    }

    function handleCancel(e) {
        e.preventDefault()
        getAboutData()
            .then(data => setDynamicPublications(data.publications))
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
                <h2>Publications</h2>
                <div>
                    <li key={0}>
                        <span>
                            <div><strong>Title</strong></div>
                            <div><strong>Author</strong></div>
                        </span>
                    </li>
                    {dynamicPublications.map((publication, i) => (
                        <li key={i + 1}> {publication.link ?
                            (
                                <Link to={publication.link}>
                                        <label>{publication.title}</label>
                                        <label>{publication.author}</label>
                                    </Link>
                            ) : (
                                <span>
                                    <label>{publication.title}</label>
                                    <label>{publication.author}</label>
                                </span>
                            )}
                        </li>
                    ))}
                </div>
            </>
        )

    }

    function removePublication(index){
        let newPublications = [...dynamicPublications]
        newPublications.splice(index, 1)
        setDynamicPublications(newPublications)
    }

    function editPublications() {

        return (
            <>
                { dynamicPublications.map( (p,i) => (

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
            { valid ? null : <Message severity="error" text="Missing Fields" />}
            { editMode ? editPublications() : displayPublications() }
            { editMode ? editButtons() : regularButtons() }
        </>
    )

}
