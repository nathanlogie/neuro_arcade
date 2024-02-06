import {useForm} from "react-hook-form";
import React, {useState} from "react";
import axios from "axios";

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
    
};
