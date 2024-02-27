import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import axios from 'axios';
import {FaImage} from "react-icons/fa6";
import {LuFileJson} from "react-icons/lu";
import {FaPython} from "react-icons/fa6";
import {FaPlus} from "react-icons/fa6";
import {motion} from "framer-motion";
import CreatableSelect from 'react-select/creatable';
import {requestGameTags, requestGame, API_ROOT} from "../../backendRequests";
import slugify from 'react-slugify';
import makeAnimated from 'react-select/animated';

import {
    MAX_NAME_LENGTH_GAME,
    MAX_DESCRIPTION_LENGTH_GAME,
    IMAGE_EXTENSION,
    SCORE_EXTENSION,
    EVAL_EXTENSION
} from "./variableHelper";
import {useParams} from "react-router-dom";

const customStyles = {
    option: provided => ({...provided, color: 'white'}),
    control: provided => ({...provided, color: 'black', backgroundColor: 'rgba(255, 255, 255, 0.2)', border: 'none', borderRadius: '0.5em'}),
    valueContainer: provided => ({...provided, height: 'max-content'}),
    placeholder: provided => ({...provided, color: '#CCCCCC', textAlign: 'left', fontSize: '0.9em', paddingLeft: '1em'}),
    input: provided => ({...provided, color: '#FFFFFF', paddingLeft: '1em', fontSize: '0.9em'}),
    multiValue: provided => ({...provided, backgroundColor: 'rgba(0,0,0,0.2)', color: 'white', borderRadius: '0.5em'}),
    multiValueLabel: provided => ({...provided, color: 'white'}),
    multiValueRemove: provided => ({...provided, borderRadius: '0.5em'}),
    menu: provided => ({...provided, borderRadius: '0.5em', position: 'relative'})
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
    const [loading, setLoading] = useState(true)
    const [imageURL, setImageURL] = useState(null)
    const gameSlug = useParams().game_slug;


    useEffect(() => {
        requestGame(gameSlug)
            .then((currentData) => {
                setCurrentValues(currentData.game);
                requestGameTags()
                    .then((tags) => {
                        setExistingTags(tags);
                        setImageURL(`${API_ROOT}/${currentData.game.icon}`)
                        setLoading(false)
                        console.log(currentValues)
                    })
            })


    }, [])

    existingTags.forEach((tag) => {
        options.push({
            value: tag.id,
            label: tag.name
        })
    })

    function handleTagReset(){
        options.forEach((option)=>{
            if(currentValues.tags.includes(option.value)){
                tags.push(option)
            }
        })
    }



    function handleReset() {
        reset({
            name: currentValues.name,
            description: currentValues.description,
            playLink: currentValues.play_link
        })
        setImageURL(currentValues.icon)
        handleTagReset()
    }


    const handleImage = (event) => {
        const file = event.target.files[0];
        const acceptedFormats = IMAGE_EXTENSION;
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (!acceptedFormats.includes(fileExtension)) {
            setError("root", {message: "Invalid file type provided"})
            setImage(null)
            setImageURL(null)
            setImageURL(`${API_ROOT}/${currentValues.icon}`)
        } else {
            setImage(file)
            setImageURL(URL.createObjectURL(file))
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
        const acceptedFormats = EVAL_EXTENSION;
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
        const acceptedFormats = SCORE_EXTENSION;
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

    handleTagReset();

    if (!loading) {
        return (
            <form>
                <h3> {currentValues.name} </h3>
                <input  {...register("name", {
                    maxLength: {
                        value: MAX_NAME_LENGTH_GAME,
                        message: `Maximum game title length has been exceeded (${MAX_NAME_LENGTH_GAME})`,
                    }
                })} type={"text"} placeholder={"game name"} defaultValue={currentValues.name}
                        onChange={(event) => setName(event.target.value)}
                />
                {errors.name && (
                    <div>{errors.name.message}</div>
                )}

                <h3>Description</h3>
                <input {...register("description", {
                    maxLength: {
                        value: MAX_DESCRIPTION_LENGTH_GAME,
                        message: `Maximum description length has been exceeded (${MAX_DESCRIPTION_LENGTH_GAME})`,
                    }
                })} type={"text"} placeholder={"This game measures..."} defaultValue={currentValues.description}
                       onChange={(event) => setDescription(event.target.value)}
                />
                {errors.description && (
                    <div>{errors.description.message}</div>
                )}

                <h3>Game Tags</h3>
                <CreatableSelect
                    isClearable
                    isMulti
                    defaultValue={currentValues.tags}
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
                    validate: (value) => {
                        try {
                            let url = new URL(value)
                        } catch (error) {
                            return "Invalid URL Provided"
                        }
                        return true
                    }
                })} type={"text"} placeholder={"https://link"} defaultValue={currentValues.play_link}
                       onChange={(event) => setPlayLink(event.target.value)}/>
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
                    <h2>Current image</h2>
                    <img src={imageURL} alt='icon'/>
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
                        <input id={'score'} {...register("scoreTypes")
                        } type={"file"} accept={".json"}
                               onChange={handleScores}
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
                        <input id={'script'} {...register("evaluationScript", {})} type={"file"} accept={".py"}
                               onChange={handleEvalScript}
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
    } else {
        return (
            <div>
                Loading...
            </div>
        )
    }
}
