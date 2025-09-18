import { loadSharedData, sharedData } from "../../../data/sharedData.js";
import { getTotalBalance, getMonthlyExpenseSum, getMonthlyIncomeSum } from "../../main.js";
import { formatCurrency, loadGetSymbol } from "../../utils/currencySymbols.js";


const labels = ['Total Balance', 'Total Income', 'Total Expenses']

export let financialOverviewChart = null;

export async function renderFinancialOverviewChart(total) {

  if (financialOverviewChart) {
    financialOverviewChart.destroy()
  }

  total = await getTotalBalance();
  let  monthlyIncomeResult = await getMonthlyIncomeSum();
  let  monthlyExpenseResult = await getMonthlyExpenseSum();
  await loadSharedData();
  const symbol = await loadGetSymbol(sharedData);

  const data = [total, monthlyIncomeResult, monthlyExpenseResult] 
  
  const financialOverview = document.getElementById('financial-overview-chart')
  
  const doughnutLabel ={
    id: 'doughnutLabel',
    beforeDatasetsDraw(chart, args, pluginOptions) {
      const {ctx, data } = chart;
      ctx.save();
  
      const xCoor = chart.getDatasetMeta(0).data[0].x
      const yCoor = chart.getDatasetMeta(0).data[0].y
      
      const fontSize = Math.round(chart.height / 20);
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${data.labels[0]}:`, xCoor, yCoor - 10)
;
      ctx.fillText(formatCurrency(total, symbol), xCoor, yCoor + 25)
      
    }
  }
  
   financialOverviewChart = new Chart(financialOverview, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        label: 'Amount',
        data,
        backgroundColor: ['rgb(68, 136, 201)', 'rgb(90, 207, 100)', 'rgb(216, 85, 67)'],
        borderWidth: 5,
        borderRadius: 5,
        hoverBackgroundColor: ['rgb(76, 154, 228, 0.97)', 'rgba(96, 224, 107, 0.97)', 'rgba(241, 84, 63, 0.97)']
        
      }]
    },
    options: {
      responsive: true,
      cutout: '65%',
      maintainAspectRatio: false,
      resizeDelay: 0,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 10,
            font: {
              size: 14,
              family: 'Arial'
            }
          }
        },
        tooltip: {
          callbacks: {
            label: (context) => {
  
              if (context.label === 'Total Income') {
                return `Amount: +${formatCurrency(context.formattedValue, symbol)} `
              }else if (context.label === 'Total Expenses') {
                return  `Amount: -${formatCurrency(context.formattedValue, symbol)}`
              }else {
                return `Amount: ${formatCurrency(context.formattedValue, symbol)}`
              }
            }
          }
        }
      }
    },
    plugins: [doughnutLabel]
      
  })

  return financialOverviewChart;
}

