import React from 'react'
import PropTypes from 'prop-types'
import {DataGrid} from '@mui/x-data-grid';
import {RankedModel} from '../backendRequests';

/**
 * 
 * @param {Object} props
 * @param {RankedModel[]} props.inputData
 * @returns {JSX Element}

 */
export function HomePageTable({inputData}) {

    if(!inputData){
        return(
            <h2>No Data</h2>
        );
    }

    const columns = [
        {field: 'id', headerName: 'ID', width: 90, hide: true},
        {field: 'name', headerName: 'AI Platform', width:150},
        {field: 'score', headerName: 'Overall Score', width:150},
        {field: 'owner', headerName: 'Owner', width: 150},
        {field: 'description', headerName: 'Description', width: 150}
    ]

    /**
     * @param item {Object}
     * @param index {integer}
     * @returns {Object}

     * uses the top performers data and maps it to a row object
     */
    const rows = inputData.map(function(item, index) {
        return {
            id: index + 1,
            name: item.player.name,
            score: item.overall_score.toFixed(1),
            owner: item.player.user,
            description: item.player.description
        };
    });

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
            />
            </div>
        </div>
    )
}

HomePageTable.propTypes = {
    inputData: PropTypes.object.isRequired,
}
