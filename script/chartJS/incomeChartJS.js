import { expenseData } from "../../data/expenseData.js";
import { incomeData } from "../../data/incomeData.js";


const ctx = document.getElementById('income-chart')

export function monthlyIncomeSummary() {
  const monthlySums = {};
  incomeData.forEach(item => {
    const date = new Date(item.dateValue)

    const monthKey =  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

    if (!monthlySums[monthKey]) {
      monthlySums[monthKey] = 0;
    } 

    monthlySums[monthKey] += Number(item.amountValue)
  })

  return monthlySums;
}


const monthlySums = monthlyIncomeSummary();

const labels = Object.keys(monthlySums)
const data = Object.values(monthlySums)

export const myChart = new Chart(ctx, {
    type: 'bar', // or 'pie', 'line', etc.
    data: {
        labels,
        datasets: [{
            label: 'Income',
            data,
            backgroundColor: ['#00E946'],
        }]
    },
    options: {
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'month',
          },
        },
      },
        maintainAspectRatio: false,
        plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                title: function() {
                  return ''
                },
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
  const month = date.target.value.substring(5, 7);


  const lastDayOfMonth = (y , m) => {
    return new Date(y , m, 0).getDate();
  }

  const firstDay = `${date.target.value}-01`;


  const lastDay = `${date.target.value}-${lastDayOfMonth(year, month)}`;

  myChart.data.labels  = incomeData.map(item => item.dateValue);

  myChart.data.datasets[0].data =  incomeData.map(item => item.amountValue);


  myChart.options.scales.x.min = firstDay;
  myChart.options.scales.x.max = lastDay;
  myChart.options.scales.x.time.unit = 'day';

  myChart.update();
  
})



const chartResetButton = document.getElementById('chart-reset-button')

chartResetButton.addEventListener('click', () => {
  myChart.options.scales.x.min = undefined;
  myChart.options.scales.x.max = undefined;
  myChart.data.labels  = Object.keys(monthlySums);
  myChart.data.datasets[0].data =  Object.values(monthlySums);
  myChart.options.scales.x.time.unit = 'month';
  myChart.update();
})

