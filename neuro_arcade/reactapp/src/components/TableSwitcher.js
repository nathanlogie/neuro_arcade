import React from 'react'
import PropTypes from 'prop-types'
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import styles from '../styles/TableGraph.module.css'

const TableSwitcher = ({data , onSwitcherChange}) => {

    const [alignment, setAlignment] = React.useState('web');

    const handleAlignment = (event, newAlignment) => {
        if (newAlignment !== null) {
          setAlignment(newAlignment);
          onSwitcherChange(newAlignment);
        }
    };

    return(
        <div className={'switcher'}>
            <ToggleButtonGroup
                color="primary"
                value={alignment}
                exclusive
                onChange={handleAlignment}
                aria-label="Platform"
                style={{
                    borderRadius: '40px',
                    overflow: 'hidden',
                    right: '0'
                }}
            >

                {data.table_headers.map((header, index) => (
                    <div key={index}>
                        <ToggleButton 
                            value={header.name}
                            id={styles[
                                    (() => {
                                       if (index === data.table_headers.length - 1) {
                                           return "end";
                                       } else if (index === 0) {
                                           return "start";
                                       } else {
                                           return "";
                                       }
                                    })()
                                ]}
                            style={{
                                borderColor: alignment === header.name ? 'white' : 'transparent',
                                borderWidth: '0.5em',
                                'backdrop-filter': 'blur(20px)',
                                backgroundColor: alignment === header.name ? 'rgba(255, 255, 255, 0.45)' : 'rgba(255, 255, 255, 0.2)',
                                color: '#EEEEEE',
                                fontSize: '0.75em'
                            }}>
                                {header.name}
                        </ToggleButton>
                    </div>
                ))}
            </ToggleButtonGroup>
        </div>
    )
}

TableSwitcher.propTypes = {
    inputData: PropTypes.object.isRequired,
    onSwitcherChange: PropTypes.func.isRequired,
}

export default TableSwitcher