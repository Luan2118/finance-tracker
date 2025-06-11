import { expenseData, monthlyExpenseSummary } from "../../data/expenseData.js"

const ctx = document.getElementById('expense-chart')

const monthlySum = monthlyExpenseSummary();

const labels = Object.keys(monthlySum);
const data = Object.values(monthlySum);

const chartData = {
    labels,
    datasets: [{
      label: 'Expenses',
      data,
      backgroundColor: '#E50B54'
    }]
  }

const chartOptions = {
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

 createChart('line')


 myChart.options.scales.x.min = `${event.target.value}-01`;
 myChart.options.scales.x.max = `${event.target.value}-${lastDay(year, month)}`;
 myChart.options.scales.x.time.unit = 'day';
 

 myChart.data.labels = expenseData.map(data => data.dateValue);
 myChart.data.datasets[0].data = expenseData.map(data => data.amountValue);


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




function createChart (chart) {
  myChart.destroy();
  myChart = new Chart(ctx, {
  type: chart,
  data : chartData,
  options: chartOptions
 })

}