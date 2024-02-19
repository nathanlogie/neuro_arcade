import React from 'react';
import {ResponsiveSwarmPlot} from '@nivo/swarmplot';
import {Switcher} from '../Switcher';
import PropTypes from 'prop-types';
import styles from '../../styles/components/TableGraph.module.css';

/**
 * @param inputData {Object}
 * @returns {Element}
 * takes in the input data from requestGame to build a Swarm Plot
 */
export function SwarmPlot({inputData}) {

    if (!inputData || !inputData.rows || inputData.rows.length === 0){
        return <h1>No data</h1>;
    }

    const [selectedSwitcherValue, setSelectedSwitcherValue] = React.useState(
        inputData.table_headers[0].name
    );
    
    /**
     * @param row {Object}
     * maps all the data needed to create the plot
     */
    const data = inputData.rows.map(function(row) {
        return {
            id: row.player_name,
            group: row.is_ai ? 'AI' : 'Human',
            /**
             * @param h {Object}
             * @returns {string}
             * gets the value from the currently selected switcher value
             */
            value: row.score[inputData.table_headers.findIndex(function(h) {
                return h.name === selectedSwitcherValue;
            })]
        };
    });

    /**
     * @param selectedValue {string}
     */
    const handleSwitcherChange = function(selectedValue) {
        setSelectedSwitcherValue(selectedValue);
    };

    const maxValue = Math.max(...data.map(item => item.value));
    const minValue = Math.min(...data.map(item => item.value));

    return (
        <div className={styles.GraphContainer}>
            <div style={{width: '43.8em', height: '32em'}}>
                <h2>Trends</h2>
                <div className={styles.TabSwitcher}>
                    <Switcher
                        data={inputData}
                        onSwitcherChange={handleSwitcherChange}
                        switcherDefault={selectedSwitcherValue}
                    />
                </div>
                <ResponsiveSwarmPlot
                    data={data}
                    groups={['AI', 'Human']}
                    groupBy="group"
                    margin={{top: 75, right: 75, bottom: 100, left: 100}}
                    size={{key: 'value', values: [minValue, maxValue], sizes: [15, 60]}}
                    colors={{scheme: 'accent'}}
                    forceStrength={1}
                    simulationIterations={100}
                    theme={{
                        'background': 'rgba(255,255,255,0.1)',
                        'text': {
                            'fill': '#CCCCCC',
                            fontFamily: 'inherit',
                        },
                        'axis': {
                            'legend': {
                                'text': {
                                    fontWeight: 'bold',
                                    fontSize: '1em',
                                    color: '#DDDDDD'
                                }
                            }
                        }
                    }}
                    axisBottom={{
                        orient: 'bottom',
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'AI vs Humans',
                        legendPosition: 'middle',
                        legendOffset: 60,
                    }}
                    axisLeft={{
                        orient: 'left',
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: selectedSwitcherValue,
                        legendPosition: 'middle',
                        legendOffset: -60,
                    }}
                />
            </div>
        </div>
    );
};

SwarmPlot.propTypes = {
    inputData: PropTypes.object.isRequired,
};
  