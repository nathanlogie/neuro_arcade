import React, { useState} from "react";
import {useForm} from "react-hook-form";
import {Button} from "./Button";

const onSubmit = (data) => {
    console.log(data);
}
let MAX_NAME_LENGTH = 64
let MAX_DESCRIPTION_LENGTH = 1024
const form = () => {
    const { register, handleSubmit } = useForm();

    return (
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
            <input {...register("name", {
                required:true,
                maxLength: MAX_NAME_LENGTH,
            })} type={"text"} placeholder={"Game Name"}/>

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
                pattern: "-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)",
                   })} type={"url"} />

            <input {...register("evaluationScript",{
                required:true
            })} type={"file"} />

            <button type={"submit"}>Submit</button>
        </form>
    );
};

export default form;