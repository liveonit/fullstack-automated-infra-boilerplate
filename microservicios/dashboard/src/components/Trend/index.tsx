import React from 'react';
import * as ReactDOM from "react-dom"
import { Pie } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js'

const Chart: React.FC = () => {
  const [ state, setState ] = React.useState();
    const data = {
      labels: [
        'Red',
        'Green',
        'Yellow'
      ],
      datasets: [{
        data: [300, 50, 100],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56'
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56'
        ]
      }]
    };

    let options: ChartOptions = {
      legend: {
        position: 'bottom',
      }
    };

    return (
      <Pie data={data} options={options} />
    );
}

export default Chart;