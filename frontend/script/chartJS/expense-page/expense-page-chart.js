import { expenseData, monthlyExpenseSummary, loadExpenseData } from "../../../data/expenseData.js"
import { loadGetSymbol, formatCurrency } from "../../utils/currencySymbols.js";
import { updateChart } from "../../utils/updateChart.js";


export let myExpenseChart = null;

renderExpenseChart();
export async function renderExpenseChart() {
  await loadExpenseData();

  if (myExpenseChart) {
    myExpenseChart.destroy();
  }

  const canvas = document.getElementById('expense-chart')

  if(!canvas) return;

  const ctx = canvas.getContext('2d')
  
  const symbol = await loadGetSymbol(expenseData)
  const monthlySum = await monthlyExpenseSummary();
  
 
  
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
        hoverBackgroundColor: 'rgba(241, 84, 63, 0.81)',
        hoverBorderWidth: '50px'
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
              return `Amount: -${formatCurrency(context.formattedValue, symbol)}`
            }
          }
        }
      }
    }

  myExpenseChart = new Chart(ctx, {
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

  myExpenseChart.data.labels = expenseData.map(data => data.dateValue);
  myExpenseChart.data.datasets[0].data = expenseData.map(data => data.amountValue);

  const labels = expenseData.map(data => data.dateValue);
  const data =  expenseData.map(data => data.amountValue);

  
  createChart('line')
  
  myExpenseChart.options.scales.x.min = `${event.target.value}-01`;
  myExpenseChart.options.scales.x.max = `${event.target.value}-${lastDay(year, month)}`;
  
  
  myExpenseChart.options.plugins.tooltip.callbacks.title = (context) => {
    const dataIndex = context[0].dataIndex;
    const item = expenseData[dataIndex];
    return item.expenseSourceValue;
  }
  
  updateChart(myExpenseChart, labels, data, 'day' )

  
  })

  const chartResetButton = document.getElementById('chart-reset-button')

  chartResetButton.addEventListener('click', () => {
    createChart('bar')

  filter.value = '';

  myExpenseChart.options.scales.x.min = undefined;
  myExpenseChart.options.scales.x.max = undefined;

  
  const labels = Object.keys(monthlySum);
  const data = Object.values(monthlySum);

  
  myExpenseChart.options.plugins.tooltip.callbacks.title = () => {return ['Monthly Expense Summary']}
  
  updateChart(myExpenseChart, labels, data , 'month')
  
  })


  const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
  gradient.addColorStop(0, 'rgb(216, 85, 67, 0.6)');  // top
  gradient.addColorStop(0.5, 'rgb(216, 85, 67, 0.3)');
  gradient.addColorStop(1, 'rgb(216, 85, 67, 0)');    // bottom

  function createChart (chart) {
    myExpenseChart.destroy();
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
    myExpenseChart = new Chart(ctx, {
    type: chart,
    data : chartData,
    options: chartOptions
  })

}
}