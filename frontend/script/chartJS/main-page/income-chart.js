import { loadIncomeData, incomeData } from "../../../data/incomeData.js"
import { formatCurrency, loadGetSymbol } from "../../utils/currencySymbols.js"
import setPastDate from "../../utils/see-all-income-expense-page/setPastDate.js"
import formatDate from "../../utils/see-all-income-expense-page/FormatDate.js"


const today1 = new Date()
const yearMonthToday = `${today1.getFullYear()}-${String(today1.getMonth() + 1).padStart(2, '0')}`

const last60 = setPastDate(60)
const yearMonthLast60 = `${last60.getFullYear()}-${String(last60.getMonth() + 1).padStart(2, '0')}`

let filteredIncomeData;

export async function filteredIncome() {
  await loadIncomeData();
  const filteredIncomeData = incomeData.filter(item => {
    const yearMonth = item.dateValue.substring(0, 7)
    return yearMonth <= yearMonthToday && yearMonth >= yearMonthLast60
  })
  .map(item => ({
    incomeSourceValue: item.incomeSourceValue,
    dateValue: item.dateValue,
    amountValue: item.amountValue
  }))
  

  return filteredIncomeData;
}


export async function incomeLast60DaysSum() {
  filteredIncomeData = await filteredIncome();
  const last60DaysIncomeSum = filteredIncomeData.reduce((sum, item) => {
    const result = sum + Number(item.amountValue);
    return result;
  }, 0)
  
  return last60DaysIncomeSum.toFixed(2);
}

export let incomeChart = null;


export async function renderIncomeChart(income60) {
  
  if (incomeChart) {
    incomeChart.destroy();
  }
  await loadIncomeData();
  const symbol = await loadGetSymbol(incomeData);
  income60 = await incomeLast60DaysSum();
  
  filteredIncomeData = await filteredIncome();
  const incomeChartLabels = filteredIncomeData.map(item => item.incomeSourceValue);
  const incomeChartData = filteredIncomeData.map(item => item.amountValue);
  
  const incomeCtx = document.getElementById('main-page-income-chart');
  if(filteredIncomeData.length === 0) return;
  
  const incomeDoughnutLabel = {
    id: 'incomeDoughnutLabel',
    beforeDatasetsDraw(chart, args, pluginOptions) {
      const {ctx, data} = chart;
      ctx.save();
      
    
      
      const xCoor = chart.getDatasetMeta(0).data[0].x
      const yCoor = chart.getDatasetMeta(0).data[0].y
      
      
      const fontSize = Math.round(chart.height / 18);
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.fillStyle = 'black'
      ctx.textAlign = 'center';
      ctx.textBaseLine = 'middle'
      ctx.fillText('Total Income:', xCoor, yCoor - 10)
      ctx.fillText(`${formatCurrency(income60, symbol)} `, xCoor, yCoor + 25)
    }
  }
  
    incomeChart = new Chart(incomeCtx, {
    type: 'doughnut',
    data:{
      labels: incomeChartLabels,
      datasets: [{
        label: 'Last 60 days Income',
        data: incomeChartData,
        borderWidth: 5,
        borderRadius: 5,
  
      }]  
    },
    options: {
      cutout: '65%',
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 35,
            padding: 10,
            font: {
              size: (ctx) => {
                  const w = ctx.chart.width;
                  if (w < 350) return 12  ;
                  if (w < 768) return 17;

                  return 20
                }
            }
          }
        },
        tooltip: {
          callbacks: {
            title: (context) => {
              const dataIndex = context[0].dataIndex;
              const item = filteredIncomeData[dataIndex];
  
              return item.incomeSourceValue
            },
            label: (context) => {
              return `Amount: ${formatCurrency(context.formattedValue, symbol)}`
            }
          }
        }
      }
    },
    plugins: [incomeDoughnutLabel]
  })
}  

