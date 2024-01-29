import React, { useState} from "react";
import {useForm} from "react-hook-form";

const onSubmit = (data) => {
    console.log(data);
}

const form = () => {
    const { register, handleSubmit } = useForm();
    return (
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
            <input {...register("name", {
                required:true,
            })} type={"text"} placeholder={"Game Name"}/>

            <input {...register("description")} type={"text"} placeholder={"Game Description"}/>
            <input {...register("icon")} type={"image"} />
            <input {...register("tags")} type={"text"} placeholder={"tags"}/>
            <input {...register("scoreTypes")} type={"file"} />
            <input {...register("playLink")} type={"url"} />
            <input {...register("evaluationScript")} type={"file"} />
            <button type={"submit"}>Submit</button>
        </form>
    );
};

export default form;