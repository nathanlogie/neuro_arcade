import {useForm} from "react-hook-form";
import React, {useState} from "react";
import axios from "axios";

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

    const onSubmit = (event) => void {

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
            />
            {errors.description && (
                <div className={"errorMessage"}>{errors.description.message}</div>
            )}

            <h3> IS AI? </h3>
            <select {...register("isAI", {
                required: "This field is required"
            })}>
                <option value={"true"}>True</option>
                <option value={"false"}>False</option>
            </select>
            {errors.isAI && (
                <div className={"errorMessage"}>{errors.isAI.message}</div>
            )}

            <h3> Player Tags </h3>
            <input {...register("tags", {
                required: false
            })} type={"text"} placeholder={"Game Tags"}
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
