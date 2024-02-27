import {useForm} from "react-hook-form";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {motion} from "framer-motion";
import {FaImage, FaPlus, FaPython} from "react-icons/fa6";
import CreatableSelect from 'react-select/creatable';
import {
    requestPlayerTags,
    getUser,
    getHeaders,
    API_ROOT,
    requestPlayer,
} from "../../backendRequests";
import slugify from 'react-slugify';
import makeAnimated from 'react-select/animated';
import {
    MAX_DESCRIPTION_LENGTH_MODEL,
    MAX_NAME_LENGTH_MODEL,
    IMAGE_EXTENSION,
} from "./variableHelper";
import {useNavigate, useParams} from "react-router-dom";


const customStyles = {
    option: provided => ({...provided, color: 'white'}),
    control: provided => ({
        ...provided,
        color: 'black',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        border: 'none',
        borderRadius: '0.5em',
        marginBottom: '1em'
    }),
    valueContainer: provided => ({...provided, height: 'max-content'}),
    placeholder: provided => ({
        ...provided,
        color: '#CCCCCC',
        textAlign: 'left',
        fontSize: '0.9em',
        paddingLeft: '1em'
    }),
    input: provided => ({...provided, color: '#FFFFFF', paddingLeft: '1em', fontSize: '0.9em'}),
    multiValue: provided => ({...provided, backgroundColor: 'rgba(0,0,0,0.2)', color: 'white', borderRadius: '0.5em'}),
    multiValueLabel: provided => ({...provided, color: 'white'}),
    multiValueRemove: provided => ({...provided, borderRadius: '0.5em'}),
    menu: provided => ({...provided, borderRadius: '0.5em', position: 'relative'})
}

export function ModelUpdateForm() {
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting, touchedFields},
        setError,
        reset
    } = useForm()

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    let [tags, setTags] = useState([])
    const [existingTags, setExistingTags] = useState([])
    const [options, setOptions] = useState([])
    const [user, setUser] = useState(null)
    const [image, setImage] = useState(null)
    const player_name = useParams().player_slug;
    const [loading, setLoading] = useState(true)
    const [currentValues, setCurrentValues] = useState(null);
    const [header, setHeader] = useState(null)
    const [imageURL, setImageURL] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        requestPlayer(player_name)
            .then((currentData) => {
                setCurrentValues(currentData);
                getHeaders("PATCH", true).then((header) => {
                    header.headers["Content-Type"] = "multipart/form-data";
                    setHeader(header);
                    requestPlayerTags()
                        .then((tags) => {
                            setExistingTags(tags);
                            setLoading(false)
                        })
                })
            })
    }, [])

    existingTags.forEach((tag) => {
        options.push({
            value: tag.id,
            label: tag.name
        })
    })


    function handleTagReset() {
        options.forEach((option) => {
            if (currentValues.tags.includes(option.value)) {
                tags.push(option)
            }
        })
    }

    function handleReset() {
        reset({
            name: currentValues.name,
            description: currentValues.description,
        })
        setImageURL(`${API_ROOT}/${currentValues.icon}`);
        handleTagReset()
    }

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
        let formData = new FormData()
        let url = `${API_ROOT}/api/playerTag/`;

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

    function handleDelete() {
        if (currentValues.user !== getUser().id && !getUser().is_admin) {
            setError("root", {
                message: "You do not have permissions to edit this game"
            })
            return;
        }

        let url = `${API_ROOT}/api/players/${currentValues.id}/`
        axios.delete(url).then((response) => {
                navigate("/all_players/")
            }
        ).catch(() => {
                setError("root", {
                    message: "Could not delete model"
                })
            }
        )
    }

    const onUpdate = async () => {

        if (currentValues.user !== getUser().id && !getUser().is_admin) {
            setError("root", {
                message: "You do not have permissions to edit this game"
            })
            return;
        }

        let formData = new FormData();
        if (name !== "") {
            formData.append("name", name);
            formData.append("slug", slugify(name));
        }
        if (description !== "") {
            formData.append("description", description);
        }

        if (image) {
            formData.append("icon", image)
        }
        let url = `${API_ROOT}/api/players/${currentValues.id}/`;
        if (formData.entries().next().done) {
            setError("root", {
                message: "No changes detected"
            })
            return;
        }


        await axios.patch(url, formData, header).then(function (response) {

            if (tags.length !== 0) {
                const finalTagIDs = tags.map((tag) => tag.value);
                formData.append("tags", finalTagIDs)
                let url = `${API_ROOT}/api/players/${response.data.id}/add_tags/`;
                axios.post(url, formData, header)
                    .catch((response) => {
                            console.log(response)
                            setError("root", {message: "Error during tag change"})
                        }
                    )
            }
            reset()
            setImage(null)
            setError("root", {message: "model updated successfully"})
            setTags(null)
            if (name === "") {
                navigate(`/all_players/${currentValues.slug}`)
            } else {
                navigate(`/all_players/${slugify(name)}`)
            }

        }).catch(function (response) {
            if (!response) {
                setError("root", {message: "No response from server"});
            } else {
                if (response.response.data.slug) {
                    setError("root", {message: "A Model with that name already exists!"});
                    return;
                } else if (response.response.data.tags) {
                    setError("root", {message: "Tag upload failed"});
                    return;
                }
                if (response)
                    if (response.response.data.includes("IntegrityError")) {
                        setError("root", {message: "A Model with that name already exists!"});
                    } else {
                        setError("root", {
                            message: `Something went wrong... ${response.response.data}`
                        })
                    }
            }
        });
    }

    if (!loading) {
        return (
            <form onSubmit={handleSubmit(onUpdate)}>
                <h3> {currentValues.name} </h3>
                <input  {...register("name", {
                    maxLength: {
                        value: MAX_NAME_LENGTH_MODEL,
                        message: `Maximum model title length has been exceeded (${MAX_NAME_LENGTH_MODEL})`,
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
                        value: MAX_DESCRIPTION_LENGTH_MODEL,
                        message: `Maximum description length has been exceeded (${MAX_DESCRIPTION_LENGTH_MODEL})`,
                    }
                })} type={"text"} placeholder={"This game measures..."} defaultValue={currentValues.description}
                       onChange={(event) => setDescription(event.target.value)}
                />
                {errors.description && (
                    <div>{errors.description.message}</div>
                )}

                <h3>Model Tags</h3>
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

            </span>

                <motion.button
                    whileHover={{scale: 1.1}}
                    whileTap={{scale: 0.9}}
                >
                    {"Save Changes"}
                    <div>
                        <FaPlus/>
                    </div>
                </motion.button>
                <motion.button
                    whileHover={{scale: 1.1}}
                    whileTap={{scale: 0.9}}
                    onClick={handleSubmit(handleReset)}
                >
                    {"RESET"}
                    <div>
                        <FaPlus/>
                    </div>
                </motion.button>
                <motion.button
                    whileHover={{scale: 1.1}}
                    whileTap={{scale: 0.9}}
                    onClick={handleSubmit(handleDelete)}
                >
                    {"Delete Game"}
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
