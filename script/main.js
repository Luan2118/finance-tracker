import { expenseData, saveToStorageExpenses, monthlyExpenseSummary } from "../data/expenseData.js";
import { incomeData, saveToStorageIncome,monthlyIncomeSummary } from "../data/incomeData.js";
import { sharedData } from "../data/sharedData.js";





const monthlyIncomeSum = monthlyIncomeSummary();
let monthlyIncomeResult = 0

Object.values(monthlyIncomeSum).forEach((incomeValue) => {
  monthlyIncomeResult += incomeValue
})

document.querySelector('.js-income-header-summary').innerHTML = `+${monthlyIncomeResult} Kč`



const monthlyExpenseSum = monthlyExpenseSummary();

let monthlyExpenseResult = 0

Object.values(monthlyExpenseSum).forEach((expenseValue) => {
  monthlyExpenseResult += expenseValue
})

document.querySelector('.js-expense-header-summary').innerHTML = ` -${monthlyExpenseResult} Kč`


const totalBalance = monthlyIncomeResult - monthlyExpenseResult 
const formattedBalance = `${totalBalance >= 0 ? '+' : ''}${totalBalance} Kč`

document.querySelector('.js-total-balance-header-summary')
  .innerHTML = `${formattedBalance}`




displayRecentTransactions();
displayExpenses();
displayIncome();



function displayRecentTransactions() {
  let sharedDataHTML = '';

  for (let i = 0 ; i < sharedData.length && i < 8;  i++) {
    if (sharedData[i].type === 'expense') {
      const html = `
        <div class="transactions-info-inner-grid">
          <div class="transaction-img-grid">${sharedData[i].emoji}</div>
          <div class="transactions-info">
            <div>
              <div>
              ${sharedData[i].expenseSourceValue}
              </div>
              <div class="transactions-date">${sharedData[i].dateValue}</div>
            </div>
            
            <div class="transactions-amount-minus">-${sharedData[i].amountValue} Kč</div>
          </div>
        </div>
      `
      sharedDataHTML += html

    }else if (sharedData[i].type === 'income') {
      const html = `
        <div class="transactions-info-inner-grid">
          <div class="transaction-img-grid">${sharedData[i].emoji}</div>
          <div class="transactions-info">
            <div>
              <div>${sharedData[i].incomeSourceValue}</div>
              <div class="transactions-date">${sharedData[i].dateValue}</div>
            </div>
            
            <div class="transactions-amount-plus">+${sharedData[i].amountValue} Kč</div>
          </div>
        </div>
      `
      sharedDataHTML += html
    }
  }
  
  document.querySelector('.js-transactions-info-grid')
    .innerHTML = sharedDataHTML;
}

function displayExpenses() {
  let expenseDataHTML = '';

  for (let i = 0 ; i < expenseData.length && i < 5 ; i ++) {
    const html = `
      <div class="transactions-info-inner-grid">
        <div class="transaction-img-grid">${expenseData[i].emoji}</div>
        <div class="transactions-info">
          <div>
            <div>${expenseData[i].expenseSourceValue}</div>
            <div class="transactions-date">${expenseData[i].dateValue}</div>
          </div>
          
          <div class="transactions-amount-minus">-${expenseData[i].amountValue} Kč</div>
        </div>
      </div>  
    `

    expenseDataHTML += html;
  }

  document.querySelector('.js-expense-transactions-info-grid').innerHTML = expenseDataHTML;

}


function displayIncome() {
  let incomeDataHTML = '';

  for (let i = 0 ; i < incomeData.length && i < 5 ; i ++ ) {
     let html = `
      <div class="transactions-info-inner-grid">
        <div class="transaction-img-grid">${incomeData[i].emoji}</div>
        <div class="transactions-info">
          <div>
            <div>${incomeData[i].incomeSourceValue}</div>
            <div class="transactions-date">${incomeData[i].dateValue}</div>
          </div>
          
          <div class="transactions-amount-plus">+${incomeData[i].amountValue} Kč</div>
        </div>
      </div>
    `
    incomeDataHTML += html
  }
  document.querySelector('.js-income-transactions-info-grid').innerHTML = incomeDataHTML;
}



