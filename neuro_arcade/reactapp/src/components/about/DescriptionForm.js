import {Editor} from "primereact/editor";
import {postDescription} from "../../backendRequests";
import React, {useState} from "react";
import {Description} from "./Description";
import {getAboutData} from "../../backendRequests";
import {motion} from "framer-motion";
import {FaBan, FaPencilAlt, FaSave} from "react-icons/fa";
import {PrimeReactProvider} from "primereact/api";
import styles from '../../styles/App.module.css';

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
                pt={{
                    toolbar: {className: styles.Toolbar},
                    content: { style: {
                            border: 'none',
                            borderRadius: '0 0 0.5em 0.5em',
                            backgroundColor: 'rgba(3, 3, 3, 0.4)',
                            backdropFilter: 'blur(20px)',
                            fontFamily: 'inherit',
                            padding: '2em',
                            height: '50em',
                            position: 'relative'
                    }}
                }}
                onTextChange= {update}
                />
            </>
        )
    }

    return (
        <>
            {displayTextEdit ? edit() : <Description description={newDescription}/>}
            <motion.button
                id={styles['edit']}
                onClick={editDescription}
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
                </>
                }
            </motion.button>
            {displayTextEdit ?
                <motion.button
                    onClick={onSave}
                    whileHover={{scale: 1.1}}
                    whileTap={{scale: 0.9}}
                    id={styles['save']}
                >
                    save
                    <div>
                        <FaSave/>
                    </div>
                </motion.button> : <></>
            }
        </>
    )

}
