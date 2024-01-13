import React from 'react';
import PropTypes from 'prop-types'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label, ReferenceLine } from 'recharts';

const Graph = ({score_field, inputData, x_axis}) => {

    const data = inputData.rows.map(player => ({
        name: player.player_name,
        value: player.score[score_field]
    }));

  return (
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
  )
}

Graph.propTypes = {
    score_field: PropTypes.number.isRequired,
    inputData: PropTypes.object.isRequired,
    x_axis: PropTypes.string.isRequired,
}

export default Graph
