import React from 'react'
import PropTypes from 'prop-types'
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import styles from '../styles/Switcher.module.css'


const Switcher = ({data}) => { 

    const [alignment, setAlignment] = React.useState('web');

    // const handleChange = (event, newAlignment) => {
    //     setAlignment(newAlignment);
    // };

    const handleAlignment = (event, newAlignment) => {
        if (newAlignment !== null) {
          setAlignment(newAlignment);
        }
    };

    return(
        <div className={styles.Switcher}>
            <ToggleButtonGroup
                color="primary"
                value={alignment}
                exclusive
                onChange={handleAlignment}
                aria-label="Platform"
            >

                {data.table_headers.map((header, index) => (   
                    <div key={index}>
                        <ToggleButton value={header.name}>{header.name}</ToggleButton>
                    </div>
                ))}
            </ToggleButtonGroup>
        </div>
    )
}

Switcher.propTypes = {
    inputData: PropTypes.object.isRequired,
}

export default Switcher