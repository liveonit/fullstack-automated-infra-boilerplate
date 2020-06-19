import React from 'react';

import { Pie } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js'

interface Props {
  width: number;
  height: number;
}

const PieChart: React.FC<Props> = (props) => {
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
      },
      responsive: false,
      maintainAspectRatio: false
    };

    return (
      <Pie width={props.width} height={props.height} data={data} options={options} />
    );
}

export default PieChart;