import React from 'react'
import PropTypes from 'prop-types'
import {DataGrid} from '@mui/x-data-grid';

export function HomePageTable() {

    const inputData = [
        {
            "player": {
                "url": "http://127.0.0.1:8000/api/players/6/",
                "name": "Monkey Bot",
                "is_ai": true,
                "user": "http://127.0.0.1:8000/api/users/13/",
                "description": "AI player that is owned by monkey555",
                "player_tags": [
                    "http://127.0.0.1:8000/api/playerTags/4/",
                    "http://127.0.0.1:8000/api/playerTags/5/",
                    "http://127.0.0.1:8000/api/playerTags/10/"
                ]
            },
            "overall_score": 1250.0
        },
        {
            "player": {
                "url": "http://127.0.0.1:8000/api/players/5/",
                "name": "Zebra Bot",
                "is_ai": true,
                "user": "http://127.0.0.1:8000/api/users/14/",
                "description": "AI player that is owned by zebra777",
                "player_tags": [
                    "http://127.0.0.1:8000/api/playerTags/1/",
                    "http://127.0.0.1:8000/api/playerTags/3/",
                    "http://127.0.0.1:8000/api/playerTags/10/"
                ]
            },
            "overall_score": 1024.9999999999998
        },
    ]


    const columns = [
        {field: 'id', headerName: 'ID', width: 90, hide: true},
        {field: 'name', headerName: 'AI Platform', width:150},
        {field: 'score', headerName: 'Overall Score', width:150},
        {field: 'owner', headerName: 'Owner', width: 150},
        {field: 'description', headerName: 'Description', width: 150}
    ]

    const rows = inputData.map(function(item, index) {
        return {
            id: index + 1,
            name: item.player.name,
            score: item.overall_score.toFixed(1),
            owner: item.player.user.split('/').pop(),
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
