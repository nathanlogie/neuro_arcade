import React from 'react'
import PropTypes from 'prop-types'
import Switcher from './Switcher'
import { DataGrid } from '@mui/x-data-grid';



const Table = ({inputData}) => {

    const [selectedSwitcherValue, setSelectedSwitcherValue] = React.useState("All");

    const handleSwitcherChange = (selectedValue) => {
        setSelectedSwitcherValue(selectedValue);
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 90, hide: true },
        { field: 'player', headerName: ' ', width: 150 },
        ...inputData.table_headers.map(header => ({
            field: header.name.toLowerCase(),
            headerName: header.name,
            type: header.type === 'int' ? 'number' : 'float',
            width: 150,
        })),
        { field: 'is_AI', headerName: 'Is AI?', type: 'boolean', width: 120 },
    ];

    const rows = inputData.rows.map((row, index) => ({
        id: index + 1,
        player: row.player_name,
        ...row.score.reduce((acc, score, scoreIndex) => {
            const columnName = inputData.table_headers[scoreIndex].name.toLowerCase();
            return { ...acc, [columnName]: score };
        }, {}),
        is_AI: row.is_ai,
    }));
    

    const getRowStyle = (params) => {
        return {
            backgroundColor: '#f0f0f0',
        };
    };

    const switcher_labels = {
        table_headers: [
          { name: 'AI Platforms' },
          { name: 'all' },
          { name: 'Humans' },
        ],
      };

      const filteredRows =
      selectedSwitcherValue === 'all'
        ? rows
        : selectedSwitcherValue === 'AI Platforms'
        ? rows.filter((row) => row.is_AI)
        : selectedSwitcherValue === 'Humans'
        ? rows.filter((row) => !row.is_AI)
        : rows;


    return(
        <div className='Container'>
            <div className="Switcher">
                    <Switcher data={switcher_labels} onSwitcherChange={handleSwitcherChange}/>
            </div>
            <div className='Table'>
            <DataGrid
                rows={filteredRows}
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
            </div>
        </div>
    )
}

Table.propTypes = {
    inputData: PropTypes.object.isRequired,
}

export default Table