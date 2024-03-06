import React from "react";
import PropTypes from "prop-types";
import {DataGrid} from "@mui/x-data-grid";
import {RankedModel} from "../backendRequests";
import styles from "../styles/components/Table.module.css";
import {createTheme, ThemeProvider} from "@mui/material";
import {Link} from "react-router-dom";
import {Switcher} from "./Switcher";

/**
 * 
 * @param {Object} props
 * @param {RankedModel[]} props.inputData
 * @returns {JSX Element}

 */
export function HomePageTable({inputData}) {
    const [selectedSwitcherValue, setSelectedSwitcherValue] = React.useState("all");

    /**
     * @param selectedValue {string}
     */
    const handleSwitcherChange = (selectedValue) => {
        setSelectedSwitcherValue(selectedValue);
    };

    const columns = [
        {
            field: "name",
            width: 150,
            renderHeader: () => <strong>Player</strong>,
            renderCell: (params) => (
                <Link
                    to={"/all_players/" + params.value.replace(/\s+/g, "-").toLowerCase()}
                    style={{
                        color: "#FFFFFF",
                        textDecoration: "none"
                    }}
                >
                    {params.value}
                </Link>
            )
        },
        {field: "score", headerName: "Overall Score", width: 150, renderHeader: () => <strong>Overall score</strong>},
        {field: "is_AI", width: 150, type: "boolean", renderHeader: () => <strong>is AI?</strong>}
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
            is_AI: item.player.is_ai
        };
    });

    const table_theme = createTheme({
        palette: {
            mode: "dark"
        }
    });

    const switcher_labels = {
        table_headers: [{name: "AI Platforms"}, {name: "all"}, {name: "Humans"}]
    };

    const filteredRows =
        selectedSwitcherValue === "all"
            ? rows
            : selectedSwitcherValue === "AI Platforms"
              ? rows.filter((row) => row.is_AI)
              : selectedSwitcherValue === "Humans"
                ? rows.filter((row) => !row.is_AI)
                : rows;

    return (
        <div className={styles.TableContainer} id={styles["home"]}>
            <h2>Top Performers</h2>
            <div className={styles.TabSwitcher}>
                <Switcher data={switcher_labels} onSwitcherChange={handleSwitcherChange} switcherDefault={selectedSwitcherValue} />
            </div>
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
                    rows={filteredRows}
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
    inputData: PropTypes.array.isRequired
};