const labels = ['Total Balance', 'Total Income', 'Total Expenses']

const data = [totalBalance, monthlyIncomeResult, monthlyExpenseResult]


const financialOverview = document.getElementById('financial-overview-chart')

const doughnutLabel ={
  id: 'doughnutLabel',
  beforeDatasetsDraw(chart, args, pluginOptions) {
    const {ctx, data } = chart;
    ctx.save();

    const xCoor = chart.getDatasetMeta(0).data[0].x
    const yCoor = chart.getDatasetMeta(0).data[0].y
    ctx.font = 'bold 25px Ariel';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseLine = 'middle';
    ctx.fillText(`${data.labels[0]}:`, xCoor, yCoor - 10)
    
    ctx.fillText(`${data.datasets[0].data[0]} Kč`, xCoor, yCoor + 20)
  }
}
const financialOverviewChart = new Chart(financialOverview, {
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
    cutout: '65%',
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          font: {
            size: 16,
            family: 'Arial'
          }
        }
      },
       tooltip: {
        callbacks: {
          label: (context) => {

            if (context.label === 'Total Income') {
              return `Amount: +${context.formattedValue} Kč`
            }else if (context.label === 'Total Expenses') {
              return  `Amount: -${context.formattedValue} Kč`
            }else {
              return `Amount: ${context.formattedValue}Kč`
            }
          }
        }
       }
    }
  },
  plugins: [doughnutLabel]
    
})


const expenseCtx = document.getElementById('main-page-expense-chart')

const expenseChartLabels = expenseData.map(item => item.dateValue)
const expenseChartData = expenseData.map(item => item.amountValue)



const today = new Date();
const last30Days = new Date(new Date().setDate(today.getDate() - 30));




const expenseChart = new Chart(expenseCtx, {
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

const incomeCtx = document.getElementById('main-page-income-chart')


const today1 = new Date()
console.log(today1)
const yearMonthToday = `${today1.getFullYear()}-${String(today1.getMonth() + 1).padStart(2, '0')}`

const last60 = new Date(new Date().setDate(today1.getDate() - 60))
const yearMonthLast60 = `${last60.getFullYear()}-${String(last60.getMonth() + 1).padStart(2, '0')}`


const filteredIncomeData = incomeData.filter(item => {
  const yearMonth = item.dateValue.substring(0, 7)
  return yearMonth <= yearMonthToday && yearMonth >= yearMonthLast60
})
.map(item => ({
  incomeSourceValue: item.incomeSourceValue,
  dateValue: item.dateValue,
  amountValue: item.amountValue
}))

const last60DaysIncomeSum = filteredIncomeData.reduce((sum, item) => {
  const result = sum + Number(item.amountValue);
  return result;
}, 0)



const incomeChartLabels = filteredIncomeData.map(item => item.incomeSourceValue);
const incomeChartData = filteredIncomeData.map(item => item.amountValue);


const incomeDoughnutLabel = {
  id: 'incomeDoughnutLabel',
  beforeDatasetsDraw(chart, args, pluginOptions) {
    const {ctx, data} = chart;
    ctx.save();

    const xCoor = chart.getDatasetMeta(0).data[0].x
    const yCoor = chart.getDatasetMeta(0).data[0].y

    ctx.font = 'bold 18px Arial';
    ctx.fillStyle = 'black'
    ctx.textAlign = 'center';
    ctx.textBaseLine = 'middle'
    ctx.fillText('Total Income:', xCoor, yCoor - 10)
    ctx.fillText(`${last60DaysIncomeSum} Kč`, xCoor, yCoor + 20)
  }
}

const incomeChart = new Chart(incomeCtx, {
  type: 'doughnut',
  data:{
    labels: incomeChartLabels,
    datasets: [{
      label: 'Last 60 days Income',
      data: incomeChartData,
      borderWidth: 5,
      borderRadius: 5
    }]  
  },
  options: {
    cutout: '65%',
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          font: {
            size: 15,
            family: 'Arial'
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
            return `Amount: ${context.formattedValue} Kč`
          }
        }
      }
    }
  },
  plugins: [incomeDoughnutLabel]
})


