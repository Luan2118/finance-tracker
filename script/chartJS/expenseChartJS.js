import { expenseData } from "../../data/expenseData.js"

const ctx = document.getElementById('expense-chart')


export function monthlyExpenseSummary() {
  const monthlySum = {};
  expenseData.forEach((data) => {
  const date = new Date(data.dateValue)
  const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}` 

  if(!monthlySum[monthKey]) {
    monthlySum[monthKey] = 0
  }

  monthlySum[monthKey] += Number(data.amountValue);

  })
  return monthlySum;
}

const monthlySum = monthlyExpenseSummary();

const labels = Object.keys(monthlySum);
const data = Object.values(monthlySum);

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

 myChart.data.labels = expenseData.map(data => data.dateValue);
 myChart.data.datasets[0].data = expenseData.map(data => data.amountValue);

 myChart.options.scales.x.time.unit = 'day';
 myChart.update();
})

const chartResetButton = document.getElementById('chart-reset-button')

chartResetButton.addEventListener('click', () => {
 myChart.options.scales.x.min = undefined;
 myChart.options.scales.x.max = undefined;
 myChart.options.scales.x.time.unit = 'month';

 myChart.data.labels = Object.keys(monthlySum);
 myChart.data.datasets[0].data = Object.values(monthlySum);
 myChart.update();
})