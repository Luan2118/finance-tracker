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
        backgroundColor: 'rgb(75, 173, 83)',
        barPercentage: 0.7,
        borderRadius: 15,
        hoverBackgroundColor: 'rgba(88, 206, 98, 0.81)',
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
              size: (ctx) => {
                  const w = ctx.chart.width;
                  if (w < 768) return 15;

                  return 20
                }
            }
          }
        },
        y: {
          beginAtZero: true,
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