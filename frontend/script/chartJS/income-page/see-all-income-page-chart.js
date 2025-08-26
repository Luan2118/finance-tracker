import { incomeData, loadIncomeData, monthlyIncomeSummary} from "../../../data/incomeData.js";
import { formatCurrency, loadGetSymbol } from "../../utils/currencySymbols.js";



export let incomeChart = null;

renderIncomeChart();

async function renderIncomeChart() {
  await loadIncomeData();
  const symbol = await loadGetSymbol(incomeData)
   const monthlySums = await monthlyIncomeSummary();
  
    const labels = Object.keys(monthlySums)
    const data = Object.values(monthlySums)
  
    
  
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
      },
      plugins: {
        legend: {
        labels: {
          font: {
            size: 18,
            family: 'Arial'
          }
        }
      },
      tooltip: {
        callbacks: {
          title: () => {
            return 'Monthly Income Summary'
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