import React, {useEffect, useState} from "react";
import {SCORE_EXTENSION, customStyles} from "./formHelper";
import {useForm} from "react-hook-form";
import {motion} from "framer-motion";
import {LuFileJson} from "react-icons/lu";
import {FaPlus, FaTrash} from "react-icons/fa6";
import {getUser, requestUserPlayers, postUnprocessedResults} from "../../backendRequests";
import makeAnimated from "react-select/animated";
import Select from "react-select";
import {useParams} from "react-router-dom";

// https://stackoverflow.com/questions/23344776/how-to-access-data-of-uploaded-json-file
async function parseJsonFile(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = (event) => resolve(JSON.parse(event.target.result));
        fileReader.onerror = (error) => reject(error);
        fileReader.readAsText(file);
    });
}

/**
 *
 * @returns {JSX.Element} score upload form
 * @constructor builds form
 */
export function ScoreForm() {
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
        setError
    } = useForm();

    let [scores, setScores] = useState([]);
    let [filenames, setFilenames] = useState([]);
    const [players, setPlayers] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(getUser);
    let gameSlug = useParams().game_slug;
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        requestUserPlayers(user.id).then((response) => {
            setPlayers(response);
        });
        setLoading(false);
    }, []);

    function removeScore(e, index) {
        let temp = [...scores];
        let temp2 = [...filenames];
        temp.splice(index, 1);
        temp2.splice(index, 1);
        setScores(temp);
        setFilenames(temp2);
    }

    function handleScores(e) {
        const files = e.target.files;
        console.log(files)
        const acceptedFormats = SCORE_EXTENSION;

        for (const f of files){
            const fileExtension = f.name.split(".").pop().toLowerCase();
            if (!acceptedFormats.includes(fileExtension)) {
                setError("root", {message: "Invalid file type provided"});
            } else if (filenames.includes(f.name)) {
                setError("root", {message: "Duplicate file"});
            } else {
                setError("root", null);
                scores.push(f);
                filenames.push(f.name);
            }
        }
    }

    async function onSubmit() {
        if (scores.length === 0 || selectedPlayer === null) {
            setError("root", {message: "Missing Fields"});
            return;
        }

        setError("root", null);

        let counter = 0;
        for (const scoreFile of scores) {
            let jsonData = await parseJsonFile(scoreFile);
            await postUnprocessedResults(jsonData, gameSlug, selectedPlayer.label)
                .then(() => {
                    counter++;
                })
                .catch((error) => {
                    console.log(error.response);
                    setError("root", {message: "An error occurred while uploading " + scoreFile.name});
                });
        }

        if (counter === scores.length) {
            setSuccessMessage("Scores uploaded successfully!");
            setSelectedPlayer(null);
            setScores([]);
            setFilenames([]);
        }
    }

    if (loading) {
        return <>...</>;
    }

    return (
        <form>
            <Select
                isClearable
                onChange={(current) => setSelectedPlayer(current)}
                value={selectedPlayer}
                options={players.map((player) => ({value: player.name, label: player.name}))}
                components={makeAnimated()}
                styles={customStyles}
                placeholder={"Select Player..."}
                isLoading={loading}
                theme={(theme) => ({
                    ...theme,
                    colors: {
                        ...theme.colors,
                        primary25: "rgba(255,255,255,0.3)",
                        primary: "black",
                        neutral0: "rgba(255,255,255,0.075)",
                        neutral20: "white",
                        neutral40: "#BBBBBB",
                        neutral60: "#CCCCCC",
                        neutral80: "#AAAAAA",
                        primary50: "rgba(209,64,129,0.3)"
                    }
                })}
            />
            <span>
                <motion.div whileHover={{scale: 1.1}} whileTap={{scale: 0.9}}>
                    <label htmlFor={"score"}>
                        <p>Upload json file</p>
                        <div>
                            <LuFileJson />
                        </div>
                    </label>
                    <input
                        id={"score"}
                        {...register("score", {
                            required: "Score must be uploaded"
                        })}
                        type={"file"}
                        onChange={handleScores}
                        multiple={"multiple"}
                    />
                </motion.div>
                {errors.score ? <div>{errors.score.message}</div> : null}
                <ul>
                    {filenames.map((file, index) => (
                        <li>
                            <label>{file}</label>
                            <motion.button onClick={(e) => removeScore(e, index)} whileHover={{scale: 1.1}} whileTap={{scale: 0.9}}>
                                <div>
                                    <FaTrash />
                                </div>
                            </motion.button>
                        </li>
                    ))}
                </ul>
            </span>

            <motion.button disabled={isSubmitting} onClick={handleSubmit(onSubmit)} whileHover={{scale: 1.1}} whileTap={{scale: 0.9}}>
                {isSubmitting ? "Submitting Scores..." : "Submit Scores"}
                <div>
                    <FaPlus />
                </div>
            </motion.button>
            {errors.root ? errors.root.message : successMessage}
        </form>
    );
}
