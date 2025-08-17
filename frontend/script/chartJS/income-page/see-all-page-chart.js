import { monthlyIncomeSummary} from "../../../data/incomeData.js";



export let incomeChart = null;

renderIncomeChart();

async function renderIncomeChart() {

   const monthlySums = await monthlyIncomeSummary();
  
    const labels = Object.keys(monthlySums)
    const data = Object.values(monthlySums)
  
    console.log(monthlySums)
  
  const ctx = document.getElementById('income-chart')
  
  incomeChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Income Chart',
        data,
        backgroundColor: ['rgb(90, 207, 100)'],
        barPercentage: 0.7,
        borderRadius: 15,
        hoverBackgroundColor: 'rgba(96, 224, 107, 0.81)',
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