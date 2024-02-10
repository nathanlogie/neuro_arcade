import React from 'react';
import PropTypes from 'prop-types'
import {Radar, RadarChart, PolarGrid, Legend, PolarAngleAxis, PolarRadiusAxis} from 'recharts';

/**
 * @param inputData {Object}
 * @returns {Element}
 * takes in the input data from requestGame to build a Radar Chart
 */
export function RadarC({inputData}) {

  if (!inputData || !inputData.rows || inputData.rows.length === 0){
    return <h1>No data</h1>;
  }

  const numDataTypes = inputData.table_headers.length;
  if (numDataTypes < 3){
    return <h1>Insufficient number of data types to display radar chart</h1>;
  }

  const scores = {};
  /**
   * @param header {Object}
   * for each table header (score type) initialises the score object and sets the counts and totals of AI and humans to 0
   */  
  inputData.table_headers.forEach(function(header){
    scores[header.name] = { ai: { count: 0, total: 0 }, human: { count: 0, total: 0 } };
  });

  /**
   * @param row {Object}
   * for each player in row decides if the player is AI or human
   */
  inputData.rows.forEach(function(row){
    const scoreType = row.is_ai ? 'ai' : 'human';
    /**
     * @param header {Object}
     * @param index {integer}
     * finds the total count of AI and human players and the total score for AI and human players
     */
    inputData.table_headers.forEach(function(header, index){
      scores[header.name][scoreType].count++;
      scores[header.name][scoreType].total += row.score[index];
    });
  });

  /**
   * @param header {Object}
   * @returns data {Object}
   * finds the average AI and human scores then adds this to an object data to be used in the Radar Chart
   */
  const data = inputData.table_headers.map(function(header){
    const averageAI = scores[header.name].ai.total / scores[header.name].ai.count;
    const averageHuman = scores[header.name].human.total / scores[header.name].human.count;

    return {
      data_type: header.name,
      average_ai: averageAI.toFixed(2),
      average_human: averageHuman.toFixed(2)
    };
  });


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

RadarC.propTypes = {
  inputData: PropTypes.object.isRequired,
}
