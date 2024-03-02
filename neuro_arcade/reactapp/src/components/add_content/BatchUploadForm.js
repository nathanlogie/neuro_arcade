import React from "react";


export function BatchUploadForm(){
    function onSubmit(e){
        e.preventDefault
    }


    return (
        <form onSubmit={onSubmit}>

            <button type="submit">Submit</button>
        </form>
    );

}