import {useForm} from "react-hook-form";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {motion} from "framer-motion";
import {FaPlus} from "react-icons/fa6";
import CreatableSelect from 'react-select/creatable';
import {requestPlayerTags} from "../../backendRequests";
import slugify from 'react-slugify';
import makeAnimated from 'react-select/animated';

//Should be synced up to models
let MAX_NAME_LENGTH = 64
let MAX_DESCRIPTION_LENGTH = 1024

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
    } = useForm()

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    let [tags, setTags] = useState([])
    const [existingTags, setExistingTags] = useState([])
    const [options, setOptions] = useState([])

    useEffect(() => {
        requestPlayerTags()
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

        //Again temporary until authentication is done
        formData.append("user", 1);

        formData.append("is_ai", true);

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
