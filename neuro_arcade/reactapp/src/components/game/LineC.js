import React from 'react';
import PropTypes from 'prop-types'
import {Switcher} from '../Switcher'
import { LineChart, Line, XAxis, YAxis, ReferenceLine } from 'recharts';
import styles from '../../styles/components/TableGraph.module.css';

// inputData: the JSON data used to generate the graph
// x-axis: the name of the score type to be displayed on the x-axis
export function LineC({inputData}) {
    // setting the default switcher value to the first score
    const [selectedSwitcherValue, setSelectedSwitcherValue] = React.useState(
        inputData.table_headers[0].name
    );
    const data = inputData.rows.map((player) => ({
        name: player.player_name,
        value: player.score[inputData.table_headers.findIndex((h) => h.name === selectedSwitcherValue)],
    }));
    const handleSwitcherChange = (selectedValue) => {
        setSelectedSwitcherValue(selectedValue);
    };
    return (
        <>
            <div className={styles.TabSwitcher}>
                <Switcher
                    data={inputData}
                    onSwitcherChange={handleSwitcherChange}
                    switcherDefault={selectedSwitcherValue}
                />
            </div>
            <LineChart
                width={688}
                height={492}
                data={data}
                margin={{
                    top: 30,
                    right: 60,
                    left: 20,
                    bottom: 120,
                }}
                style={{
                    stroke: '#FFFFFF'
                }}
            >
                <XAxis
                    dataKey="name"
                    angle={290}
                    dy={40}
                    label={{value: "Players", position: 'bottom', offset: 90}}
                    axisLine={{stroke: 'transparent'}}
                    padding={{left: 10}}
                    tickLine={false}
                    style={{fill: '#CCCCCC', fontSize: '0.9em'}}
                />
                <YAxis
                    label={{value: "Score", angle: -90, position: 'insideLeft'}}
                    axisLine={{stroke: '#FFFFFF'}}
                    domain={['auto', 'auto']}
                    style={{stroke: '#CCCCCC', fontSize: '0.9em'}}
                />
                <ReferenceLine
                    y={0}
                    stroke="#FFFFFF"
                />
                <Line
                    dataKey="value"
                    stroke="white"
                    dot={false}
                />
            </LineChart>
        </>
    );
}

LineC.propTypes = {
    inputData: PropTypes.object.isRequired,
}
