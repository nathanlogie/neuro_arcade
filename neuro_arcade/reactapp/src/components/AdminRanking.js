import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Typography from '@mui/material/Typography';

export function AdminRanking({game}){

    return (
        <form>
              <Typography component="legend">10 stars</Typography>
              <Rating name="half-rating customized-10" defaultValue={2} precision={0.5} max={10} />
        </form>
    )

}