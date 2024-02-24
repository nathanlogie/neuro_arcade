import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import axios from 'axios';
import {FaImage} from "react-icons/fa6";
import {LuFileJson} from "react-icons/lu";
import {FaPython} from "react-icons/fa6";
import {FaPlus} from "react-icons/fa6";
import {motion} from "framer-motion";
import CreatableSelect from 'react-select/creatable';
import {requestGameTags} from "../../backendRequests";
import slugify from 'react-slugify';
import makeAnimated from 'react-select/animated';

//Should be synced with models.py
let MAX_NAME_LENGTH = 64;
let MAX_DESCRIPTION_LENGTH = 1024;

let ACCEPTED_SCORE_FILE = ['json'];
let ACCEPTED_EVAL_SCRIPT = ['py'];
let ACCEPTED_IMAGE = ['png', 'jpg', 'jpeg'];

const customStyles = {
    option: provided => ({...provided, color: 'black'}),
    control: provided => ({...provided, color: 'black'}),
    singleValue: provided => ({...provided, color: 'black'})
}


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
    const [tags, setTags] = useState([])
    const [playLink, setPlayLink] = useState("");
    const [existingTags, setExistingTags] = useState([])
    const [options, setOptions] = useState([])

    useEffect(() => {
        requestGameTags()
            .then((tags) => {
                setExistingTags(tags);
            })
    }, [])

    existingTags.forEach((tag) => {
        options.push({
            value: tag.id,
            label: tag.name
        })
    })


    const handleImage = (event) => {
        const file = event.target.files[0];
        const acceptedFormats = ACCEPTED_IMAGE;
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (!acceptedFormats.includes(fileExtension)) {
            setError("root", {message: "Invalid file type provided"})
            setImage(null)
        } else {
            setImage(file)
        }
    }

    function handleCreate(tagName) {
        let formData = new FormData()
        formData.append("name", tagName)
        formData.append("slug", slugify(tagName))
        formData.append("description", "default description")
        axios({
            method: "post",
            url: "http://127.0.0.1:8000/api/gameTag/",
            data: formData,
            headers: {"Content-Type": "multipart/form-data"},
        }).then((response) => {
            console.log(response)
            let newValue = {
                value: response.data.id,
                label: response.data.name
            }
            setOptions((prev) => [...prev, newValue]);
            setTags([])
            setTags([newValue])

        }).catch(() => {
                setError("tags", {message: "Error creating new tag"})
            }
        )
    }

    const handleEvalScript = (event) => {
        const file = event.target.files[0];
        const acceptedFormats = ACCEPTED_EVAL_SCRIPT;
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (!acceptedFormats.includes(fileExtension)) {
            setError("evaluationScript", {message: "Invalid file type provided"})
            setEvaluationScript(null)
        } else {
            setEvaluationScript(file)
        }
    }

    const handleScores = (event) => {
        const file = event.target.files[0];
        const acceptedFormats = ACCEPTED_SCORE_FILE;
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (!acceptedFormats.includes(fileExtension)) {
            setError("scoreType", {message: "Invalid file type provided"})
            setScoreType(null)
        } else {
            setScoreType(file)
        }
    }

    const onSubmit = async (event) => {


        let formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        //Temporary until authentication is fulfilled
        formData.append("owner", 3);
        formData.append("play_link", playLink);
        formData.append("slug", slugify(name));

        if(tags.length===1){
            formData.append("tags", tags[0].value)
        }

        console.log(tags)

        if (image) {
            formData.append("icon", image)
        }
        if (evaluationScript) {
            formData.append("evaluation_script", evaluationScript)
        }
        if (scoreType) {
            formData.append("scoreType", scoreType)
        }

        await axios({
            method: "post",
            url: "http://127.0.0.1:8000/api/games/",
            data: formData,
            headers: {"Content-Type": "multipart/form-data"},
        }).then(function (response) {
            console.log(response);

            if (tags) {
                const finalTagIDs = tags.map((tag) => tag.value);
                formData.append("tags", finalTagIDs)
                axios({
                    method: "post",
                    url: `http://127.0.0.1:8000/api/games/${response.data.id}/add_tags/`,
                    data: formData,
                    headers: {"Content-Type": "multipart/form-data"},
                }).catch((response) => {
                    console.log(response)
                        setError("root", {message: "Error during tag upload"})
                    }
                )
            }


            reset();
            setError("root", {message: "game submitted successfully"});
            setTags([]);
        }).catch(function (response) {
            console.log(response)
            if (!response) {
                setError("root", {message: "No response from server"});
            } else {
                if (response.response.data.slug) {
                    setError("root", {message: "A game with that name already exists!"});
                    return;
                } else if (response.response.data.tags) {
                    setError("root", {message: "Tag upload failed"});
                    return;
                }
                if (response)
                    if (response.response.data.includes("IntegrityError")) {
                        setError("root", {message: "A game with that name already exists!"});
                    } else {
                        setError("root", {
                            message: `Something went wrong... ${response.response.data}`
                        })
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
            })} type={"text"} placeholder={"game name"}
                   onChange={(event) => setName(event.target.value)}
            />
            {errors.name && (
                <div>{errors.name.message}</div>
            )}

            <h3>Description</h3>
            <input {...register("description", {
                required: "A description is required",
                maxLength: {
                    value: MAX_DESCRIPTION_LENGTH,
                    message: `Maximum description length has been exceeded (${MAX_DESCRIPTION_LENGTH})`,
                }
            })} type={"text"} placeholder={"This game measures..."}
                   onChange={(event) => setDescription(event.target.value)}
            />
            {errors.description && (
                <div>{errors.description.message}</div>
            )}

            <h3>Game Tags</h3>
            <CreatableSelect
                isClearable={true}
                onChange={(newValue) => setTags([...tags, newValue])}
                onCreateOption={handleCreate}
                value={tags}
                options={options}
                components={makeAnimated()}
                styles={customStyles}
                placeholder={"Search..."}
            />
            {errors.tags && (
                <div>{errors.tags.message}</div>
            )}

            <h3>Play Link</h3>
            <input {...register("playLink", {
                required: "A Play link must be provided",
                validate: (value) => {
                    try {
                        let url = new URL(value)
                    } catch (error) {
                        return "Invalid URL Provided"
                    }
                    return true
                }
            })} type={"text"} placeholder={"https://link"} onChange={(event) => setPlayLink(event.target.value)}/>
            {errors.playLink && (
                <div>{errors.playLink.message}</div>
            )}

            <span>
                <div>
                    <h3>Game Icon</h3>
                    <motion.div
                        whileHover={{scale: 1.1}}
                        whileTap={{scale: 0.9}}
                    >
                        <label htmlFor={'icon'}>
                            <p>
                                {image ? image.name : 'No file chosen'}
                            </p>
                            <div>
                                <FaImage/>
                            </div>
                        </label>
                        <input id={'icon'} {...register("icon", {
                            required: false,

                        })} type={"file"} accept={"image/*"} onChange={handleImage}/>
                    </motion.div>
                </div>
                <div>
                    <h3>Score Types</h3>
                    <motion.div
                        whileHover={{scale: 1.1}}
                        whileTap={{scale: 0.9}}
                    >
                        <label htmlFor={'score'}>
                            <p>
                                {scoreType ? scoreType.name : 'No file chosen'}
                            </p>
                            <div>
                                <LuFileJson/>
                            </div>
                        </label>
                        <input id={'score'} {...register("scoreTypes", {
                            required: "Score types must be uploaded"
                        })} type={"file"} accept={".json"} onChange={handleScores}
                        />
                        {errors.scoreTypes && (
                            <div>{errors.scoreTypes.message}</div>
                        )}
                    </motion.div>
                </div>
                <div>
                    <h3>Evaluation Script</h3>
                    <motion.div
                        whileHover={{scale: 1.1}}
                        whileTap={{scale: 0.9}}
                    >
                        <label htmlFor={'script'}>
                            <p>
                                {evaluationScript ? evaluationScript.name : 'No file chosen'}
                            </p>
                            <div>
                                <FaPython/>
                            </div>
                        </label>
                        <input id={'script'} {...register("evaluationScript", {
                            required: "An Evaluation Script must be uploaded"
                        })} type={"file"} accept={".py"} onChange={handleEvalScript}
                        />
                        {errors.evaluationScript && (
                            <div>{errors.evaluationScript.message}</div>
                        )}
                    </motion.div>
                </div>
            </span>

            <motion.button
                disabled={isSubmitting}
                type={"submit"}
                whileHover={{scale: 1.1}}
                whileTap={{scale: 0.9}}
            >
                {isSubmitting ? "submitting game..." : "add new game"}
                <div>
                    <FaPlus/>
                </div>
            </motion.button>
            {errors.root && (
                <div>{errors.root.message}</div>
            )}
        </form>
    );
}
