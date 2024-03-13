import {useForm} from "react-hook-form";
import React, {useEffect, useState} from "react";
import {motion} from "framer-motion";
import {FaImage, FaPlus} from "react-icons/fa6";
import CreatableSelect from "react-select/creatable";
import {requestPlayerTags, createNewPlayer} from "../../backendRequests";
import makeAnimated from "react-select/animated";
import {MAX_DESCRIPTION_LENGTH_MODEL, MAX_NAME_LENGTH_MODEL, IMAGE_EXTENSION, handleFileUpload, customStyles} from "./formHelper";

export function ModelForm() {
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
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
        requestPlayerTags().then((tags) => setExistingTags(tags));
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

    const handleImage = (event) => {
        handleFileUpload(event.target.files[0], IMAGE_EXTENSION, setImage, setError, 'root');
    }

    const onSubmit = async () => {
        let requestTags = [];
        tags.forEach((tag) => requestTags.push(tag.value));
        await createNewPlayer(name, description, requestTags, image)
            .then((response) => {
                console.log(response);
                reset();
                setImage(null);
                setError("root", {message: "Model submitted successfully"});
                setTags(null);
            })
            .catch(function (response) {
                console.log(response);
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
                                message: response.response.data
                            });
                        }
                }
            });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h3>Name</h3>
            <input
                {...register("name", {
                    required: "Name is required",
                    maxLength: {
                        value: MAX_NAME_LENGTH_MODEL,
                        message: `Maximum name length has been exceeded (${MAX_NAME_LENGTH_MODEL})`
                    }
                })}
                type={"text"}
                placeholder={"model name"}
                onChange={(event) => setName(event.target.value)}
            />
            {errors.name && <div>{errors.name.message}</div>}

            <h3>Description</h3>
            <input
                {...register("description", {
                    required: "Description is required",
                    maxLength: {
                        value: MAX_DESCRIPTION_LENGTH_MODEL,
                        message: `Maximum description length has been exceeded (${MAX_NAME_LENGTH_MODEL}`
                    }
                })}
                type={"text"}
                placeholder={"This model was designed to..."}
                onChange={(event) => setDescription(event.target.value)}
            />
            {errors.description && <div>{errors.description.message}</div>}

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
                        primary25: "rgba(255,255,255,0.3)",
                        primary: "white",
                        neutral0: "rgba(255,255,255,0.075)",
                        neutral20: "white",
                        neutral40: "#BBBBBB",
                        neutral60: "#CCCCCC",
                        neutral80: "#AAAAAA",
                        primary50: "rgba(209,64,129,0.3)"
                    }
                })}
            />

            <span>
                <div>
                    <h3>Model Icon</h3>
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
                </div>
            </span>

            <motion.button disabled={isSubmitting} type={"submit"} whileHover={{scale: 1.1}} whileTap={{scale: 0.9}}>
                {isSubmitting ? "submitting model..." : "add new model"}
                <div>
                    <FaPlus />
                </div>
            </motion.button>
            {errors.root && <div>{errors.root.message}</div>}
        </form>
    );
}
