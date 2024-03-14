import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import axios from "axios";
import {FaImage, FaTrash} from "react-icons/fa6";
import {LuFileJson} from "react-icons/lu";
import {FaPython} from "react-icons/fa6";
import {motion} from "framer-motion";
import CreatableSelect from "react-select/creatable";
import {requestGameTags, requestGame, API_ROOT, getUser, getHeaders} from "../../backendRequests";
import slugify from "react-slugify";
import makeAnimated from "react-select/animated";
import {updateGames} from "../../backendRequests";
import {
    MAX_NAME_LENGTH_GAME,
    MAX_DESCRIPTION_LENGTH_GAME,
    IMAGE_EXTENSION,
    SCORE_EXTENSION,
    EVAL_EXTENSION,
    customStyles, handleFileUpload
} from "./formHelper";
import {useNavigate, useParams} from "react-router-dom";
import {FaSave} from "react-icons/fa";
import {GrPowerReset} from "react-icons/gr";

/**
 * @returns {JSX.Element} update game form
 * @constructor builds update game form
 */
export function GameUpdateForm() {
    const {
        register,
        handleSubmit,
        formState: {errors, touchedFields},
        setError,
        reset,
        setValue
    } = useForm();

    let [image, setImage] = useState(null);
    let [evaluationScript, setEvaluationScript] = useState(null);
    let [scoreType, setScoreType] = useState(null);
    let [name, setName] = useState("");
    let [description, setDescription] = useState("");
    let [playLink, setPlayLink] = useState("");
    let [imageURL, setImageURL] = useState(null);
    let [tags, setTags] = useState([]);

    let [options, setOptions] = useState([]);
    let [existingTags, setExistingTags] = useState([]);
    let [currentValues, setCurrentValues] = useState(null);
    let [loading, setLoading] = useState(true);
    const gameSlug = useParams().game_slug;
    const navigate = useNavigate();

    useEffect(() => {
        requestGame(gameSlug).then((response) => {
            console.log(response.game)
            setCurrentValues(response.game);
            setImageURL(`${API_ROOT}/${response.game.icon}`);
            console.log(response.game.tags);
            let _tags = []
            response.game.tags.forEach((tagName) => {
                _tags.push({
                    value: tagName,
                    label: tagName,
                })
            })
            setTags(_tags);
            console.log(tags);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        requestGameTags().then((tags) => setExistingTags(tags));
    }, []);

    useEffect(() => {
        let newOpt = [];
        existingTags.forEach((tag) =>
            newOpt.push({
                value: tag.name,
                label: tag.name
            })
        );
        setOptions(newOpt);
    }, [existingTags]);

    function handleTagReset() {
        setTags([]);
        options.forEach((option) => {
            if (currentValues.tags.includes(option.value)) {
                tags.push(option);
            }
        });
    }

    function handleReset() {
        reset({
            name: currentValues.name,
            description: currentValues.description,
            playLink
        });
        setValue("playLink", currentValues.play_link.toString(), {shouldValidate: true});

        setName("");
        setDescription("");
        setPlayLink("");
        setImageURL(`${API_ROOT}/${currentValues.icon}`);
        setImage(null);
        handleTagReset();
    }

    function handleDelete() {
        if (currentValues.user !== getUser().id && !getUser().is_admin) {
            setError("root", {
                message: "You do not have permissions to edit this game"
            });
            return;
        }
        //todo this shouldn't be done through a ViewSet
        let url = `${API_ROOT}/api/games/${currentValues.id}/`;
        axios
            .delete(url)
            .then((response) => {
                navigate("/all-games/");
            })
            .catch(() => {
                setError("root", {
                    message: "Could not delete game"
                });
            });
    }

    const handleImage = (event) => {
        const file = event.target.files[0];
        const acceptedFormats = IMAGE_EXTENSION;
        const fileExtension = file.name.split(".").pop().toLowerCase();
        if (!acceptedFormats.includes(fileExtension)) {
            setError("root", {message: "Invalid file type provided"});
            setImage(null);
            setImageURL(null);
            setImageURL(`${API_ROOT}/${currentValues.icon}`);
        } else {
            setImage(file);
            setImageURL(URL.createObjectURL(file));
        }
    };

    const handleEvalScript = (event) => {
        handleFileUpload(event.target.files[0], EVAL_EXTENSION, setEvaluationScript, setError, 'evaluationScript');
    };

    const handleScores = (event) => {
        handleFileUpload(event.target.files[0], SCORE_EXTENSION, setScoreType, setError, 'scoreType');
    };

    const onUpdate = async (event) => {
        if (currentValues.user !== getUser().id && !getUser().is_admin) {
            setError("root", {
                message: "You do not have permissions to edit this game"
            });
            return;
        }

        let requestTags = [];
        tags.forEach((tag) => requestTags.push(tag.value));

        await updateGames(gameSlug, name, description, requestTags, playLink, image, evaluationScript, scoreType)
            .then((response) => {
                console.log(response);
                if (name !== "") {
                    navigate(`/all-games/${slugify(name)}`);
                } else {
                    navigate(`/all-games/${currentValues.slug}`);
                }
            })
            .catch(function (response) {
                console.log(response);
                if (!response) {
                    setError("root", {message: "No response from server"});
                } else {
                    if (response.response.data.slug) {
                        setError("root", {message: "A game with that name already exists!"});
                        return;
                    } else if (response.response.data.tags) {
                        setError("root", {message: "Tag update failed"});
                        return;
                    }
                    if (response)
                        if (response.response.data.includes("IntegrityError")) {
                            setError("root", {message: "A game with that name already exists!"});
                        } else {
                            setError("root", {
                                message: `Something went wrong... ${response.response.data}`
                            });
                        }
                }
            });
    };

    if (!loading) {
        return (
            <form>
                <h3> Name </h3>
                <input
                    {...register("name", {
                        maxLength: {
                            value: MAX_NAME_LENGTH_GAME,
                            message: `Maximum game title length has been exceeded (${MAX_NAME_LENGTH_GAME})`
                        }
                    })}
                    type={"text"}
                    placeholder={"game name"}
                    defaultValue={currentValues.name}
                    onChange={(event) => setName(event.target.value)}
                />
                {errors.name && <div>{errors.name.message}</div>}

                <h3>Description</h3>
                <input
                    {...register("description", {
                        maxLength: {
                            value: MAX_DESCRIPTION_LENGTH_GAME,
                            message: `Maximum description length has been exceeded (${MAX_DESCRIPTION_LENGTH_GAME})`
                        }
                    })}
                    type={"text"}
                    placeholder={"This game measures..."}
                    defaultValue={currentValues.description}
                    onChange={(event) => setDescription(event.target.value)}
                />
                {errors.description && <div>{errors.description.message}</div>}

                <h3>Game Tags</h3>
                <CreatableSelect
                    isClearable
                    isMulti
                    defaultValue={currentValues.tags}
                    onChange={(newValue) => setTags(newValue)}
                    // onCreateOption={handleCreate}
                    value={tags}
                    options={options}
                    components={makeAnimated()}
                    styles={customStyles}
                    placeholder={"Search..."}
                    theme={(theme) => ({
                        ...theme,
                        colors: {
                            ...theme.colors,
                            primary25: "rgba(255,255,255,0.3)",
                            primary: "white",
                            neutral0: "rgba(255, 255, 255, 0.1)",
                            neutral20: "white",
                            neutral40: "#BBBBBB",
                            neutral60: "#CCCCCC",
                            neutral80: "#AAAAAA",
                            primary50: "rgba(209,64,129,0.3)"
                        }
                    })}
                />
                {errors.tags && <div>{errors.tags.message}</div>}

                <h3>Play Link</h3>
                <input
                    {...register("playLink", {
                        validate: (value) => {
                            try {
                                let url = new URL(value);
                            } catch (error) {
                                return "Invalid URL Provided";
                            }
                            return true;
                        }
                    })}
                    type={"text"}
                    placeholder={"https://link"}
                    defaultValue={currentValues.play_link}
                    onChange={(event) => setPlayLink(event.target.value)}
                />
                {errors.playLink && <div>{errors.playLink.message}</div>}

                <span>
                    <div>
                        <h3>Game Icon</h3>
                        <motion.div whileHover={{scale: 1.1}} whileTap={{scale: 0.9}}>
                            <label htmlFor={"icon"}>
                                <p>{image ? image.name : "No file chosen"}</p>
                                <div>
                                    <FaImage />
                                </div>
                            </label>
                            <input
                                id={"icon"}
                                {...register("icon", {
                                    required: false
                                })}
                                type={"file"}
                                accept={"image/*"}
                                onChange={handleImage}
                            />
                        </motion.div>
                        <h3>Current image</h3>
                        <img src={imageURL} alt='icon' />
                    </div>

                    <div>
                        <h3>Score Types</h3>
                        <motion.div whileHover={{scale: 1.1}} whileTap={{scale: 0.9}}>
                            <label htmlFor={"score"}>
                                <p>{scoreType ? scoreType.name : "No file chosen"}</p>
                                <div>
                                    <LuFileJson />
                                </div>
                            </label>
                            <input id={"score"} {...register("scoreTypes")} type={"file"} accept={".json"} onChange={handleScores} />
                            {errors.scoreTypes && <div>{errors.scoreTypes.message}</div>}
                        </motion.div>
                    </div>
                    <div>
                        <h3>Evaluation Script</h3>
                        <motion.div whileHover={{scale: 1.1}} whileTap={{scale: 0.9}}>
                            <label htmlFor={"script"}>
                                <p>{evaluationScript ? evaluationScript.name : "No file chosen"}</p>
                                <div>
                                    <FaPython />
                                </div>
                            </label>
                            <input
                                id={"script"}
                                {...register("evaluationScript", {})}
                                type={"file"}
                                accept={".py"}
                                onChange={handleEvalScript}
                            />
                            {errors.evaluationScript && <div>{errors.evaluationScript.message}</div>}
                        </motion.div>
                    </div>
                </span>

                <motion.button whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} onClick={handleSubmit(onUpdate)}>
                    {"save"}
                    <div>
                        <FaSave />
                    </div>
                </motion.button>
                <motion.button whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} onClick={handleSubmit(handleReset)}>
                    {"reset"}
                    <div>
                        <GrPowerReset />
                    </div>
                </motion.button>
                <motion.button whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} onClick={handleSubmit(handleDelete)}>
                    {"delete"}
                    <div>
                        <FaTrash />
                    </div>
                </motion.button>
                {errors.root && <div>{errors.root.message}</div>}
            </form>
        );
    } else {
        return <div>Loading...</div>;
    }
}
