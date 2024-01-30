import React from "react";
import {useForm} from "react-hook-form";
import {postGame} from "../backendRequests";

let MAX_NAME_LENGTH = 64
let MAX_DESCRIPTION_LENGTH = 1024
let ACCEPTED_SCORE_FILE = ['json']
let ACCEPTED_EVAL_SCRIPT = ['py']

export const Form = () => {
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
        setError,} = useForm();

    // const onSubmit = async (data) => {
    //     try{
    //         await new Promise((resolve)=> setTimeout(resolve, 1000));
    //         console.log(data);
    //     } catch(error){
    //         setError("root", {
    //             message: "Something went wrong...",
    //         })
    //     }
    // };

    const onSubmit = async (event) => {
        const formData = new FormData(event.target);
        const data = {
            name: formData.get("name"),
            description : formData.get("description"),
            icon : formData.get("icon"),
            tags : formData.get("tags"),
            scoreTypes : formData.get("scoreTypes"),
            playLink : formData.get("playLink"),
            evaluationScript : formData.get("evaluationScript")
        };

        try {
            // const response = await fetch('/api/submit-data', {
            //     method: 'POST',
            //     body: JSON.stringify(data),
            //     headers: {'Content-Type': 'application/json'},
            // });
            const response = await postGame(data)
        }
        catch (error) {
            setError("root", {message: "Something went wrong..."})
        }


    };

    return (
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
            <h3>Name</h3>
            <input {...register("name", {
                required: "Name is required",
                maxLength: {
                    value: MAX_NAME_LENGTH,
                    message: `Maximum game title length has been exceeded (${MAX_NAME_LENGTH})`,
                }
            })} type={"text"} placeholder={"Game Name"}/>
            {errors.name && (
                <div className={"text-red-500"}>{errors.name.message}</div>
            )}


            <h3>Description</h3>
            <input {...register("description", {
                required: "A description is required",
                maxLength: {
                    value: MAX_DESCRIPTION_LENGTH,
                    message: `Maximum description length has been exceeded (${MAX_DESCRIPTION_LENGTH})`,
                }
            })} type={"text"} placeholder={"Game Description"}/>
            {errors.description && (
                <div className={"text-red-500"}>{errors.description.message}</div>
            )}

            <h3>Game Icon</h3>
            <input {...register("icon", {
                required: false,
            })} type={"image"}/>

            <h3>Game Tags</h3>
            <input {...register("tags", {
                required: false
            })} type={"text"} placeholder={"Game Tags"}/>

            <h3>Score Types</h3>
            <input {...register("scoreTypes", {
                required: "Score types must be uploaded",
                validate: (value) => {
                    const acceptedFormats = ACCEPTED_SCORE_FILE;
                    const fileExtension = value[0]?.name.split('.').pop().toLowerCase();
                    console.log(fileExtension);
                    if (!acceptedFormats.includes(fileExtension)) {
                        return `Error: Invalid file type provided ${fileExtension}`
                    }
                    return true;
                }
            })} type={"file"}/>
            {errors.scoreTypes && (
                <div className={"text-red-500"}>{errors.scoreTypes.message}</div>
            )}

            <h3>Play Link</h3>
            <input {...register("playLink", {
                required: "A Play link must be provided",
                // pattern: {
                //     value: https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*),
                //     message: "Invalid URL Provided"
                // validate: (value) => {
                //     let validateURL = new RegExp(
                //         '[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)\n'
                //     )
                //     if (!validateURL.test(value)) {
                //         return "Invalid URL Provided";
                //      }
                //     return true;
                // }
            })} type={"url"} placeholder={"Play Link"}/>
            {errors.playLink && (
                <div className={"text-red-500"}>{errors.playLink.message}</div>
            )}

            <h3>Evaluation Script</h3>
            <input {...register("evaluationScript", {
                required: "An Evaluation Script must be uploaded",
                validate: (value) => {
                    const acceptedFormats = ACCEPTED_EVAL_SCRIPT;
                    const fileExtension = value[0]?.name.split('.').pop().toLowerCase();
                    if (!acceptedFormats.includes(fileExtension)) {
                        return "Error: Invalid file type provided"
                    }
                    return true;
                }
            })} type={"file"}/>
            {errors.evaluationScript && (
                <div className={"text-red-500"}>{errors.evaluationScript.message}</div>
            )}


            <br/>
            <button disabled={isSubmitting} type={"submit"}>
                {isSubmitting ? "Submitting form..." : "Submit!"}
            </button>
            {errors.root && (
                <div className={"text-red-500"}>{errors.root.message}</div>
            )}
        </form>
    );
};
