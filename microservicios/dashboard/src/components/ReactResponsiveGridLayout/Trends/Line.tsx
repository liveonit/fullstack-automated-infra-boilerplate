import React, { Component } from "react";
import { Line, ChartData } from "react-chartjs-2";
import { DefaultSerializer } from "v8";
import { ChartOptions } from "chart.js";

const data: ChartData<Chart.ChartData> = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "My First dataset",
      fill: false,
      lineTension: 0.1,
      backgroundColor: "rgba(75,192,192,0.4)",
      borderColor: "rgba(75,192,192,1)",
      borderCapStyle: "butt",
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: "miter",
      pointBorderColor: "rgba(75,192,192,1)",
      pointBackgroundColor: "#fff",
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "rgba(75,192,192,1)",
      pointHoverBorderColor: "rgba(220,220,220,1)",
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [65, 59, 80, 81, 56, 55, 40],
    },
  ],
};

let options: ChartOptions = {
  legend: {
    position: 'bottom',
  },
  responsive: true,
  maintainAspectRatio: false
};

interface Props {
  width: number;
  height: number;
}
const LineChart: React.FC<Props> = (props) => {
  return <Line data={data} width={props.width} height={props.height} options={options}/>;
};

export default LineChart;