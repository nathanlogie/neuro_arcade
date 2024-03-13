import Rating from "@mui/material/Rating";
import {useState} from "react";
import {postAdminRanking, isLoggedIn, userIsAdmin} from "../backendRequests";
import {createTheme, ThemeProvider} from "@mui/material";

/**
 *
 * @param game - id of game to rank
 * @param rating - current ranking of the game
 * @returns {JSX.Element}
 */
export function AdminRanking({game, rating}) {
    const [value, setValue] = useState(rating / 10);

    async function handleChange(e, newValue) {
        setValue(newValue);
        await postAdminRanking(game, newValue);
    }

    const table_theme = createTheme({
        palette: {
            mode: "dark"
        }
    });

    return (
        <>
            {isLoggedIn() && userIsAdmin() ? (
                <ThemeProvider theme={table_theme}>
                    <Rating
                        sx={{
                            backgroundColor: 'rgba(255,255,255,0.15)',
                            borderRadius: '0.75em',
                            padding: '0.5em',
                            color: '#79FFB7',
                        }}
                        name='half-rating customized-10' value={value} onChange={handleChange} precision={0.5} max={10} />
                </ThemeProvider>
            ) : (
                <ThemeProvider theme={table_theme}>
                    <Rating
                        sx={{
                            backgroundColor: 'rgba(255,255,255,0.15)',
                            borderRadius: '0.75em',
                            padding: '0.5em',
                            color: '#79FFB7',
                        }}
                        name='half-rating customized-10' value={value} precision={0.5} max={10} readOnly />
                </ThemeProvider>
            )}
        </>
    );
}
