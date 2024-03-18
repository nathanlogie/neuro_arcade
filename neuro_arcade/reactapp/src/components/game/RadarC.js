import React from "react";
import PropTypes from "prop-types";
import {Radar, RadarChart, PolarGrid, Legend, PolarAngleAxis} from "recharts";
import styles from "../../styles/components/Table.module.css";

/**
 * @param inputData {Object}
 * @returns {Element}
 * takes in the input data from requestGame to build a Radar Chart
 */
export function RadarC({inputData}) {
    if (!inputData || !inputData.rows || inputData.rows.length === 0) {
        return <div style={{width: "38em", height: "30.75em", lineHeight: "30.75em"}}>no data</div>;
    }

    const numDataTypes = inputData.table_headers.length;
    if (numDataTypes < 3) {
        return null;
    }

    const scores = {};
    /**
     * @param header {Object}
     * for each table header (score type) initialises the score object and sets the counts and totals of AI and humans to 0
     */
    inputData.table_headers.forEach(function (header) {
        scores[header.name] = {
            ai: {count: 0, total: 0, max: 0, min: 0},
            human: {count: 0, total: 0, max: 0, min: 0}
        };
    });

    /**
     * @param row {Object}
     * for each player in row decides if the player is AI or human
     */
    inputData.rows.forEach(function (row) {
        const scoreType = row.is_ai ? "ai" : "human";
        /**
         * @param header {Object}
         * @param index {integer}
         * finds the total count of AI and human players and the total score for AI and human players
         */
        inputData.table_headers.forEach(function (header, index) {
            scores[header.name][scoreType].count++;
            scores[header.name][scoreType].total += row.score[index];
            if (scores[header.name][scoreType].max < row.score[index]) {
                scores[header.name][scoreType].max = row.score[index];
            }
            if (scores[header.name][scoreType].min > row.score[index]) {
                scores[header.name][scoreType].min = row.score[index];
            }
        });
    });

    /**
     * @param header {Object}
     * @returns data {Object}
     * finds the average AI and human scores then adds this to an object data to be used in the Radar Chart
     */
    const data = inputData.table_headers.map(function (header) {
        const meanAI = scores[header.name].ai.total / scores[header.name].ai.count;
        const meanHuman = scores[header.name].human.total / scores[header.name].human.count;
        const max = Math.max(scores[header.name].ai.max, scores[header.name].human.max);
        const min = Math.min(scores[header.name].ai.min, scores[header.name].human.min);
        const normalizedMeanAI = (meanAI - min) / (max - min);
        const normalizedMeanHuman = (meanHuman - min) / (max - min);
        return {
            data_type: header.name,
            average_ai: normalizedMeanAI.toFixed(2),
            average_human: normalizedMeanHuman.toFixed(2)
        };
    });

    return (
        <>
            <h2>Trends</h2>
            <RadarChart outerRadius={150} width={608} height={492} data={data}>
                <PolarGrid />
                <PolarAngleAxis dataKey='data_type' />
                <Radar name='Average AI Score' dataKey='average_ai' stroke='#D14081' fill='#D14081' fillOpacity={0.4} />
                <Radar name='Average Human Score' dataKey='average_human' stroke='#82ca9d' fill='#82ca9d' fillOpacity={0.4} />
                <Legend verticalAlign={"bottom"} height={"5em"} />
            </RadarChart>
        </>
    );
}

RadarC.propTypes = {
    inputData: PropTypes.object.isRequired
};
