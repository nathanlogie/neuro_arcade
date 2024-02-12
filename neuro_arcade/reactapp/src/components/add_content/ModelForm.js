import {useForm} from "react-hook-form";
import React, {useState} from "react";
import axios from "axios";
import {motion} from "framer-motion";
import {FaPlus} from "react-icons/fa6";

//Should be synced up to models
let MAX_NAME_LENGTH = 64
let MAX_DESCRIPTION_LENGTH = 1024

export function ModelForm(){
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting, touchedFields},
        setError,
        reset
    } = useForm()

    const [name, setName] = useState("")
    const [aiStatus, setAiStatus] = useState("")
    const [description, setDescription] = useState("")
    const [tags, setTags] = useState("")

    const onSubmit = (event) => {

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);

        //Again temporary until authentication is done
        formData.append("user", "http://localhost:8000/api/users/2/");

        formData.append("is_ai", true);

        axios({
            //I will move a lot of this stuff to backend requests to centralize it in a future merge request
            method: "post",
            url: "http://127.0.0.1:8000/api/players/",
            data: formData,
            headers: {"Content-Type": "multipart/form-data"},
        }).then(function (response) {
            console.log(response);
            reset()
            setError("root", {message: "Form Submitted Successfully"})
        }).catch(function (response) {
            console.log(response)
            if (!response) {
                setError("root", {message: "No response from server"});

            } else {
                if (response.response.data.includes("IntegrityError")) {
                    setError("root", {message: "A model with that name already exists!"});
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
            <input {...register("tags", {
                required: false
            })}
                   type={"text"} placeholder={"example1, example2, example3, ..."}
                   onChange={(event) => setTags(event.target.value)}
            />

            <motion.button
                disabled={isSubmitting}
                type={"submit"}
                whileHover={{scale: 1.1}}
                whileTap={{scale: 0.9}}
            >
                {isSubmitting ? "submitting model..." : "add new model"}
                <div>
                    <FaPlus />
                </div>
            </motion.button>
            {errors.root && (
                <div>{errors.root.message}</div>
            )}
        </form>
    )
}
