import { expenseData, monthlyExpenseSummary, loadExpenseData } from "../../../data/expenseData.js"
import { loadGetSymbol, formatCurrency } from "../../utils/currencySymbols.js";



export let myExpenseChart = null;

renderExpenseChart();
export async function renderExpenseChart() {
  await loadExpenseData();

  if (myExpenseChart) {
    myExpenseChart.destroy();
  }
  
  const ctx = document.getElementById('expense-chart')
  
  if(!ctx) return;
  
  const symbol = await loadGetSymbol(expenseData)
  const monthlySum = await monthlyExpenseSummary();
  
 
  
  const labels = Object.keys(monthlySum);
  const data = Object.values(monthlySum);
  
 
  const chartData = 
  {
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
              size: (ctx) => {
                  const w = ctx.chart.width;
                  if (w < 768) return 15;

                  return 20
                }
            }
          }
        },
        y: {
          ticks: {
            font: {
              size: (ctx) => {
                  const w = ctx.chart.width;
                  if (w < 768) return 15;

                  return 20
                }
            }
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            font: {
              size: 19,
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
  
  const lastDayOfMonth = (y, m) => {
    return new Date(y , m, 0).getDate()
  }

  const firstDay = `${event.target.value}-01`;
  const lastDay = `${event.target.value}-${lastDayOfMonth(year, month)}`;

  
 
  
  myExpenseChart.options.scales.x.min = firstDay;
  myExpenseChart.options.scales.x.max = lastDay;
  myExpenseChart.options.scales.x.time.unit = 'day';
  
  myExpenseChart.data.labels = expenseData.map(data => data.dateValue);
  myExpenseChart.data.datasets[0].data = expenseData.map(data => data.amountValue);
  
  myExpenseChart.options.plugins.tooltip.callbacks.title = (context) => {
    const dataIndex = context[0].dataIndex;
    const item = expenseData[dataIndex];
    return item.expenseSourceValue;
  }
  
  myExpenseChart.update();

  
  })

  const chartResetButton = document.getElementById('chart-reset-button')

  chartResetButton.addEventListener('click', async () => {

    const monthlySum = await monthlyExpenseSummary();
    filter.value = '';

    myExpenseChart.options.scales.x.min = undefined;
    myExpenseChart.options.scales.x.max = undefined;
    myExpenseChart.options.scales.x.time.unit = 'month';

    myExpenseChart.data.labels  = Object.keys(monthlySum);
    myExpenseChart.data.datasets[0].data =  Object.values(monthlySum);
    myExpenseChart.options.plugins.tooltip.callbacks.title = () => {return ['Monthly Expense Summary']}
    
    myExpenseChart.update();
  
  })

}