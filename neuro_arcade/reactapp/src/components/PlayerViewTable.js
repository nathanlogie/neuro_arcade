import React from "react";
import PropTypes from "prop-types";
import {DataGrid} from "@mui/x-data-grid";
import styles from "../styles/components/Table.module.css";
import {createTheme, ThemeProvider} from "@mui/material";

/**
 *
 * @param {Object} props
 * @param {PlayerScores} props.inputData
 * @returns {JSX Element}
 */
export function PlayerViewTable({inputData}) {
    if (!inputData) {
        return <h2>No Data</h2>;
    }

    const columns = [
        {
            field: "game",
            width: 150,
            /**
             * bold title
             * @returns  {JSX Element}
             */
            renderHeader: function () {
                return <strong>Game</strong>;
            }
        }
    ];

    /**
     * iterates through inputData and then iterates through its value. It then adds the score type to the set in lowercase
     * @param entry {Object}
     */
    const scoreTypes = new Set();
    inputData.forEach(function (entry) {
        const value = entry.value;
        Object.keys(value).forEach(function (key) {
            scoreTypes.add(key.toLowerCase());
        });
    });

    /**
     * iterates through each score type and adds it to columns with all required fields
     * @param {Object}
     */
    scoreTypes.forEach(function (scoreType) {
        columns.push({
            field: scoreType.toLowerCase(),
            headerName: scoreType.charAt(0).toUpperCase() + scoreType.slice(1),
            width: 90,
            /**
             * bold title in upercase form
             * @returns {JSX Element}
             */
            renderHeader: function () {
                return <strong>{scoreType.charAt(0).toUpperCase() + scoreType.slice(1)}</strong>;
            }
        });
    });

    /**
     * mapping game name to its data
     * @param item {Object}
     * @param index {integer}
     * @returns {Object}
     **/
    const rows = inputData.map(function (item, index) {
        return {
            id: index + 1,
            game: item.game_name,
            ...Object.entries(item.value).reduce((acc, [key, value]) => ({...acc, [key.toLowerCase()]: value}), {})
        };
    });

    const table_theme = createTheme({
        palette: {
            mode: "dark"
        }
    });

    return (
        <div className={styles.TableContainer} id={styles["home"]}>
            <h2>Game Scores</h2>
            <ThemeProvider theme={table_theme}>
                <DataGrid
                    sx={{
                        boxShadow: 2,
                        border: 2,
                        color: "white",
                        borderColor: "rgba(0,0,0,0)",
                        "& .MuiDataGrid-cell:hover": {
                            color: "white"
                        },
                        height: "100%",
                        width: "32.5em",
                        fontFamily: "inherit"
                    }}
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 7
                            }
                        }
                    }}
                    pageSizeOptions={[7]}
                    disableRowSelectionOnClick
                />
            </ThemeProvider>
        </div>
    );
}

PlayerViewTable.propTypes = {
    inputData: PropTypes.array.isRequired
};
