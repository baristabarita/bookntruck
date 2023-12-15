import { ResponsiveLine } from "@nivo/line";
import React, { useEffect, useState } from "react";
import axios from "axios";
import config from '../../../common/config'

const LineChart = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const synthwaveColor = '#F6AE2D'; // Synthwave color

  useEffect(() => {
    axios.get(`${config.API}/user/retrieve_regs_thismonth`)
      .then(res => {
        if (res.data && res.data.records) {
          const formattedData = res.data.records.map(record => ({
            x: new Date(record.date).toISOString().split('T')[0], // Convert date to 'YYYY-MM-DD' format
            y: record.count,
          }));

          setData([
            {
              id: "Registrations",
              data: formattedData,
            },
          ]);
        } else {
          setError('No data received from the server.');
        }
      })
      .catch(err => {
        console.error(err);
        setError('Error fetching data from the server.');
      });
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return data.length ? (
    <ResponsiveLine
      data={data}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: "time", format: "%Y-%m-%d", precision: "day" }}
      xFormat="time:%Y-%m-%d"
      yScale={{ type: "linear", min: 0, max: 10, stacked: true, reverse: false }} // Set min and max for y-axis
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: "bottom",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Dates this month",
        legendOffset: 36,
        legendPosition: "middle",
        format: "%b %d",
        tickValues: "every 2 days",
      }}
      axisLeft={{
        orient: "left",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Number of Registrations", 
        legendOffset: -40,
        legendPosition: "middle",
        tickValues: Array.from({length: 11}, (_, i) => i), // Set y-axis ticks at intervals of 1
      }}
      colors={synthwaveColor} // Set color to synthwave color
      pointSize={10}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
      theme={{
        axis: {
          ticks: {
            text: {
              fill: synthwaveColor,
            },
          },
          legend: {
            text: {
              fill: synthwaveColor,
            },
          },
        },
      }}
    />
  ) : (
    <div>No data available</div>
  );
};

export default LineChart;