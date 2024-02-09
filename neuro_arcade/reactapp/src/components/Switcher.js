import React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import styles from '../styles/App.module.css';

export function Switcher({ data, onSwitcherChange, switcherDefault }) {
  const [alignment, setAlignment] = React.useState(switcherDefault);

  const handleAlignment = (event, newAlignment) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
      onSwitcherChange(newAlignment);
    }
  };

  return (
    <>
      <ToggleButtonGroup
        color='primary'
        value={alignment}
        exclusive
        onChange={handleAlignment}
        aria-label='Platform'
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
              id={
                styles[
                  (() => {
                    if (index === 0 && index === data.table_headers.length - 1) {
                      return 'single';
                    } else if (index === 0) {
                      return 'start';
                    } else if (index === data.table_headers.length - 1) {
                      return 'end';
                    } else {
                      return '';
                    }
                  })()
                ]
              }
              style={{
                borderColor: alignment === header.name ? 'white' : 'transparent',
                borderWidth: '0.5em',
                'backdrop-filter': 'blur(20px)',
                backgroundColor: alignment === header.name ? 'rgba(255, 255, 255, 0.3)' : 'rgba(143,143,143,0.2)',
                color: '#EEEEEE',
                fontSize: '0.75em',
                fontFamily: 'inherit',
                fontWeight: '700'
              }}
            >
              {header.name}
            </ToggleButton>
          </div>
        ))}
      </ToggleButtonGroup>
    </>
  );
}
