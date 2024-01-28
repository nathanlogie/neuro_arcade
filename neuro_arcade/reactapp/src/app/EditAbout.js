// import { useState } from 'react';
// import TextEditor from "../components/TextEditor.js"
// import {useFormik} from "formik";
// import aboutData from "./AboutPage.js"
// import {Editor} from "primereact/editor";
//
//
//
//
// // todo: find good json file editor
// // todo: error handling
// export function EditAbout() {
//
//     const [displayTextEdit, setDisplayTextEdit] = useState(false)
//     let tempText = "";
//
//     const editDescription = (e) => {
//         // todo edit description field, submit button for description: edit json data
//         e.preventDefault();
//
//         if (e.target.id === "save"){
//             aboutData.description = tempText
//         }
//
//         setDisplayTextEdit(!displayTextEdit);
//
//
//     }
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
//     return (
//         <>
//
//             <h1>Edit About</h1>
//             <form>
//                 {displayTextEdit ? <TextEditor />: aboutJsonData.description}
//                 <button id = "edit" onClick= {editDescription}>
//                     {displayTextEdit ? "Cancel": "Edit"}
//                 </button>
//                 { TextEditor.status ? editDescription : null}
//
//                 {/*<img src={about.image} alt="neuroarcade image" />*/}
//                 {/*<button onClick={editImage}>Upload new image</button>*/}
//
//                 {/*{ displayPublications() }*/}
//                 {/*<button onClick={addPublication}>Add Publication</button>*/}
//
//             </form>
//         </>
//     );
//
// }