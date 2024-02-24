import {Editor} from "primereact/editor";
import {postDescription} from "../../backendRequests";
import React, {useState} from "react";
import {Description} from "./Description";
import {getAboutData} from "../../backendRequests";
import {motion} from "framer-motion";
import {FaBan, FaPencilAlt, FaSave} from "react-icons/fa";

/**
 * @param description from backendRequests.js
 * @returns {JSX.Element} edit about page description form
 * @constructor builds the edit about page description form
 */
export function DescriptionForm ({description}) {

    const [displayTextEdit, setDisplayTextEdit] = useState(false)
    const [newDescription, setNewDescription] = useState(description)
    function update(e) {
        setNewDescription(e.htmlValue)
    }

    function editDescription(e) {
        e.preventDefault()
        getAboutData()
            .then(data => setNewDescription(data.description))
        setDisplayTextEdit(!displayTextEdit);
    }

    function onSave(e) {
        e.preventDefault()

        postDescription(newDescription)
        setDisplayTextEdit(false)
    }

    function edit() {
        return (
            <>
                <Editor
                name="description"
                value={newDescription}
                style={{ height: '320px' }}
                onTextChange= {update}
                />
                <motion.button
                    onClick={onSave}
                    whileHover={{scale: 1.1}}
                    whileTap={{scale: 0.9}}
                >
                    save
                    <div>
                        <FaSave/>
                    </div>
                </motion.button>
            </>
        )
    }

    return (
        <>
            {displayTextEdit ? edit(): <Description description={newDescription} /> }
            <motion.button
                id = {"edit"}
                onClick= {editDescription}
                whileHover={{scale: 1.1}}
                whileTap={{scale: 0.9}}
            >
                {displayTextEdit ? <>
                    cancel
                    <div>
                        <FaBan/>
                    </div>
                </> : <>
                    edit
                    <div>
                        <FaPencilAlt/>
                    </div>
                </>}
            </motion.button>
        </>
    )

}
