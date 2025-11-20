import { expenseData, loadExpenseData, monthlyExpenseSummary} from "../../../data/expenseData.js";
import { formatCurrency, loadGetSymbol } from "../../utils/currencySymbols.js";



export let expenseChart = null;

renderExpenseChart();

async function renderExpenseChart() {
  await loadExpenseData();
  const symbol = await loadGetSymbol(expenseData);

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
        backgroundColor: 'rgb(192, 88, 74)',
        barPercentage: 0.7,
        borderRadius: 15,
        hoverBackgroundColor: 'rgba(214, 117, 104, 0.81)',
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
            return 'Monthly Expense Summary'
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