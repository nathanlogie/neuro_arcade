import React, {useState} from "react";
import {postPublications} from "../../backendRequests";
import {Message} from "primereact/message";
import {getAboutData} from "../../backendRequests";
import {Link} from "react-router-dom";
import {motion} from "framer-motion";
import {FaBan, FaPencilAlt, FaSave} from "react-icons/fa";
import {FaPlus, FaTrash} from "react-icons/fa6";

/**
 * @param publications from backendRequests.js
 * @returns {JSX.Element} edit about page publications table
 * @constructor builds the edit about page publications table
 */
export function PublicationsForm({publications}) {
    // dynamic publications = publications which are dynamically being changed, after every change
    const [dynamicPublications, setDynamicPublications] = useState(publications);
    const [editMode, setEditMode] = useState(false);
    const [valid, setValid] = useState(true);

    function handleChange(i, field, newValue) {
        const updated = [...dynamicPublications];
        updated[i][field] = newValue;
        setDynamicPublications(updated);
    }

    function regularButtons() {
        return (
            <li>
                <motion.button onClick={() => setEditMode(!editMode)} whileHover={{scale: 1.1}} whileTap={{scale: 0.9}}>
                    edit
                    <div>
                        <FaPencilAlt />
                    </div>
                </motion.button>
            </li>
        );
    }

    function addFormFields(e) {
        e.preventDefault();
        setDynamicPublications([...dynamicPublications, {title: "", author: "", link: ""}]);
    }

    async function onSave(e) {
        e.preventDefault();

        const isValid = dynamicPublications.every((p) => p.title !== "" && p.author !== "");

        if (isValid) {
            setValid(true);
            await postPublications(dynamicPublications);
            setEditMode(!editMode);
        } else {
            setValid(false);
        }
    }

    function handleCancel(e) {
        e.preventDefault();
        getAboutData().then((data) => setDynamicPublications(data.publications));
        setEditMode(!editMode);
    }

    function editButtons() {
        return (
            <>
                <li>
                    <motion.button onClick={addFormFields} whileHover={{scale: 1.1}} whileTap={{scale: 0.9}}>
                        add new
                        <div>
                            <FaPlus />
                        </div>
                    </motion.button>
                </li>
                <li>
                    <li>
                        <motion.button onClick={handleCancel} whileHover={{scale: 1.1}} whileTap={{scale: 0.9}}>
                            cancel
                            <div>
                                <FaBan />
                            </div>
                        </motion.button>
                    </li>
                    <li>
                        <motion.button onClick={onSave} whileHover={{scale: 1.1}} whileTap={{scale: 0.9}}>
                            save
                            <div>
                                <FaSave />
                            </div>
                        </motion.button>
                    </li>
                </li>
            </>
        );
    }

    function displayPublications() {
        return (
            <>
                <h2>Publications</h2>
                <main>
                    <li key={0}>
                        <span>
                            <div>
                                <strong>Title</strong>
                            </div>
                            <div>
                                <strong>Author</strong>
                            </div>
                        </span>
                    </li>
                    {dynamicPublications.map((publication, i) => (
                        <li key={i + 1}>
                            {" "}
                            {publication.link ? (
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
                </main>
            </>
        );
    }

    function removePublication(index) {
        let newPublications = [...dynamicPublications];
        newPublications.splice(index, 1);
        setDynamicPublications(newPublications);
    }

    function editPublications() {
        return (
            <>
                <h2>Publications</h2>
                <main>
                    {dynamicPublications.map((p, i) => (
                        <span key={i}>
                            <section>
                                <label>
                                    <input
                                        type={"text"}
                                        value={p.title}
                                        placeholder={"Title..."}
                                        onChange={(e) => handleChange(i, "title", e.target.value)}
                                    />
                                </label>
                                <label>
                                    <input
                                        type={"text"}
                                        value={p.author}
                                        placeholder={"Author..."}
                                        onChange={(e) => handleChange(i, "author", e.target.value)}
                                    />
                                </label>
                                <label>
                                    <input
                                        type={"url"}
                                        value={p.link}
                                        placeholder={"Link..."}
                                        onChange={(e) => handleChange(i, "link", e.target.value)}
                                    />
                                </label>
                            </section>
                            <motion.button onClick={() => removePublication(i)} whileHover={{scale: 1.1}} whileTap={{scale: 0.9}}>
                                <div>
                                    <FaTrash />
                                </div>
                            </motion.button>
                        </span>
                    ))}
                </main>
            </>
        );
    }

    return (
        <>
            {valid ? null : <Message severity='error' text='Missing Fields' />}
            {editMode ? editPublications() : displayPublications()}
            {editMode ? editButtons() : regularButtons()}
        </>
    );
}
