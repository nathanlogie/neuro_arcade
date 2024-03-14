import {useForm} from "react-hook-form";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {motion} from "framer-motion";
import {FaImage, FaTrash} from "react-icons/fa6";
import CreatableSelect from "react-select/creatable";
import {requestPlayerTags, getUser, getHeaders, API_ROOT, requestPlayer, MEDIA_ROOT} from "../../backendRequests";
import slugify from "react-slugify";
import makeAnimated from "react-select/animated";
import {MAX_DESCRIPTION_LENGTH_MODEL, MAX_NAME_LENGTH_MODEL, IMAGE_EXTENSION, customStyles} from "./formHelper";
import {useNavigate, useParams} from "react-router-dom";
import {updatePlayer} from "../../backendRequests";
import {FaSave} from "react-icons/fa";
import {GrPowerReset} from "react-icons/gr";

/**
 * @returns {JSX.Element} update existing model form
 * @constructor builds update existing model form
 */
export function ModelUpdateForm() {
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting, touchedFields},
        setError,
        reset
    } = useForm();

    let [name, setName] = useState("");
    let [description, setDescription] = useState("");
    let [tags, setTags] = useState([]);
    let [existingTags, setExistingTags] = useState([]);
    let [options, setOptions] = useState([]);
    let [image, setImage] = useState(null);
    let [imageURL, setImageURL] = useState(null);

    let [loading, setLoading] = useState(true);
    let [currentValues, setCurrentValues] = useState(null);
    let playerSlug = useParams().player_slug;
    let navigate = useNavigate();

    useEffect(() => {
        requestPlayer(playerSlug).then((currentData) => {
            setCurrentValues(currentData);
            setImageURL(`${MEDIA_ROOT}/${currentData.icon}`);
            let _tags = [];
            currentData.tags.forEach((tagName) => _tags.push({value: tagName, label: tagName}));
            setTags(_tags);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        requestPlayerTags().then((tags) => {
            setExistingTags(tags);
        });
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
        setTags(currentValues.tags);
    }

    function handleReset() {
        reset({
            name: currentValues.name,
            description: currentValues.description
        });
        setName("");
        setDescription("");
        setImageURL(`${MEDIA_ROOT}/${currentValues.icon}`);
        setImage(null);
        handleTagReset();
    }

    function handleImage(event) {
        const file = event.target.files[0];
        const acceptedFormats = IMAGE_EXTENSION;
        const fileExtension = file.name.split(".").pop().toLowerCase();
        if (!acceptedFormats.includes(fileExtension)) {
            setError("root", {message: "Invalid file type provided"});
            setImage(null);
            setImageURL(`${MEDIA_ROOT}/${currentValues.icon}`);
        } else {
            setImage(file);
            setImageURL(URL.createObjectURL(file));
        }
    }

    function handleDelete() {
        if (currentValues.user !== getUser().id && !getUser().is_admin) {
            setError("root", {
                message: "You do not have permissions to edit this player"
            });
            return;
        }

        let url = `${API_ROOT}/players/${currentValues.id}/`;
        axios
            .delete(url)
            .then((response) => {
                navigate("/all-players/");
            })
            .catch(() => {
                setError("root", {
                    message: "Could not delete player"
                });
            });
    }

    async function onUpdate() {
        if (currentValues.user !== getUser().id && !getUser().is_admin) {
            setError("root", {
                message: "You do not have permissions to edit this player"
            });
            return;
        }

        let requestTags = tags.map(t => t.value);

        await updatePlayer(playerSlug, name, description, requestTags, image)
            .then(response => {
                console.log(response);
                if (name !== "") {
                    navigate("/all-players/");
                } else {
                    navigate("/all-players/" + playerSlug);
                }
            })
            .catch((response) => {
                setError("root", {message: "Something went wrong"});
                console.log(response);
            })
    }

    if (!loading) {
        return (
            <form>
                <h3> Editing <strong>{currentValues.name}</strong>... </h3>
                {/* todo: Name Change doesn't work due to reason I don't understand */}
                {/*<input*/}
                {/*    {...register("name", {*/}
                {/*        maxLength: {*/}
                {/*            value: MAX_NAME_LENGTH_MODEL,*/}
                {/*            message: `Maximum player title length has been exceeded (${MAX_NAME_LENGTH_MODEL})`*/}
                {/*        }*/}
                {/*    })}*/}
                {/*    type={"text"}*/}
                {/*    placeholder={"player name"}*/}
                {/*    defaultValue={currentValues.name}*/}
                {/*    onChange={(event) => setName(event.target.value)}*/}
                {/*/>*/}
                {/*{errors.name && <div>{errors.name.message}</div>}*/}

                <h3>Description</h3>
                <textarea
                    {...register("description", {
                        maxLength: {
                            value: MAX_DESCRIPTION_LENGTH_MODEL,
                            message: `Maximum description length has been exceeded (${MAX_DESCRIPTION_LENGTH_MODEL})`
                        }
                    })}
                    style={{height: '6em', lineHeight: '2em', paddingTop: '1em', paddingBottom: '1em', resize: 'vertical'}}
                    placeholder={"This player measures..."}
                    defaultValue={currentValues.description}
                    onChange={(event) => setDescription(event.target.value)}
                />
                {errors.description && <div>{errors.description.message}</div>}

                <h3>Player Tags</h3>
                <CreatableSelect
                    isClearable
                    isMulti
                    defaultValue={currentValues.tags}
                    onChange={setTags}
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

                <span>
                    <div>
                        <h3>Player Icon</h3>
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
