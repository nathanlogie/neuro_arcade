import {useState, useRef, useEffect} from 'react';
import DescriptionForm from "../components/DescriptionForm"
import {getAboutData} from "../backendRequests";
import {Background} from "../components/Background";
import {Banner, MobileBanner} from "../components/Banner";
import {NavBar} from "../components/NavBar";
import styles from "../styles/App.module.css";
import {motion} from "framer-motion"
import Description from "../components/Description"
import PublicationForm from "../components/PublicationsForm"

// todo: find good json file editor
// todo: error handling
export function EditAbout() {

    const [displayTextEdit, setDisplayTextEdit] = useState(false)
    const [aboutData, updateAboutData] = useState()

    const editDescription = (e) => {

        e.preventDefault()

        setDisplayTextEdit(!displayTextEdit);

    }

    useEffect(() => {
        getAboutData()
            .then(data => {
                updateAboutData(data)
            })
    }, [displayTextEdit])

    if (!aboutData) {
        return (
            <div>
                Loading...
            </div>
        )
    }


//
//
//     const TextEditor = () => {
//
//         //todo pass text into saveinput correctly
//         return (
//             <div>
//                 <Editor
//                     name="description"
//                     value={aboutData.description}
//                     onTextChange={(e) => {
//                         tempText = e.textValue
//                     }}
//                     style={{height: '320px'}}
//                 />
//                 <button id="save" onClick={editDescription}>Save</button>
//             </div>
//         )
//     }
//
//     // const editImage = () => {
//     //     // todo edit image field, just upload image field, submit button: upload file to json file
//     // }
//     //
//     // const addPublication = () => {
//     //     // todo implement new dynamic field
//     // }
//     //
//     // const displayPublications = () => {
//     //
//     //     let showPublications =[]
//     //     about.publications.forEach(function (publication) {
//     //         showPublications.push(
//     //             `<li><a href={publication.link}>publication.title - publication.author</a></li>`
//     //         )
//     //     })
//     //
//     //     // todo add edit and delete button for each publication
//     //
//     //     return showPublications;
//     //
//     // }
//



    return (
        <>

            <Background />
            <Banner size={'big'} button_left={{
                name: '',
                link: '',
            }} button_right={{
                name: '',
                link: '',
            }} />
            <NavBar button_left={{
                name: '',
                link: '',
            }} button_right={{
                name: '',
                link: '',
            }}
            />
            <MobileBanner size={'big'} />
            <motion.div
                className={styles.MainBlock}
                initial={{opacity: 0, x: -100}}
                animate={{opacity: 1, x: 0}}
                exit={{opacity: 0, x: -100}}
            >
                <div className={styles.Content}>
                    <h1>Edit About</h1>
                    <div className={styles.ContentBlock}>
                        {displayTextEdit ? <DescriptionForm description ={aboutData.description} toggleDisplay={setDisplayTextEdit} />: <Description description={aboutData.description} /> }
                        <button id = "edit" onClick= {editDescription}>
                            {displayTextEdit ? "Cancel": "Edit"}
                        </button>

                        <p><PublicationForm publications={aboutData.publications}/></p>
                    </div>
                </div>
            </motion.div>

        </>
    );

}

export default EditAbout