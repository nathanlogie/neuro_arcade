import { useState } from "react";
import {postPublications} from "../backendRequests";

const PublicationsForm = ({publications}) => {

    const [publicationForms, setPublicationForms] = useState(publications)
    const [publicationsValue, setPublicationsValue] = useState(publications)
    const [edit, toggleEdit] = useState(false)

    const handleChange = (i, field, newValue) => {
        const updated = [...publicationForms]
        updated[i][field] = newValue
        setPublicationForms(updated)
    }

    const regularButtons = () => {
        return (
            <>
                <button onClick={ () => toggleEdit(!edit) }>EDIT</button>
            </>
        )
    }

    let addFormFields = () => {
        setPublicationForms([...publicationForms, {title:"", author:"", link: ""}])
    }

    const onSave = (e) => {
        e.preventDefault()

        publications = []
        publicationForms.forEach( (p) => {
            console.log("PUBLICATIONS: \nTitle: " + p.title + "\tAuthor: " + p.author + "\tLink: " + p.link )
            if (p.title!=="" && p.author!==""){
                publications.push(p)
            }
        })
        console.log(publications.length)
        setPublicationsValue(publications)
        postPublications(publications)
        toggleEdit(!edit)
    }

    const handleCancel = () => {
        setPublicationForms(publicationsValue)
        toggleEdit(!edit)
    }

    const editButtons = () => {
        return (
            <>
                <li><button onClick={addFormFields}>ADD NEW</button></li>
                <li><button onClick={onSave}>SAVE</button></li>
                <li><button onClick={handleCancel}>CANCEL</button></li>
            </>
        )
    }

    const HTMLpublications = () => {

        console.log("THE NUM OF PUBLICATIONS:" + publications.length)

        return (
            <>
                {publicationsValue.map((publication, i) => (
                    <li key={i}>{ publication.link ? (<a href={publication.link}>{publication.title} - {publication.author}</a>) : (<>{publication.title} - {publication.author}</>)}</li>
                ) ) }
            </>
        )

    }

    // todo delete functionality
    const removePublication = (index) => {
        let newPublications = [...publicationForms]
        newPublications.splice(index, 1)
        setPublicationForms(newPublications)
    }

    const editPublications = () => {

        return (
            <>
                { publicationForms.map( (p,i) => (
                    <div key={i}>
                        <li><input type ={"text"} value={p.title} placeholder={"Title..."} onChange={ (e) =>handleChange(i, "title", e.target.value)}/></li>
                        <li><input type ={"text"} value={p.author} placeholder={"Author..."} onChange={ (e) => handleChange(i, "author", e.target.value)}/></li>
                        <li><input type={"url"} value={p.link} placeholder={"Link..."} onChange={ (e) => handleChange(i, "link", e.target.value)}/></li>
                        <button onClick={removePublication}>DELETE</button>
                    </div>
                ) ) }
            </>
        )

    }

    return (
        <div>

            { edit ? editPublications() : HTMLpublications() }
            { edit ? editButtons() : regularButtons() }

        </div>
    )

}

export default PublicationsForm