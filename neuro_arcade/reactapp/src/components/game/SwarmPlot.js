import React from 'react';
import {ResponsiveSwarmPlot} from '@nivo/swarmplot';
import {Switcher} from '../Switcher';
import PropTypes from 'prop-types'

/**
 * @param inputData {Object}
 * @returns {Element}
 * takes in the input data from requestGame to build a Swarm Plot
 */
export function SwarmPlot({inputData}) {

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
    

    return (
        <div style={{ width: '600px', height: '400px' }}>
            <Switcher 
                data={inputData} 
                onSwitcherChange={handleSwitcherChange}
                switcherDefault={selectedSwitcherValue}
            />
            <ResponsiveSwarmPlot
                data={data}
                groups={['AI', 'Human']} 
                identity='id'
                value="value"
                groupBy="group"
                margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
                size={{ key: 'value', values: [0, 100], sizes: [1, 10] }}
                forceStrength={1}
                simulationIterations={100}
                axisBottom={{
                    orient: 'bottom',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend:'AI vs Humans',
                    legendPosition: 'middle',
                    legendOffset: 36,
                }}
                axisLeft={{
                    orient: 'left',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legendOffset: -40,
                }}
            />
        </div>
    );
};

SwarmPlot.propTypes = {
    inputData: PropTypes.object.isRequired,
};
  