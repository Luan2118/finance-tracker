import { incomeData } from "../../data/incomeData.js";


const ctx = document.getElementById('income-chart')

const labels = incomeData.map(item => new Date(item.dateValue));

const data = incomeData.map(item => item.amountValue);


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
            unit: 'month'
          }
        }
       
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

const earliestDate = new Date(Math.min(...labels));
const minDate = new Date(earliestDate);
minDate.setDate(minDate.getDate() - 5); // shift 5 days earlier

myChart.options.scales.x.min = minDate;  // start axis a bit earlier
myChart.update();
const filter = document.getElementById('chart-filter')

filter.addEventListener('change', (date) => {
  const year = date.target.value.substring(0, 4);
  const month = date.target.value.substring(5, 7);


  const lastDayOfMonth = (y , m) => {
    return new Date(y , m, 0).getDate();
  }

  const minDate = `${date.target.value}-01`;


  const maxDate = `${date.target.value}-${lastDayOfMonth(year, month)}`;


  myChart.options.scales.x.min = minDate;
  myChart.options.scales.x.max = maxDate;
  myChart.options.scales.x.time.unit = 'day';
  myChart.update();
})



const chartResetButton = document.getElementById('chart-reset-button')

chartResetButton.addEventListener('click', () => {
myChart.options.scales.x.min = undefined;
myChart.options.scales.x.max = undefined;
myChart.options.scales.x.time.unit = 'month';
myChart.update();
})
