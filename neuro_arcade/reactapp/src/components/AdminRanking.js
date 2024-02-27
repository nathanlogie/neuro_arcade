import Rating from '@mui/material/Rating';
import {useState} from "react";
import {postAdminRanking, isLoggedIn, userIsAdmin} from "../backendRequests";

/**
 *
 * @param game - id of game to rank
 * @param rating - current ranking of the game
 * @returns {JSX.Element}
 */
export function AdminRanking({game, rating}){

    const [value, setValue] = useState(rating/10)

    async function handleChange(e, newValue) {
        setValue(newValue);
        await postAdminRanking(game, newValue);
    }

    return (
        <>
            {isLoggedIn() && userIsAdmin() ?
                <Rating
                    name="half-rating customized-10"
                    value = {value}
                    onChange = {handleChange}
                    precision={0.5}
                    max={10}
                />
                 :
                 <Rating
                     name="half-rating customized-10"
                     value = {value}
                     precision={0.5}
                     max={10}
                     readOnly
                 />
             }
        </>
    )

}