import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import {useState} from "react";
import {postAdminRanking, isLoggedIn, userIsAdmin} from "../backendRequests";

export function AdminRanking({game, rating}){

    const [value, setValue] = useState(rating/10)

    async function handleChange(e, newValue) {
        setValue(newValue)
        await postAdminRanking(game, newValue)
            .then((response) => {
                    console.log(response);
                }
            )
            .catch((error) => {
                console.log(error);
            })
    }

    return (
        <>
              <Typography component="legend">Admin Ranking</Typography>
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