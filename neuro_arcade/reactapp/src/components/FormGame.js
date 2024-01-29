import React from "react";
import {useForm} from "react-hook-form";
import {Button} from "./Button";



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
                required: "Name is required:",
                maxLength: {
                    value: MAX_NAME_LENGTH,
                    message: `Maximum game title length has been exceeded ${MAX_NAME_LENGTH}`,
                }
            })} type={"text"} placeholder={"Game Name"}/>
            {errors.name && (
                <div className={"text-red-500"}>{errors.name.message}</div>
            )}


            <input {...register("description",{
                required:true,
                maxLength: MAX_DESCRIPTION_LENGTH,
            })} type={"text"} placeholder={"Game Description"}/>

            <input {...register("icon",{
                required:false,
            })} type={"image"} />

            <input {...register("tags",{
                required:false
            })} type={"text"} placeholder={"tags"}/>

            <input {...register("scoreTypes",{
                required:true
                // validate: (value) => value.includes(".json")
            })} type={"file"} />

            <input {...register("playLink",{
                required:true,
                // pattern: "-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)",
           })} type={"url"} />

            <input {...register("evaluationScript",{
                required:true
            })} type={"file"} />

            <Button disabled={isSubmitting} type={"submit"}>
                {isSubmitting ? "Submitting form..." : "Submit!"}
            </Button>

            {errors.root && (
                <div className={"text-red-500"}>{errors.root.message}</div>
            )}
        </form>
    );
};
