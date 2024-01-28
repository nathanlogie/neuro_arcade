// import { useState, useRef } from 'react';
// import TextEditor from "../components/TextEditor.js"
// import {postDescription} from "../backendRequests";
//
// // todo: find good json file editor
// // todo: error handling
// export function EditAbout() {
//
//     const [displayTextEdit, setDisplayTextEdit] = useState(false)
//     const description = useRef(aboutData.description);
//
//
//     const editDescription = (e) => {
//         // todo edit description field, submit button for description: edit json data
//         if (e.target.id === "edit"){
//             e.preventDefault();
//         }
//
//         setDisplayTextEdit(!displayTextEdit);
//
//     }
//
// //
// //
// //     const TextEditor = () => {
// //
// //         //todo pass text into saveinput correctly
// //         return (
// //             <div>
// //                 <Editor
// //                     name="description"
// //                     value={aboutData.description}
// //                     onTextChange={(e) => {
// //                         tempText = e.textValue
// //                     }}
// //                     style={{height: '320px'}}
// //                 />
// //                 <button id="save" onClick={editDescription}>Save</button>
// //             </div>
// //         )
// //     }
// //
// //     // const editImage = () => {
// //     //     // todo edit image field, just upload image field, submit button: upload file to json file
// //     // }
// //     //
// //     // const addPublication = () => {
// //     //     // todo implement new dynamic field
// //     // }
// //     //
// //     // const displayPublications = () => {
// //     //
// //     //     let showPublications =[]
// //     //     about.publications.forEach(function (publication) {
// //     //         showPublications.push(
// //     //             `<li><a href={publication.link}>publication.title - publication.author</a></li>`
// //     //         )
// //     //     })
// //     //
// //     //     // todo add edit and delete button for each publication
// //     //
// //     //     return showPublications;
// //     //
// //     // }
// //
//
//     console.log("REFERENCE: " + description.current)
//     return (
//         <>
//
//             <h1>Edit About</h1>
//
//             {displayTextEdit ? <TextEditor onSave={editDescription} />: aboutData.description}
//             <button id = "edit" onClick= {editDescription}>
//                 {displayTextEdit ? "Cancel": "Edit"}
//             </button>
//
//         </>
//     );
//
// }
//
// export default EditAbout