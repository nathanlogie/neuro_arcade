import {useForm} from "react-hook-form";
import React, {useState} from "react";
import axios from "axios";

//Should be synced up to models
let MAX_NAME_LENGTH = 64
let MAX_DESCRIPTION_LENGTH = 1024

export const ModelForm = () => {
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting, touchedFields},
        setError,
        reset
    } = useForm()

    const [name, setName] = useState("")
    const [AIStatus, setAIStatus] = useState("")
    const [description, setDescription] = useState("")
    const [tags, setTags] = useState("")

    const onSubmit = (event) => {

        const formData = new FormData();
        formData.append("name", name)
        formData.append("description", description)

        //Again temporary until authentication is done
        formData.append("user", "http://localhost:8000/api/users/2/")

        //Converts the string value into an actual boolean value
        let boolAI = (AIStatus === 'true');
        formData.append("is_ai", boolAI)

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
                    setError("root", {message: "A game with that name already exists!"});
                } else {
                    setError("root", {
                        message: `Something went wrong... ${response.response.data}`
                    })
                }
            }
        });

    }

    return (
        <form className={"form"} onSubmit={handleSubmit(onSubmit)}>
            <h3>Name</h3>
            <input {...register("name", {
                required: "Name is required",
                maxLength: {
                    value: MAX_NAME_LENGTH,
                    message: `Maximum name length has been exceeded (${MAX_NAME_LENGTH})`
                }
            })}
                   type={"text"} placeholder={"Name!"}
                   onChange={(event) => setName(event.target.value)}
            />
            {errors.name && (
                <div className={"errorMessage"}>{errors.name.message}</div>
            )}

            <h3>Description</h3>
            <input {...register("description", {
                required: false,
                maxLength: {
                    value: MAX_DESCRIPTION_LENGTH,
                    message: "Maximum description length has been exceeded (${MAX_DESCRIPTION_LENGTH})"
                }
            })}
                   type={"text"} placeholder={"Description"}
                   onChange={(event) => setDescription(event.target.value)}
            />
            {errors.description && (
                <div className={"errorMessage"}>{errors.description.message}</div>
            )}

            <h3> IS AI? </h3>
            <select {...register("isAI", {
                required: "This field is required"
            })}
                    onChange={(event) => setAIStatus(event.target.value)}>
                <option value={"true"}>True</option>
                <option value={"false"}>False</option>
            </select>
            {errors.isAI && (
                <div className={"errorMessage"}>{errors.isAI.message}</div>
            )}

            <h3> Player Tags </h3>
            <input {...register("tags", {
                required: false
            })}
                   type={"text"} placeholder={"Game Tags"}
                   onChange={(event) => setTags(event.target.value)}
            />

            <br/>
            <button disabled={isSubmitting} type={"submit"}>
                {isSubmitting ? "Submitting form..." : "Submit!"}
            </button>
            {errors.root && (
                <div className={"errorMessage"}>{errors.root.message}</div>
            )}
        </form>
    )
};
