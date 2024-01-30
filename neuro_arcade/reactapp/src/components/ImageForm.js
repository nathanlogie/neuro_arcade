import { useState } from 'react'
import {postImage} from "../backendRequests";

const ImageForm = ({image}) => {

    const [pic, setPic] = useState(image);
    const [showSave, toggleShowSave] = useState(false)

    const handleChange = (e) => {
        e.preventDefault()
        setPic(URL.createObjectURL(e.target.files[0]))
        toggleShowSave(true)
    }

    const onSave = (e) => {
        e.preventDefault()

        postImage(pic)
        toggleShowSave(false)
    }

    const revertToOriginal = (e) => {
        setPic(image)
        toggleShowSave(false)
    }

    return (
        <div>
            <input type="file" onChange={handleChange} />
            <img src={pic} />

            { showSave ?
                <div>
                    <button onClick={onSave}>SAVE IMAGE</button>
                    <button onClick={revertToOriginal}>CANCEL</button>
                </div>
                : null }
        </div>
    )

}

export default ImageForm