import React from "react";
import PropTypes from "prop-types";
import {DataGrid} from "@mui/x-data-grid";
import {RankedModel} from "../backendRequests";
import styles from "../styles/components/TableGraph.module.css";
import {createTheme, ThemeProvider} from "@mui/material";

/**
 * 
 * @param {Object} props
 * @param {RankedModel[]} props.inputData
 * @returns {JSX Element}

 */
export function HomePageTable({inputData}) {
    if (!inputData) {
        return <h2>No Data</h2>;
    }

    const columns = [
        {field: "name", width: 150, renderHeader: () => <strong>AI Platform</strong>}, //TODO render link to AI description page
        {field: "score", headerName: "Overall Score", width: 150, renderHeader: () => <strong>Overall Score</strong>},
        {field: "owner", width: 150, renderHeader: () => <strong>Owner</strong>} // TODO show user instead of ID
    ];

    /**
     * @param item {Object}
     * @param index {integer}
     * @returns {Object}

     * uses the top performers data and maps it to a row object
     */
    const rows = inputData.map(function (item, index) {
        return {
            id: index + 1,
            name: item.player.name,
            score: item.overall_score.toFixed(1),
            owner: item.player.user,
            description: item.player.description
        };
    });

    const table_theme = createTheme({
        palette: {
            mode: "dark"
        }
    });

    return (
        <div className={styles.TableContainer} id={styles["home"]}>
            <h2>Top Performers</h2>
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
                        width: "32.5em"
                    }}
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 5
                            }
                        }
                    }}
                    pageSizeOptions={[5]}
                    disableRowSelectionOnClick
                />
            </ThemeProvider>
        </div>
    );
}

HomePageTable.propTypes = {
    inputData: PropTypes.object.isRequired
};
