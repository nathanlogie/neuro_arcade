import React from 'react'
import PropTypes from 'prop-types'
import {DataGrid} from '@mui/x-data-grid';
import styles from '../styles/components/TableGraph.module.css';
import {createTheme, ThemeProvider} from "@mui/material";

/**
 * 
 * @param {Object} props
 * @param {PlayerScores} props.inputData
 * @returns {JSX Element}
 */
export function PlayerViewTable({inputData}) {

    
    if(!inputData){
        return(
            <h2>No Data</h2>
        );
    }

    const columns = [
        {
            field: 'game',
            width: 150,
            /**
             * bold title
             * @returns  {JSX Element}
             */
            renderHeader: function() {
                return (
                    <strong>
                        Game
                    </strong>
                );
            },
        },
    ];
    

    const scoreTypes = new Set();
    /**
     * iterates through inputData and then iterates through its value. It then adds the score type to the set in lowercase
     * @param entry {Element from inputData} 
     */
    inputData.forEach(function(entry) {
        const value = entry.value;
        /**
         * for each value the score type is added to scoreTypes set in lowercase
         * @param key {Key from the Value Object}
         */
        Object.keys(value).forEach(function(key) {
            scoreTypes.add(key.toLowerCase());
        });
    });
    

    /**
     * iterates through each score type and adds it to columns with all required fields
     */
    scoreTypes.forEach(function(scoreType) {
        columns.push({
            field: scoreType.toLowerCase(),
            headerName: scoreType.charAt(0).toUpperCase() + scoreType.slice(1),
            width: 90,
            /**
             * bold title in upercase form
             * @returns {JSX Element}
             */
            renderHeader: function() {
                return (
                    <strong>
                        {scoreType.charAt(0).toUpperCase() + scoreType.slice(1)}
                    </strong>
                );
            },
        });
    });

    /**
     * mapping game name to its data
     * @param item {Object}
     * @param index {integer}
     * @returns {Object}
     **/
    const rows = inputData.map(function(item, index) {
        const row = {
            id: index + 1,
            game: item.game_name,
        };
        /**
         * adds each score to its scoretype
         * @param acc {Object}
         * @param entry {Array}
         * @returns {Object}
         */
        Object.entries(item.value).reduce(function(acc, entry) {
            const [key, value] = entry;
            const scoreType = key.toLowerCase();
            acc[scoreType] = value;
            return acc;
        }, row);
    
        return row;
    });

    const table_theme = createTheme({
      palette: {
          mode: 'dark',
      },
    });

    return(
        <div className={styles.TableContainer} id={styles['home']}>
            <h2>Game Scores</h2>
            <ThemeProvider theme={table_theme}>
                <DataGrid
                    sx={{
                        boxShadow: 2,
                        border: 2,
                        color: 'white',
                        borderColor: 'rgba(0,0,0,0)',
                        '& .MuiDataGrid-cell:hover': {
                          color: 'white',
                        },
                        height: '100%',
                        width: '32.5em',
                        fontFamily: 'inherit'
                    }}
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 5,
                            },
                        },
                    }}
                    pageSizeOptions={[5]}
                    disableRowSelectionOnClick
                />
            </ThemeProvider>
        </div>
    )
}

PlayerViewTable.propTypes = {
    inputData: PropTypes.array.isRequired,
}
