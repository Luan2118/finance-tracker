import { loadExpenseData, expenseData } from "../../../data/expenseData.js";

let expenseChart = null;

async function renderExpenseChart() {

  if (expenseChart) {
    expenseChart.destroy();
  }
  await loadExpenseData();
  const expenseCtx = document.getElementById('main-page-expense-chart')

  const expenseChartLabels = expenseData.map(item => item.dateValue)
  const expenseChartData = expenseData.map(item => item.amountValue)

  const today = new Date();
  const last30Days = new Date(new Date().setDate(today.getDate() - 30));


  expenseChart = new Chart(expenseCtx, {
    type: 'bar',
    data: {
      labels: expenseChartLabels,
      datasets: [{
        label: 'Last 30 Days Expenses',
        data: expenseChartData,
        backgroundColor: 'rgb(216, 85, 67)',
        hoverBackgroundColor: 'rgba(241, 84, 63, 0.81)',
        barPercentage: 0.6,
        borderRadius: 15,
      }]
    },
    
    options: {
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
              size: 12,
              family: 'Arial'
            }
          }
        },
        y: {
          ticks: {
            font: {
              size: 12,
              family: 'Arial'
            }
          }
        }
    },
    plugins: {
          legend: {
            labels: {
              font: {
                size: 18,
                family: 'Ariaĺ'
              }
            }
          }
        }
      }
  })
}

export default renderExpenseChart;