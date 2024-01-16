import React from 'react';
import PropTypes from 'prop-types'
import Switcher from './Switcher'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from 'recharts';


//inputData: the JSON data used to generate the graph
//x-axis: the name of the score type to be displayed on the x-axis
const Graph = ({inputData}) => {

     //setting the default switcher value to the first score
    const [selectedSwitcherValue, setSelectedSwitcherValue] = React.useState(
        inputData.table_headers[0].name
    );

    const data = inputData.rows.map((player) => ({
        name: player.player_name,
        value: player.score[inputData.table_headers.findIndex((h) => h.name === selectedSwitcherValue)],
    }));

    const handleSwitcherChange = (selectedValue) => {
        setSelectedSwitcherValue(selectedValue);
    }

return (

    <div className="Container">    
            
            <div className="Switcher">
                <Switcher data={inputData} onSwitcherChange={handleSwitcherChange}/>
            </div>

            <div className="Graph">

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
                        label={{ value: "Score", angle: -90, position: 'insideLeft' }} 
                        axisLine={{ stroke: '#FFFFFF' }} 
                        domain={['auto', 'auto']}
                    />
                    <ReferenceLine 
                        y={0} 
                        stroke="#FFFFFF" 
                    />

                    <Line 
                        dataKey="value" 
                        stroke="black" 
                        dot={false} 
                    />

                </LineChart>
            </div>
        </div>
  )
}

Graph.propTypes = {
    inputData: PropTypes.object.isRequired,
}

export default Graph
