import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Graph = () => {

    //example data
    const inputData = {
        "game": {
            "name": "Varying Shapes",
            "slug": "varying-shapes",
            "description": "A game where you deal with a number of varying shapes",
            "tags": [
                "Tracking Games",
                "High AI Score"
            ],
            "score_type": {
                //need to use this
                "headers": [
                    {
                        "name": "Coins",
                        "description": "Number of coins collected",
                        "min": 0,
                        "max": 100
                    }
                ]
            },
            "play_link": ""
        },
        "table_headers": [
            {
                "name": "Coins",
                "description": "Number of coins collected",
                "min": 0,
                "max": 100
            }
        ],
        "rows": [
            {
                "player_name": "Tiger Bot",
                "score": [
                    84
                ]
            },
            {
                "player_name": "Amanda Wilson",
                "score": [
                    80
                ]
            },
            {
                "player_name": "Monkey Bot",
                "score": [
                    4
                ]
            }
        ]
    }

    const data = inputData.rows.map(player => ({
        name: player.player_name,
        //need to be able to view each score individually
        value: player.score[0]
    }));

  return (
    <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
    </LineChart>
  )
}

export default Graph
