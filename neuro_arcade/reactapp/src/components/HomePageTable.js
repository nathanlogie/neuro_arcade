import React from 'react'
import PropTypes from 'prop-types'
import { DataGrid } from '@mui/x-data-grid';

export function HomePageTable() {


    const columns = [
        {field: 'id', headerName: 'ID', width: 90, hide: true},
        {field: 'name', headerName: 'AI Platform', width:150},
        {field: 'highest_task', headerName: 'Highest Scoring Task', width: 150},
        {field: 'best_benchmark', headerName: 'Best Benchmark', width: 150}
    ]

    const rows = [
        {id: 1, name: 'AI Platform 1', highest_task: 'task/3.6', best_benchmark: 'task/4.2'},
        {id: 2, name: 'AI Platform 2', highest_task: 'task/5.9', best_benchmark: 'task/2.7'},
        {id: 3, name: 'AI Platform 3', highest_task: 'task/9.2', best_benchmark: 'task/4.3'},
        {id: 4, name: 'AI Platform 4', highest_task: 'task/6.6', best_benchmark: 'task/4.7'},
        {id: 5, name: 'AI Platform 5', highest_task: 'task/1.6', best_benchmark: 'task/4.2'},
    ]

    return(
        <div className={'TableContainer'}>
            <div className={'HomePageTable'}>
            <DataGrid
                sx={{
                    color: '#FFFFFF',
                    fill: '#FFFFFF'
                }}
                rows={rows}
                columns={columns}
                pageSizeOptions={[5]}
                disableRowSelectionOnClick
                getRowStyle={getRowStyle}
            />
            </div>
        </div>
    )
}

//Needs to get input data as currently using demonstration data
// HomePageTable.propTypes = {
//     inputData: PropTypes.object.isRequired,
// }
