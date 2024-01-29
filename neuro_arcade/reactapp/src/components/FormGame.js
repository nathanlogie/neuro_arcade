import React from "react";
import {useForm} from "react-hook-form";

let MAX_NAME_LENGTH = 64
let MAX_DESCRIPTION_LENGTH = 1024
export const Form = () => {
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
        setError,} = useForm();

    const onSubmit = async (data) => {
        try{
            await new Promise((resolve)=> setTimeout(resolve, 1000));
            console.log(data);
        } catch(error){
            setError("root", {
                message: "Something went wrong...",
            })
        }
    };

    return (
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
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

            <br/> <br/>


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
            <br/> <br/>


            <input {...register("icon", {
                required: false,
            })} type={"image"}/>
            <br/> <br/>

            <input {...register("tags", {
                required: false
            })} type={"text"} placeholder={"Game Tags"}/>
            <br/> <br/>

            <input {...register("scoreTypes", {
                required: "Score types must be uploaded",
                validate: (value) => {
                    const acceptedFormats = ['.json'];
                    const fileExtension = value[0]?.name.split('.').pop().toLowerCase();
                    if(!acceptedFormats.includes(fileExtension)){
                        return 'Error: Invalid file type provided'
                    }
                    return true;
                }
            })} type={"file"}/>
            {errors.scoreTypes && (
                <div className={"text-red-500"}>{errors.scoreTypes.message}</div>
            )}
            <br/> <br/>

            <input {...register("playLink", {
                required: "A Play link must be provided",
                // pattern: "-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)",
            })} type={"url"} placeholder={"Play Link"}/>
            {errors.scoreTypes && (
                <div className={"text-red-500"}>{errors.scoreTypes.message}</div>
            )}
            <br/> <br/>

            <input {...register("evaluationScript", {
                required: "An Evaluation Script must be uploaded",
                validate: (value) => {
                    const acceptedFormats = ['.py'];
                    const fileExtension = value[0]?.name.split('.').pop().toLowerCase();
                    if(!acceptedFormats.includes(fileExtension)){
                        return "Error: Invalid file type provided"
                    }
                    return true;
                }
            })} type={"file"}/>

            <br/> <br/>


            <button disabled={isSubmitting} type={"submit"}>
                {isSubmitting ? "Submitting form..." : "Submit!"}
            </button>
            <br/> <br/>
            {errors.root && (
                <div className={"text-red-500"}>{errors.root.message}</div>
            )}
        </form>
    );
};
