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

  
  const data = [
    {player_name: 'Tiger Bot', coins: 84, points: 23},
    {player_name: 'Amanda Wilson', coins: 72, points: 17},
    {player_name: 'Monkey Bot', coins: 48, points: 53},
    {player_name: 'Jenny Bar', coins: 56, points: 65},
    {player_name: 'Panda Bot', coins: 25, points: 48},
  ];

  return (
    <RadarChart cx={300} cy={250} outerRadius={150} width={600} height={500} data={data}>
      <PolarGrid />
      <PolarAngleAxis dataKey="player_name" />
      <PolarRadiusAxis />
      <Radar name="Coins" dataKey="coins" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
      <Radar name="Points" dataKey="points" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
      <Legend />
    </RadarChart>
  );
}

