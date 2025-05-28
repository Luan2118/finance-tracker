import { incomeData } from "../data/incomeData.js";
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

const ctx = document.getElementById('income-chart')

let labels = incomeData.map(item => item.dateValue);

const label = incomeData.map(item => item.incomeSourceValue);

const data = incomeData.map(item => item.amountValue);


export const myChart = new Chart(ctx, {
    type: 'bar', // or 'pie', 'line', etc.
    data: {
        labels,
        datasets: [{
            label: 'Income',
            data,
            color: ['red'],
            backgroundColor: ['#00E946'],
            

        }]
    },
    options: {
        scales: {
          x: {
            min: '2025-01-01',
            max: '2025-12-31',
            type: 'time',
            time: {
              unit: 'day'
            }
          },
          y: {
            beginAtZero: true,
          }
        },
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
              callbacks: {
                beforeBody: function (context) {
                  const dataIndex = context[0].dataIndex;
                  const item = incomeData[dataIndex];

                  return item.incomeSourceValue
                },
                label: function (context) {
                  return `Amount: ${context.formattedValue}Kč`
                }
              }
            }
        },
    }
});





const filter = document.getElementById('chart-filter')

filter.addEventListener('change', (date) => {
    const year = date.target.value.substring(0, 4);
    const month = date.target.value.substring(5, 8);
  

    const lastDay = (y , m) => {
      return new Date(y, m, 0).getDate()
    }

    const startDate = `${date.target.value}-01`;
    const endDate = `${date.target.value}-${lastDay(year, month)}`;
    myChart.options.scales.x.min = startDate;
    myChart.options.scales.x.max = endDate;
    myChart.update();

})

const chartResetButton = document.getElementById('chart-reset-button')

chartResetButton.addEventListener('click', () => {
  myChart.options.scales.x.min = '2025-01-01';
  myChart.options.scales.x.max = '2025-12-31';
  myChart.update();
})

