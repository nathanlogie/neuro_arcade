import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import axios from 'axios';
import {FaImage} from "react-icons/fa6";
import {LuFileJson} from "react-icons/lu";
import {FaPython} from "react-icons/fa6";
import {FaPlus} from "react-icons/fa6";
import {motion} from "framer-motion";
import CreatableSelect from 'react-select/creatable';
import {requestGameTags, getUser, getHeaders, API_ROOT} from "../../backendRequests";
import slugify from 'react-slugify';
import makeAnimated from 'react-select/animated';
import {
    MAX_NAME_LENGTH_GAME,
    MAX_DESCRIPTION_LENGTH_GAME,
    IMAGE_EXTENSION,
    SCORE_EXTENSION,
    EVAL_EXTENSION
} from "./variableHelper";

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
    const [options, setOptions] = useState([])
    const [existingTags, setExistingTags] = useState([])
    const [user, setUser] = useState(null)
    const [header, setHeader] = useState(null)

    useEffect(() => {
        requestGameTags()
            .then((tags) => {
                setExistingTags(tags);
                setUser(getUser().id);
            })
        getHeaders("POST", true)
            .then((header) => {
                header.headers["Content-Type"] = "multipart/form-data";
                setHeader(header);
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
        const acceptedFormats = IMAGE_EXTENSION;
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (!acceptedFormats.includes(fileExtension)) {
            setError("root", {message: "Invalid file type provided"})
            setImage(null)
        } else {
            setImage(file)
        }
    }

    async function handleCreate(tagName) {
        let formData = new FormData();
        let url = `${API_ROOT}/api/gameTag`;
        formData.append("name", tagName);
        formData.append("slug", slugify(tagName));
        formData.append("description", "default description");
        await axios.post(url,
            formData,
            header
        ).then((response) => {
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

    const onSubmit = async (event) => {


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

        console.log(header)

        let url = `${API_ROOT}/api/games/`;
        await axios.post(url, formData, header)
            .then(function (response) {
                console.log(response);

                if (tags.length !== 0) {
                    const finalTagIDs = tags.map((tag) => tag.value);
                    formData.append("tags", finalTagIDs)
                    let url = `${API_ROOT}/api/games/${response.data.id}/add_tags/`;
                    axios.post(url, formData, header)
                        .catch((response) => {
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
                    // todo: TypeError here: response.response doesn't exist here
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
                    value: MAX_NAME_LENGTH_GAME,
                    message: `Maximum game title length has been exceeded (${MAX_NAME_LENGTH_GAME})`,
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
                    value: MAX_DESCRIPTION_LENGTH_GAME,
                    message: `Maximum description length has been exceeded (${MAX_DESCRIPTION_LENGTH_GAME})`,
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
                theme={(theme) => ({
                    ...theme,
                    colors: {
                        ...theme.colors,
                        primary25: 'rgba(255,255,255,0.3)',
                        primary: 'white',
                        neutral0: 'rgba(255, 255, 255, 0.1)',
                        neutral20: 'white',
                        neutral40: '#BBBBBB',
                        neutral60: '#CCCCCC',
                        neutral80: '#AAAAAA',
                        primary50: 'rgba(209,64,129,0.3)'
                    },
                })}
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
