import { expenseData } from "../../data/expenseData.js"




const ctx = document.getElementById('expense-chart')



const labels = expenseData.map(item => new Date(item.dateValue))
const data = expenseData.map(item => item.amountValue)

export const myChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels,
    datasets: [{
      label: 'Expenses',
      data,
      backgroundColor: 'red'
    }]
  },
  options: {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'month',
        },
        
      }
    },
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top'
      },
      tooltip: {
        callbacks: {
          title: () => {
            return '';
          },

          beforeBody: (context) => {
            const dataIndex = context[0].dataIndex;

            const item = expenseData[dataIndex];

            return item.expenseSourceValue;
          },

          label: (context) => {
            return `Amount: ${context.formattedValue} Kč`
          }
        }
      }
    }
  }
})


const filter = document.getElementById('chart-filter')

filter.addEventListener('change', (date) => {
 const year = date.target.value.substring(0, 4);
 const month = date.target.value.substring(5, 7);
 
 const lastDay = (y, m) => {
  return new Date(y , m, 0).getDate()
 }


 myChart.options.scales.x.min = `${date.target.value}-01`;
 myChart.options.scales.x.max = `${date.target.value}-${lastDay(year, month)}`;
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