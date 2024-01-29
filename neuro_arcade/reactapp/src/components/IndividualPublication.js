import { useState } from 'react'

const IndividualPublication = ({publication}) => {

    const [edit, toggleEdit] = useState(false)

    const updateEdit = (e) => {
        e.preventDefault()
        toggleEdit(!edit)
    }
    const HTMLpublication = () => {
        return(
            <>
                <li><a href = {publication.link}>{publication.title} - {publication.author}</a></li>
            </>
        )
    }

    const editPublication = () => {
        return (
            <>
                <input type ={"text"} value={publication.title} />
                <input type ={"text"} value={publication.author} />
                <input type ={"text"} value={publication.link} />
                <button>Save</button>
                <button>Delete</button>
            </>
        )
    }

    return (
        <>
            { edit ? editPublication() : HTMLpublication() }
            <button onClick={updateEdit}>
                { edit ? "Cancel": "Edit"}
            </button>

        </>
    )

}

export default IndividualPublication