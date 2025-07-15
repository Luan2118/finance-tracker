import { expenseData, monthlyExpenseSummary } from "../../data/expenseData.js"

const ctx = document.getElementById('expense-chart').getContext('2d')

const monthlySum = monthlyExpenseSummary();

const labels = Object.keys(monthlySum);
const data = Object.values(monthlySum);

const chartData = {
    labels,
    datasets: [{
      label: 'Expenses',
      data,
      backgroundColor: 'rgb(216, 85, 67)',
      barPercentage: 0.7,
      borderRadius: 15,
      hoverBackgroundColor: 'rgba(241, 84, 63, 0.81)'
    }]
  }

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'month',
        },
        ticks: {
          font: {
            size: 15,
            family: 'Arial'
          }
        }
      },
      y: {
        ticks: {
          font: {
            size: 15,
            family: 'Arial'
          }
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          font: {
            size: 19,
            family: 'Arial'
          }
        }
      },
      tooltip: {
        callbacks: {
          title: () => {
            return 'Monthly Expense Summary';
          },
          label: (context) => {
            return `Amount: ${context.formattedValue} Kč`
          }
        }
      }
    }
  }

export let myChart = new Chart(ctx, {
  type: 'bar',
  data: chartData,
  options: chartOptions
})


const filter = document.getElementById('chart-filter')

filter.addEventListener('change', (event) => {
 const year = event.target.value.substring(0, 4);
 const month = event.target.value.substring(5, 7);
 
 const lastDay = (y, m) => {
  return new Date(y , m, 0).getDate()
 }

 myChart.data.labels = expenseData.map(data => data.dateValue);
 myChart.data.datasets[0].data = expenseData.map(data => data.amountValue);

 createChart('line')

 myChart.options.scales.x.min = `${event.target.value}-01`;
 myChart.options.scales.x.max = `${event.target.value}-${lastDay(year, month)}`;
 myChart.options.scales.x.time.unit = 'day';

 myChart.options.plugins.tooltip.callbacks.title = (context) => {
  const dataIndex = context[0].dataIndex;
  const item = expenseData[dataIndex];
  return item.expenseSourceValue;
 }


 myChart.update();
})

const chartResetButton = document.getElementById('chart-reset-button')

chartResetButton.addEventListener('click', () => {
  createChart('bar')

 filter.value = '';

 myChart.options.scales.x.min = undefined;
 myChart.options.scales.x.max = undefined;
 myChart.options.scales.x.time.unit = 'month';

 myChart.data.labels = Object.keys(monthlySum);
 myChart.data.datasets[0].data = Object.values(monthlySum);

 myChart.options.plugins.tooltip.callbacks.title = () => {return ['Monthly Expense Summary']}

 myChart.update();
})


const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
gradient.addColorStop(0, 'rgb(216, 85, 67, 0.6)');  // top
gradient.addColorStop(0.5, 'rgb(216, 85, 67, 0.3)');
gradient.addColorStop(1, 'rgb(216, 85, 67, 0)');    // bottom

function createChart (chart) {
  myChart.destroy();
  if (chart === 'line') {
    chartData.datasets[0] = {
      ...chartData.datasets[0],
      backgroundColor: gradient,
      borderColor: 'rgb(216, 85, 67)',
      borderWidth: 5,
      tension: 0.4,
      fill: {
        target: true,
      }
    }
  }else {
    chartData.datasets[0] = {
      ...chartData.datasets[0],
      backgroundColor: 'rgb(216, 85, 67)'
    }
  }
  myChart = new Chart(ctx, {
  type: chart,
  data : chartData,
  options: chartOptions
 })

}