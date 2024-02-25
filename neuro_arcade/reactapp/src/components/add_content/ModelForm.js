import {useForm} from "react-hook-form";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {motion} from "framer-motion";
import {FaImage, FaPlus} from "react-icons/fa6";
import CreatableSelect from 'react-select/creatable';
import {requestPlayerTags, getUser} from "../../backendRequests";
import slugify from 'react-slugify';
import makeAnimated from 'react-select/animated';
import {get_description_length, get_name_length, get_image_extension} from "./variableHelper";

let MAX_NAME_LENGTH = get_name_length()
let MAX_DESCRIPTION_LENGTH = get_description_length()
let ACCEPTED_IMAGE = get_image_extension();

const customStyles = {
    option: provided => ({
        ...provided,
        color: 'black'
    }),
    control: provided => ({
        ...provided,
        color: 'black'
    }),
    singleValue: provided => ({
        ...provided,
        color: 'black'
    })
}

export function ModelForm() {
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



    useEffect(() => {
        requestPlayerTags()
            .then((tags) => {
                setExistingTags(tags);
            })
        setUser(getUser().id);
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
        formData.append("description", "described")
        axios({
            method: "post",
            url: "http://127.0.0.1:8000/api/playerTag/",
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

    const onSubmit = async (event) => {

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("user", user);
        formData.append("is_ai", true);
        if (image) {
            formData.append("icon", image)
        }

        await axios({
            //I will move a lot of this stuff to backend requests to centralize it in a future merge request
            method: "post",
            url: "http://127.0.0.1:8000/api/players/",
            data: formData,
            headers: {"Content-Type": "multipart/form-data"},
        }).then(function (response) {
            console.log(response);

            if (tags.length !== 0) {
                const finalTagIDs = tags.map((tag) => tag.value);
                formData.append("tags", finalTagIDs)
                axios({
                    method: "post",
                    url: `http://127.0.0.1:8000/api/players/${response.data.id}/add_tags/`,
                    data: formData,
                    headers: {"Content-Type": "multipart/form-data"},
                }).catch((response) => {
                        console.log(response)
                        setError("root", {message: "Error during tag upload"})
                    }
                )
            }
            reset()
            setImage(null)
            setError("root", {message: "model submitted successfully"})
            setTags(null)
        }).catch(function (response) {
            console.log(response)
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

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h3>Name</h3>
            <input {...register("name", {
                required: "Name is required",
                maxLength: {
                    value: MAX_NAME_LENGTH,
                    message: `Maximum name length has been exceeded (${MAX_NAME_LENGTH})`
                }
            })}
                   type={"text"} placeholder={"model name"}
                   onChange={(event) => setName(event.target.value)}
            />
            {errors.name && (
                <div>{errors.name.message}</div>
            )}

            <h3>Description</h3>
            <input {...register("description", {
                required: false,
                maxLength: {
                    value: MAX_DESCRIPTION_LENGTH,
                    message: "Maximum description length has been exceeded (${MAX_DESCRIPTION_LENGTH})"
                }
            })}
                   type={"text"} placeholder={"This model was designed to..."}
                   onChange={(event) => setDescription(event.target.value)}
            />
            {errors.description && (
                <div>{errors.description.message}</div>
            )}

            <h3> Model Tags </h3>
            <CreatableSelect
                isMulti
                isClearable={true}
                onChange={(newValue) => setTags(newValue)}
                onCreateOption={handleCreate}
                value={tags}
                options={options}
                components={makeAnimated()}
                styles={customStyles}
                placeholder={"Search..."}
            />

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
            </span>

            <motion.button
                disabled={isSubmitting}
                type={"submit"}
                whileHover={{scale: 1.1}}
                whileTap={{scale: 0.9}}
            >
                {isSubmitting ? "submitting model..." : "add new model"}
                <div>
                    <FaPlus/>
                </div>
            </motion.button>
                {errors.root && (
                    <div>{errors.root.message}</div>
                )}
        </form>
)
}
