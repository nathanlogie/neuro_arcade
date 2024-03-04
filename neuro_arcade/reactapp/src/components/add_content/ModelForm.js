import {useForm} from "react-hook-form";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {motion} from "framer-motion";
import {FaImage, FaPlus} from "react-icons/fa6";
import CreatableSelect from 'react-select/creatable';
import {
    requestPlayerTags,
    getUser,
    getHeaders,
    API_ROOT,
    requestGameTags,
    createNewPlayer
} from "../../backendRequests";
import slugify from 'react-slugify';
import makeAnimated from 'react-select/animated';
import {MAX_DESCRIPTION_LENGTH_MODEL, MAX_NAME_LENGTH_MODEL, IMAGE_EXTENSION} from "./variableHelper";


const customStyles = {
    option: provided => ({...provided, color: 'white'}),
    control: provided => ({...provided, color: 'black', backgroundColor: 'rgba(255, 255, 255, 0.2)', border: 'none', borderRadius: '0.5em', marginBottom: '1em'}),
    valueContainer: provided => ({...provided, height: 'max-content'}),
    placeholder: provided => ({...provided, color: '#CCCCCC', textAlign: 'left', fontSize: '0.9em', paddingLeft: '1em'}),
    input: provided => ({...provided, color: '#FFFFFF', paddingLeft: '1em', fontSize: '0.9em'}),
    multiValue: provided => ({...provided, backgroundColor: 'rgba(0,0,0,0.2)', color: 'white', borderRadius: '0.5em'}),
    multiValueLabel: provided => ({...provided, color: 'white'}),
    multiValueRemove: provided => ({...provided, borderRadius: '0.5em'}),
    menu: provided => ({...provided, borderRadius: '0.5em', position: 'relative'})
}

export function ModelForm() {
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

    useEffect(() => {
        requestPlayerTags().then((tags) => setExistingTags(tags))
    }, [])

    useEffect(() => {
        let newOpt = [];
        existingTags.forEach((tag) => newOpt.push({
            value: tag.name,
            label: tag.name,
        }));
        setOptions(newOpt);
    }, [existingTags])

    const handleImage = (event) => {
        const file = event.target.files[0];
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (IMAGE_EXTENSION.includes(fileExtension)) {
            setImage(file);
        } else {
            // file doesn't include an accepted image file extension, so it's refused
            setError("root", {message: "Invalid file type provided"});
            setImage(null);
        }
    }

    const onSubmit = async (event) => {
        let requestTags = [];
        tags.forEach(tag => requestTags.push(tag.value));
        await createNewPlayer(name, description, requestTags, image)
        .then(() => {
            reset();
            setImage(null);
            setError("root", {message: "model submitted successfully"});
            setTags([]);
        }).catch((response) => {
            console.log(response);
            if (!response) {
                setError("root", {message: "No response from server"});
            } else {
                if (response.status === 400)  // 400 Bad Request
                    setError('root', response.data);
                if (response.status === 500)  // 500 Internal Server Error
                    setError('root', {message: 'Internal server error;'});
            }
        });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h3>Name</h3>
            <input {...register("name", {
                required: "Name is required",
                maxLength: {
                    value: MAX_NAME_LENGTH_MODEL,
                    message: `Maximum name length has been exceeded (${MAX_NAME_LENGTH_MODEL})`
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
                    value: MAX_DESCRIPTION_LENGTH_MODEL,
                    message: `Maximum description length has been exceeded (${MAX_NAME_LENGTH_MODEL}`
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

            <span>
                <div>
                    <h3>Model Icon</h3>
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
