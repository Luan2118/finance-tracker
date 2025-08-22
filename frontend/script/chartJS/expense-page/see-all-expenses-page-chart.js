import { monthlyExpenseSummary} from "../../../data/expenseData.js";



export let expenseChart = null;

renderExpenseChart();

async function renderExpenseChart() {

   const monthlySums = await monthlyExpenseSummary();
  
    const labels = Object.keys(monthlySums)
    const data = Object.values(monthlySums)
  
    
  
  const ctx = document.getElementById('expense-chart')
  
  expenseChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Expense Chart',
        data,
        backgroundColor: 'rgb(216, 85, 67)',
        barPercentage: 0.7,
        borderRadius: 15,
        hoverBackgroundColor: 'rgba(241, 84, 63, 0.81)',
        hoverBorderWidth: '50px'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'month'
          },
          ticks: {
            font: {
              size: 13,
              family: 'Arial'
            }
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            font: {
              size: 15,
              family: 'Arial'
            }
          }
        }
      }
    }
  })
}