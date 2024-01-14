import React from 'react'
import PropTypes from 'prop-types'
import { DataGrid } from '@mui/x-data-grid';



const Table = ({inputData}) => {

    // const columns = [
    //     { field: 'player', headerName: 'Player', width: 150, editable: false },
    //     ...inputData.table_headers.map(header => ({ field: header.name, headerName: header.name, type: 'number', width: 150, editable: true })),
    // ];
    
    // const rows = inputData.rows.map(row => ({
    //     player: row.player_name,
    //     ...row.score.reduce((acc, score, index) => ({ ...acc, [inputData.table_headers[index].name]: score }), {}),
    // }));
     
    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'firstName',
            headerName: 'First name',
            width: 150,
            editable: true,
        },
        {
            field: 'lastName',
            headerName: 'Last name',
            width: 150,
            editable: true,
        },
        {
            field: 'age',
            headerName: 'Age',
            type: 'number',
            width: 110,
            editable: true,
        },
        {
            field: 'fullName',
            headerName: 'Full name',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            width: 160,
            valueGetter: (params) =>
            `${params.row.firstName || ''} ${params.row.lastName || ''}`,
        },
    ];
        
    const rows = [
        { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14 },
        { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31 },
        { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31 },
        { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11 },
        { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
        { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
        { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
        { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
        { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
    ];

    const getRowStyle = (params) => {
        return {
            backgroundColor: '#f0f0f0',
        };
    };


    return(
        <DataGrid
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
            getRowStyle={getRowStyle}
         />
    )
}

Table.propTypes = {
    inputData: PropTypes.object.isRequired,
}

export default Table