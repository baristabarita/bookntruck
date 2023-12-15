import { ResponsiveLine } from "@nivo/line";
import React, { useEffect, useState } from "react";
import axios from "axios";
import config from '../../../common/config'

const LineChart = ({ truckerID }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${config.API}/booking/retrieve_bookings_this_month?trucker_id=${truckerID}`)
      .then(res => {
        if (res.data && res.data.records) {
          console.log(res.data.records);
          const formattedData = res.data.records.map(record => ({
            x: record.date, // Use date directly from the response
            y: record.count,
          }));

          setData([
            {
              id: "Bookings",
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
  }, [truckerID]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return data.length ? (
    <ResponsiveLine
      data={data}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: "time", format: "%m/%d/%Y", precision: "day" }}
      xFormat="time:%m/%d/%Y"
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
        legend: "Number of Bookings",
        legendOffset: -40,
        legendPosition: "middle",
        tickValues: Array.from({length: 11}, (_, i) => i), // Set y-axis ticks at intervals of 1
      }}
      colors={"#0000FF"} // Set color to blue
      pointSize={10}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
    />
  ) : (
    <div>No data available</div>
  );
};

export default LineChart;
