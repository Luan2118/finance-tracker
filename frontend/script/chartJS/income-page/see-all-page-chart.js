import { incomeData, loadIncomeData } from "../../../data/incomeData.js";



export let incomeChart = null;

renderIncomeChart();

async function renderIncomeChart() {
  await loadIncomeData();

  const labels =  incomeData.map(income => income.dateValue)
  const data = incomeData.map(income => income.amountValue)
  
  const ctx = document.getElementById('income-chart')
  
  incomeChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Income Chart',
        data
      }]
    },
    options: {
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day'
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