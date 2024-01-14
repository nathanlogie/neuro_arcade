import React from 'react';
import PropTypes from 'prop-types'
import Switcher from './Switcher'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from 'recharts';


//score_field: a number which tells us if its the first, second, third etc score type
//inputData: the JSON data used to generate the graph
//x-axis: the name of the score type to be displayed on the x-axis
const Graph = ({score_field, inputData, x_axis}) => {

     //setting the default switcher value to the first score
    const [selectedSwitcherValue, setSelectedSwitcherValue] = React.useState(
        inputData.table_headers[0].name // Set the default switcher value
    );

    const data = inputData.rows.map((player) => ({
        name: player.player_name,
        value: player.score[inputData.table_headers.findIndex((h) => h.name === selectedSwitcherValue)],
    }));

    const handleSwitcherChange = (selectedValue) => {
        setSelectedSwitcherValue(selectedValue);
    }

    // const headerNames = data.table_headers.map(header => header.name);

  return (

    <div className='bigdiv'>
{/* 
        {inputData.table_headers.map((header, index) => (
            <div key={index}>
                <h2>{header.name}</h2>
                <ul>
                    {inputData.rows.map((row, rowIndex) => (
                        <li key={rowIndex}>
                            <strong>{row.player_name}:</strong> {row.score[index]}
                        </li>
                    ))}
                </ul>
            </div>
        ))} */}
        
        <div className='Switcher'>
            <Switcher data={inputData} onSwitcherChange={handleSwitcherChange}/>
        </div>

        <LineChart
            width={700}
            height={500}
            data={data}
            margin={{
                top: 30,
                right: 60,
                left: 20,
                bottom: 120,
            }}
            style={{ background: 'linear-gradient(270deg, rgba(217, 217, 217, 0.43) 0%, rgba(217, 217, 217, 0.00) 100%)' }}
            >
            <XAxis
                dataKey="name" 
                angle={290} 
                dy={40} 
                label={{ value: "AI Platforms", position: 'bottom', offset: 90 }} 
                axisLine={{ stroke: 'transparent' }} 
                padding={{ left: 10 }} 
                tickLine={false}
            />

            <YAxis 
                label={{ value: x_axis, angle: -90, position: 'insideLeft' }} 
                axisLine={{ stroke: '#FFFFFF' }} 
                domain={['auto', 'auto']}
            />
            <ReferenceLine 
                y={0} 
                stroke="#FFFFFF" 
            />

            <Line 
                dataKey="value" 
                stroke="#FFFFFF" 
                dot={false} 
            />

        </LineChart>
    </div>
  )
}

Graph.propTypes = {
    score_field: PropTypes.number.isRequired,
    inputData: PropTypes.object.isRequired,
    x_axis: PropTypes.string.isRequired,
}

export default Graph
