import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import axios from 'axios';
import {FaImage} from "react-icons/fa6";
import {LuFileJson} from "react-icons/lu";
import {FaPython} from "react-icons/fa6";
import {FaPlus} from "react-icons/fa6";
import {motion} from "framer-motion";
import CreatableSelect from 'react-select/creatable';
import {requestGameTags, requestGame} from "../../backendRequests";
import slugify from 'react-slugify';
import makeAnimated from 'react-select/animated';

import {
    get_description_length,
    get_eval_extension,
    get_image_extension,
    get_name_length,
    get_score_extension
} from "./variableHelper";
import {useParams} from "react-router-dom";

let MAX_NAME_LENGTH = get_name_length()
let MAX_DESCRIPTION_LENGTH = get_description_length()

let ACCEPTED_SCORE_FILE = get_score_extension();
let ACCEPTED_EVAL_SCRIPT = get_eval_extension();
let ACCEPTED_IMAGE = get_image_extension();

const customStyles = {
    option: provided => ({...provided, color: 'black'}),
    control: provided => ({...provided, color: 'black'}),
    singleValue: provided => ({...provided, color: 'black'})
}


/**
 * @returns {JSX.Element} update game form
 * @constructor builds update game form
 */
export function GameUpdateForm() {
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting, touchedFields},
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
    const [options, setOptions] = useState([])
    const [existingTags, setExistingTags] = useState([])
    const [currentValues, setCurrentValues] = useState(null)


    const gameSlug = useParams().game_slug;


    useEffect(() => {
        requestGame(gameSlug)
            .then((currentData) => {
                setCurrentValues(currentData.game);
            })
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

    console.log(currentValues)

    function handleReset(){
        reset({
            name: currentValues.name,
            description: currentValues.description,
            playLink: currentValues.play_link
        })
        setEvaluationScript(currentValues.evaluation_script)
        setScoreType(currentValues.score_type)
        setImage(currentValues.icon)
    }


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
            setTags((prev) => [...prev, newValue]);

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

    const onUpdate = async (event) => {

        let formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("owner", user);
        formData.append("play_link", playLink);
        formData.append("slug", slugify(name));


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

            if (tags.length !== 0) {
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
        <form>
            <h3> {currentValues.name} </h3>
            {/*<h3>Name</h3>*/}
            <input  {...register("name", {
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
                isClearable
                isMulti
                onChange={(newValue) => setTags(newValue)}
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
                type={"submit"}
                whileHover={{scale: 1.1}}
                whileTap={{scale: 0.9}}
                onSubmit={handleSubmit(onUpdate)}
            >
                {"Save Changes"}
                <div>
                    <FaPlus/>
                </div>
            </motion.button>
            <motion.button
                whileHover={{scale: 1.1}}
                whileTap={{scale: 0.9}}
                onSubmit={handleReset}
            >
                {"RESET"}
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
