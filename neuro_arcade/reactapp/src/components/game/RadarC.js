import React from 'react';
import PropTypes from 'prop-types'
import {Radar, RadarChart, PolarGrid, Legend, PolarAngleAxis, PolarRadiusAxis} from 'recharts';

/**
 * 
 * @returns {Element}
 */
export function RadarC() {
  // // setting the default switcher value to the first score
  // const [selectedSwitcherValue, setSelectedSwitcherValue] = React.useState(
  //     inputData.table_headers[0].name
  // );
  // const data = inputData.rows.map((player) => ({
  //     name: player.player_name,
  //     value: player.score[inputData.table_headers.findIndex((h) => h.name === selectedSwitcherValue)],
  // }));
  // const handleSwitcherChange = (selectedValue) => {
  //     setSelectedSwitcherValue(selectedValue);


  const data =[
    {data_type: "Coins", average_ai: 23, average_human: 74},
    {data_type: "Points", average_ai: 82, average_human: 42},
    {data_type: "Stars", average_ai: 92, average_human: 27},
    {data_type: "Time", average_ai: 45, average_human: 86},
    {data_type: "Wins", average_ai: 74, average_human: 36},
  ]

  return (
    <RadarChart cx={300} cy={250} outerRadius={150} width={600} height={500} data={data}>
      <PolarGrid />
      <PolarAngleAxis dataKey="data_type" />
      <PolarRadiusAxis />
      <Radar name="Average AI Score" dataKey="average_ai" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
      <Radar name="Average Human Score" dataKey="average_human" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
      <Legend />
    </RadarChart>
  );
}

