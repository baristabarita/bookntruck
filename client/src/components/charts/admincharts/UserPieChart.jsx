import React, { useState, useEffect } from 'react';
import { ResponsivePie } from '@nivo/pie';
import axios from 'axios';
import config from '../../../common/config'

const PieChart = () => {
    const [data, setData] = useState([]);
    const synthwaveColors = ['#F6AE2D', '#37F9F6', '#7838d4', '#21f1f1'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const clientRes = await axios.get(`${config.API}/user/retrieve_count?col=user_type&val=client`);
                const truckerRes = await axios.get(`${config.API}/user/retrieve_count?col=user_type&val=trucker`);

                setData([
                    {
                        "id": "Client Users",
                        "label": "Client Users",
                        "value": clientRes.data.totalCount,
                    },
                    {
                        "id": "Trucker Users",
                        "label": "Trucker Users",
                        "value": truckerRes.data.totalCount,
                    }
                ]);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchData();
    }, [config]);

    return (
<ResponsivePie
    data={data}
    margin={{ top: 30, right: 80, bottom: 50, left: 80 }}
    innerRadius={0.5}
    padAngle={0.7}
    cornerRadius={3}
    colors={synthwaveColors}
    borderWidth={1}
    borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
    radialLabelsSkipAngle={10}
    radialLabelsLinkColor={{ from: 'color' }}
    sliceLabelsSkipAngle={10}
    animate={true}
    motionStiffness={90}
    motionDamping={15}
    theme={{
        labels: {
            text: {
                fill: "#BF458D"
            }
        }
    }}
/>
    );
};

export default PieChart;