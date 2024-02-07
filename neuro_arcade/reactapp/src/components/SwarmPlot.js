import { ResponsiveSwarmPlot } from '@nivo/swarmplot';

export function SwarmPlot() {

    const data = [
        { id: 'A', value: 5 },
        { id: 'B', value: 7 },
        { id: 'C', value: 3 },
        { id: 'D', value: 8 },
        { id: 'E', value: 6 },
        { id: 'F', value: 4 },
        { id: 'G', value: 9 },
    ];

    return (
        <ResponsiveSwarmPlot
            data={data}
            groups={['Group']}
            value="value"
            valueFormat=".2f"
            colors={{ scheme: 'category10' }}
            margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
                orient: 'bottom',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
            }}
            axisLeft={{
                orient: 'left',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
            }}
            enableGridX
            enableGridY
            dotSize={8}
            dotColor={{ from: 'color' }}
            dotBorderWidth={2}
            dotBorderColor={{ from: 'color', modifiers: [['darker', 0.7]] }}
            animate={true}
            motionStiffness={90}
            motionDamping={15}
        />
    );
};

export default SwarmPlot;