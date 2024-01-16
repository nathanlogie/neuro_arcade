import React from 'react'
import PropTypes from 'prop-types'
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
// import styles from '../styles/Switcher.module.css'


const Switcher = ({data , onSwitcherChange}) => { 

    const [alignment, setAlignment] = React.useState('web');

    const handleAlignment = (event, newAlignment) => {
        if (newAlignment !== null) {
          setAlignment(newAlignment);
          onSwitcherChange(newAlignment);
        }
    };

    return(
        <div className="switcher">
            <ToggleButtonGroup
                color="primary"
                value={alignment}
                exclusive
                onChange={handleAlignment}
                aria-label="Platform"
                style={{ 
                    borderRadius: '40px',
                    overflow: 'hidden',
                }}
            >

                {data.table_headers.map((header, index) => (   
                    <div key={index}>
                        <ToggleButton 
                            value={header.name}
                            style={{
                                borderColor: 'transparent',
                                backgroundColor: alignment === header.name ? 'gray' : 'transparent',
                                color: 'black'
                            }}>
                                {header.name}
                        </ToggleButton>
                    </div>
                ))}
            </ToggleButtonGroup>
        </div>
    )
}

Switcher.propTypes = {
    inputData: PropTypes.object.isRequired,
    onSwitcherChange: PropTypes.func.isRequired,
}

export default Switcher