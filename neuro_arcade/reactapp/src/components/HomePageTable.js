import PropTypes from 'prop-types'
import {DataGrid} from '@mui/x-data-grid';

/**
 * 
 * @param inputData {Object}
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
            description: item.player.description
        };
    });

    return(
        <div className={'TableContainer'}>
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
