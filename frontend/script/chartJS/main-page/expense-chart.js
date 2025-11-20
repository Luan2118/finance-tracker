import { loadExpenseData, expenseData } from "../../../data/expenseData.js";
import { formatCurrency, loadGetSymbol } from "../../utils/currencySymbols.js";

let expenseChart = null;

async function renderMainPageExpenseChart() {

  if (expenseChart) {
    expenseChart.destroy();
  }
  await loadExpenseData();

  const symbol = await loadGetSymbol(expenseData);
  const expenseCtx = document.getElementById('main-page-expense-chart')
  
  const today = new Date();
  const last30Days = new Date(new Date().setDate(today.getDate() - 30));

  const formattedToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  const formattedLast30Days = `${last30Days.getFullYear()}-${String(last30Days.getMonth() + 1).padStart(2, '0')}-${String(last30Days.getDate()).padStart(2, '0')}`


  const filteredExpense = expenseData.filter(expense => {
    return expense.dateValue <= formattedToday && expense.dateValue >= formattedLast30Days
  })
  const expenseChartLabels = filteredExpense.map(expense => expense.dateValue)
  const expenseChartData = filteredExpense.map(expense => expense.amountValue)



  expenseChart = new Chart(expenseCtx, {
    type: 'bar',
    data: {
      labels: expenseChartLabels,
      datasets: [{
        label: '',
        data: expenseChartData,
        backgroundColor: 'rgb(192, 88, 74)',
        hoverBackgroundColor: 'rgba(214, 117, 104, 0.81)',
        barPercentage: 0.6,
        borderRadius: 15,
      }]
    },
    
    options: {
      cutout: '65%',
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          min: last30Days,
          max: today,
          type: 'time',
          time: {
            unit: 'day'
          },
          ticks: {
            font: {
              size: (ctx) => {
                  const w = ctx.chart.width;
                  if (w < 768) return 12;

                  return 16
                }
            }
          }
        },
        y: {
          ticks: {
            font: {
              size: (ctx) => {
                  const w = ctx.chart.width;
                  if (w < 768) return 12;

                  return 16
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
              title: (context) => {
                const dataIndex = context[0].dataIndex;
                const item = filteredExpense[dataIndex]
                return item.expenseSourceValue
              },
              label: (context) => {
                return `Amount: ${formatCurrency(context.formattedValue, symbol)}`
              }
            }
          }
        }
      }
  })
}

export default renderMainPageExpenseChart;