import React, {useEffect, useState} from "react";
import {SCORE_EXTENSION} from "./variableHelper";
import {useForm} from "react-hook-form";
import {motion} from "framer-motion";
import {LuFileJson} from "react-icons/lu";
import {FaPlus, FaTrash} from "react-icons/fa6";
import {getUser, requestUserPlayers} from "../../backendRequests";
import makeAnimated from "react-select/animated";
import Select from "react-select";


const customStyles = {
    option: provided => ({...provided, color: 'white'}),
    control: provided => ({...provided, color: 'black', backgroundColor: 'rgba(255, 255, 255, 0.2)', border: 'none', borderRadius: '0.5em'}),
    valueContainer: provided => ({...provided, height: 'max-content'}),
    placeholder: provided => ({...provided, color: '#CCCCCC', textAlign: 'left', fontSize: '0.9em', paddingLeft: '1em'}),
    input: provided => ({...provided, color: '#FFFFFF', paddingLeft: '1em', fontSize: '0.9em'}),
    menu: provided => ({...provided, borderRadius: '0.5em', position: 'relative'})
}

export function ScoreForm(){
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
        setError,
        reset,
    } = useForm();

    const user = getUser().id

    const [scores, setScores] = useState([]);
    const [filenames, setFilenames] = useState([])
    const [players, setPlayers] = useState([])
    const [selectedPlayer, setSelectedPlayer] = useState(null)
    const [options, setOptions] = useState([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        requestUserPlayers(user)
            .then((response) => {
                setPlayers(response)
            })

    },[])

    useEffect(() => {
        players.forEach((player) => {
            options.push({
                value: player.id,
                label: player.name
            })
        })
        setLoading(false);
    })

    function removeScore(index){
        scores.splice(index, 1);
        filenames.splice(index, 1);
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
            <Select
                isClearable
                onChange={(current) => setSelectedPlayer(current)}
                value={selectedPlayer}
                options={options}
                components={makeAnimated()}
                styles={customStyles}
                placeholder={"Select Player..."}
                isLoading={loading}
                theme={(theme) => ({
                    ...theme,
                    colors: {
                        ...theme.colors,
                        primary25: 'rgba(255,255,255,0.3)',
                        primary: 'white',
                        neutral0: 'rgba(255,255,255,0.075)',
                        neutral20: 'white',
                        neutral40: '#BBBBBB',
                        neutral60: '#CCCCCC',
                        neutral80: '#AAAAAA',
                        primary50: 'rgba(209,64,129,0.3)'
                    },
                })}
            />
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