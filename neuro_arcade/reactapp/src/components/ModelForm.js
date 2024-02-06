import {useForm} from "react-hook-form";
import React, {useState} from "react";
import axios from "axios";

let MAXNAMELENGTH = 64
export const ModelForm = () => {
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting, touchedFields},
        setError,
        reset
    } = useForm()

    const [name, setName] = useState("")
    const [AIStatus, setAIStatus] = useState(false)
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
                    value: MAXNAMELENGTH,
                    message: `Maximum name length has been exceeded (${MAXNAMELENGTH})`
                }
            })}
                type={"text"} placeholder={"Name!"}
            />
            {errors.name && (
                <div className={"errorMessage"}>{errors.name.message}</div>
            )}


        </form>
    )
};
