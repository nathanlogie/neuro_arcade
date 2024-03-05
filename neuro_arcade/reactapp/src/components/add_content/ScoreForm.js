import React, {useState} from "react";
import {SCORE_EXTENSION} from "./variableHelper";
import {useForm} from "react-hook-form";
import {motion} from "framer-motion";
import {LuFileJson} from "react-icons/lu";
import {FaPlus, FaTrash} from "react-icons/fa6";


export function ScoreForm(){
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
        setError,
        reset,
    } = useForm();

    const [scores, setScores] = useState([]);
    const [filenames, setFilenames] = useState([])

    function removeScore(index){
        console.log("Removing Score at index ", index, "...");
        scores.splice(index, 1);
        filenames.splice(index, 1);
        console.log("File Removed")
    }

    function handleScores(e){
        const file = e.target.files[0];
        const acceptedFormats = SCORE_EXTENSION;
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (!acceptedFormats.includes(fileExtension)) {
            setError("score", {message: "Invalid file type provided"})
        } else if (filenames.includes(file.name)){
            setError("duplicate", {message: "Duplicate file"})
        }
        else {
            setError("score", null)
            setError("duplicate", null)
            scores.push(file)
            filenames.push(file.name)
        }
    }

    function onSubmit(e){
        e.preventDefault
    }


    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            { errors.duplicate ? errors.duplicate.message : null }
            <span>
                <motion.div
                    whileHover={{scale: 1.1}}
                    whileTap={{scale: 0.9}}
                >
                    <label htmlFor={'score'}>
                        <p>
                            Upload json file
                        </p>
                        <div>
                            <LuFileJson/>
                        </div>
                    </label>
                    <input id={'score'} {...register("score", {
                        required: "Score types must be uploaded"
                    })} type={"file"} onChange={handleScores}/>
                </motion.div>
                {errors.score ? (
                        <div>{errors.score.message}</div>
                    ) : null}
                <ul>
                    { filenames.map((file, index) => (
                            <li>
                                <p>{file}</p>
                                <motion.button
                                    onClick={() => removeScore(index)}
                                    whileHover={{scale: 1.1}}
                                    whileTap={{scale: 0.9}}
                                >
                                    <div>
                                        <FaTrash/>
                                    </div>
                                </motion.button>
                            </li>
                    ))}
                </ul>
            </span>
            <motion.button
                disabled={isSubmitting}
                type={"submit"}
                whileHover={{scale: 1.1}}
                whileTap={{scale: 0.9}}
            >
                {isSubmitting ? "Submitting Scores..." : "Submit Scores"}
                <div>
                    <FaPlus/>
                </div>
            </motion.button>
        </form>
    );

}