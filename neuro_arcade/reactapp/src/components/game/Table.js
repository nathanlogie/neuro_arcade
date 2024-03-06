import React from "react";
import PropTypes from "prop-types";
import {Switcher} from "../Switcher";
import {DataGrid} from "@mui/x-data-grid";
import styles from "../../styles/components/Table.module.css";
import {createTheme, ThemeProvider} from "@mui/material";
import {Link} from "react-router-dom";

/**
 * @param inputData {Object}
 * @returns {Element}
 * @constructor
 */
export function Table({inputData}) {
    const [selectedSwitcherValue, setSelectedSwitcherValue] = React.useState("all");

    /**
     * @param selectedValue {string}
     */
    const handleSwitcherChange = (selectedValue) => {
        setSelectedSwitcherValue(selectedValue);
    };

    const columns = [
        {
            field: "player",
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
        ...inputData.table_headers.map((header) => ({
            field: header.name.toLowerCase(),
            headerName: header.name,
            type: header.type === "int" ? "number" : "float",
            width: 100,
            renderHeader: () => <strong>{header.name}</strong>
        })),
        {field: "is_AI", headerName: "Is AI?", type: "boolean", width: 100, renderHeader: () => <strong>is AI?</strong>}
    ];

    const rows = inputData.rows.map((row, index) => ({
        id: index + 1,
        player: row.player_name,
        ...row.score.reduce((acc, score, scoreIndex) => {
            const columnName = inputData.table_headers[scoreIndex].name.toLowerCase();
            return {...acc, [columnName]: score};
        }, {}),
        is_AI: row.is_ai
    }));

    const getRowStyle = (params) => {
        return {
            backgroundColor: "#f0f0f0"
        };
    };

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

    const table_theme = createTheme({
        palette: {
            mode: "dark"
        }
    });

    return (
        <div className={styles.TableContainer}>
            <h2>Leaderboards</h2>
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
                        width: "33em",
                        fontFamily: "inherit"
                    }}
                    rows={filteredRows}
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
                    getRowStyle={getRowStyle}
                />
            </ThemeProvider>
        </div>
    );
}

Table.propTypes = {
    inputData: PropTypes.object.isRequired
};
