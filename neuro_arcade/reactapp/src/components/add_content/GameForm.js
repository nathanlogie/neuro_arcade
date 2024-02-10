import React, {useState} from "react";
import {useForm} from "react-hook-form";
import axios from 'axios';
import { FaImage } from "react-icons/fa6";
import { LuFileJson } from "react-icons/lu";
import { FaPython } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";

//Should be synced with models.py
let MAX_NAME_LENGTH = 64
let MAX_DESCRIPTION_LENGTH = 1024

let ACCEPTED_SCORE_FILE = ['json']
let ACCEPTED_EVAL_SCRIPT = ['py']
let ACCEPTED_IMAGE = ['png', 'jpg', 'jpeg']

/**
 * @returns {JSX.Element} add new game form
 * @constructor builds add new game form
 */
export function GameForm() {
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
        setError,
        reset,
    } = useForm();

    const [image, setImage] = useState(null)
    const [evaluationScript, setEvaluationScript] = useState(null)
    const [scoreType, setScoreType] = useState(null)
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");
    const [playLink, setPlayLink] = useState("");

    const handleImage = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
        } else {
            setImage(null);
        }
    }

    const handleEvalScript = (event) => {
        const file = event.target.files[0];
        if (file) {
            setEvaluationScript(file);
        } else {
            setEvaluationScript(null);
        }
    }

    const handleScores = (event) => {
        const file = event.target.files[0]
        if (file) {
            setScoreType(file)
        } else {
            setScoreType(null)
        }
    }

    const onSubmit = (event) => {


        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        //Temporary until authentication is fulfilled
        formData.append("owner", "http://localhost:8000/api/users/2/");
        formData.append("play_link", playLink);

        if (image) {
            formData.append("icon", image)
        }
        if (evaluationScript) {
            formData.append("evaluation_script", evaluationScript)
        }
        if (scoreType) {
            formData.append("scoreType", scoreType)
        }


            axios({
            method: "post",
            url: "http://127.0.0.1:8000/api/games/",
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },

        }).then(function (response) {
            console.log(response);
            reset();
            setError("root", {message: "Form submitted successfully"});

        }).catch(function (response) {
            console.log(response)
            if(!response){
                setError("root", {message:"No response from server"});

            }
            else{
                if (response.response.data.includes("IntegrityError")) {
                    setError("root", {message: "A game with that name already exists!"});
                } else {
                    setError("root", {
                        message: `Something went wrong... ${response.response.data}`})
                    }
                }
        });

    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h3>Name</h3>
            <input {...register("name", {
                required: "Name is required",
                maxLength: {
                    value: MAX_NAME_LENGTH,
                    message: `Maximum game title length has been exceeded (${MAX_NAME_LENGTH})`,
                }
            })} type={"text"} placeholder={"Game Name"}
                   onChange={(event) => setName(event.target.value)}
            />
            {errors.name && (
                <div className={"text-red-500"}>{errors.name.message}</div>
            )}


            <h3>Description</h3>
            <input {...register("description", {
                required: "A description is required",
                maxLength: {
                    value: MAX_DESCRIPTION_LENGTH,
                    message: `Maximum description length has been exceeded (${MAX_DESCRIPTION_LENGTH})`,
                }
            })} type={"text"} placeholder={"Game Description"}
                   onChange={(event) => setDescription(event.target.value)}
            />
            {errors.description && (
                <div className={"text-red-500"}>{errors.description.message}</div>
            )}

            <h3>Game Tags</h3>
            <input {...register("tags", {
                required: false
            })} type={"text"} placeholder={"Game Tags"}
                   onChange={(event) => setTags(event.target.value)}
            />

            <h3>Play Link</h3>
            <input {...register("playLink", {
                required: "A Play link must be provided",
                validate: (value) =>{
                    try{
                        let url = new URL(value)
                    } catch(error){
                        return "Invalid URL Provided"
                    }
                    return true
                }
            })} type={"text"} placeholder={"Play Link"} onChange={(event) => setPlayLink(event.target.value)}/>
            {errors.playLink && (
                <div className={"text-red-500"}>{errors.playLink.message}</div>
            )}

            <span>
                <div>
                    <h3>Game Icon</h3>
                    <div>
                        <label htmlFor={'icon'}>
                            <div>
                                <FaImage />
                            </div>
                        </label>
                        <input id={'icon'} {...register("icon", {
                            required: false,
                            validate: (value) => {
                                const acceptedFormats = ACCEPTED_IMAGE;
                                const fileExtension = value[0]?.name.split('.').pop().toLowerCase();
                                if (!acceptedFormats.includes(fileExtension)) {
                                    return "Error: Invalid IMG"
                                }
                                return true;
                            }
                        })} type={"file"} onChange={handleImage}/>
                    </div>
                </div>
                <div>
                    <h3>Score Types</h3>
                    <div>
                        <label htmlFor={'score'}>
                            <div>
                                <LuFileJson />
                            </div>
                        </label>
                        <input id={'score'} {...register("scoreTypes", {
                            required: "Score types must be uploaded",
                            validate: (value) => {
                                const acceptedFormats = ACCEPTED_SCORE_FILE;
                                const fileExtension = value[0]?.name.split('.').pop().toLowerCase();
                                if (!acceptedFormats.includes(fileExtension)) {
                                    return `Error: Invalid file type provided ${fileExtension}`
                                }
                                return true;
                            }
                        })} type={"file"}
                               onChange={handleScores}
                        />
                        {errors.scoreTypes && (
                            <div className={"text-red-500"}>{errors.scoreTypes.message}</div>
                        )}
                    </div>
                </div>
                <div>
                    <h3>Evaluation Script</h3>
                    <div>
                        <label htmlFor={'script'}>
                            <div>
                                <FaPython />
                            </div>
                        </label>
                        <input id={'script'} {...register("evaluationScript", {
                            required: "An Evaluation Script must be uploaded",
                            validate: (value) => {
                                const acceptedFormats = ACCEPTED_EVAL_SCRIPT;
                                const fileExtension = value[0]?.name.split('.').pop().toLowerCase();
                                if (!acceptedFormats.includes(fileExtension)) {
                                    return "Error: Invalid file type provided"
                                }
                                return true;
                            }
                        })} type={"file"}
                               onChange={handleEvalScript}
                        />
                        {errors.evaluationScript && (
                            <div className={"text-red-500"}>{errors.evaluationScript.message}</div>
                        )}
                    </div>
                </div>
            </span>


            <button disabled={isSubmitting} type={"submit"}>
                {isSubmitting ? "Submitting form..." : "add new game"}
                <div>
                    <FaPlus />
                </div>
            </button>
            {errors.root && (
                <div className={"text-red-500"}>{errors.root.message}</div>
            )}
        </form>
    );
}
