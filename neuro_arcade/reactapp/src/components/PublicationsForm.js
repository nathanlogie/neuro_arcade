import { useState } from "react";
import IndividualPublication from "./IndividualPublication";

const PublicationsForm = ({publications}) => {

    console.log("PUBLIC : " + publications)
    let HTMLpublications = publications.map( function(publication){
        return (
            <IndividualPublication publication={publication} />
        )
    })

    const newPublication = () => {
        console.log("ADDING...")
        return (
            <>
                <input type ={"text"} placeholder={"title"} />
                <input type ={"text"} placeholder={"author"} />
                <input type ={"text"} placeholder={"link"} />
            </>
        )
    }

    const addNew = () => {
        newPublication()
    }

    return (
        <>
            { HTMLpublications }
            <p><button onClick={addNew}>+</button></p>
        </>
    )

}

export default PublicationsForm