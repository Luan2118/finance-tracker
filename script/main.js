import { expenseData, saveToStorageExpenses, monthlyExpenseSummary } from "../data/expenseData.js";
import { incomeData, saveToStorageIncome,monthlyIncomeSummary } from "../data/incomeData.js";
import { sharedData } from "../data/sharedData.js";
import { menuIcon } from "./utils/menuIcon.js";
import { getSymbol } from "./utils/currencySymbols.js";



menuIcon();

document.querySelector('.js-currency').innerHTML = sharedData[0].currency

const currencySymbol = getSymbol(sharedData)

const dropDownIconBtn = document.getElementById('drop-down-icon')

const iconSrc = document.querySelector('#drop-down-box img')
const dropDownIcon = 'icons/dropdown-arrow-icon.png';
const dropUpIcon = 'icons/dropup-arrow-icon.png';

const currencyOptions = document.getElementById('options')

dropDownIconBtn.addEventListener('click', () => {
  if (iconSrc.src.includes(dropDownIcon)) {
    iconSrc.src = dropUpIcon;
    currencyOptions.style.display = 'block';
  }else {
    iconSrc.src = dropDownIcon;
    currencyOptions.style.display = 'none';
  }
})

currencyOptions.addEventListener('change', (event) => {
      const inputCurrencyId = event.target.id
      exchangeCurrency(sharedData, inputCurrencyId)
      iconSrc.src = dropDownIcon;
      currencyOptions.style.display = 'none';
      document.querySelector('.js-currency').innerHTML = `${inputCurrencyId}`
      
    })


async function exchangeCurrency(sharedData, to) {
  try {
    const response = await fetch("https://v6.exchangerate-api.com/v6/2f5cad1e5ec297d380f5a8ce/latest/USD");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);

    }

    const data =  await response.json();

   
    if (data.result !== 'success') {
      throw new Error('API returned failure:', data);
      return;
    }

    const amountsAndType = sharedData.map(item => ({
      amounValue: item.amountValue,
      type: item.type
    }))
    const from = sharedData.map(item => item.currency)

    
    if (from === 'USD') {
      return;

    }else {
      const amountsInUSDAndType = amountsAndType.map((item, i) => {
        const fromCurrencies = from[i]
        const convertedToUSD =  item.amounValue / data.conversion_rates[fromCurrencies]

        return {
          amountValue: convertedToUSD,
          type: item.type
        }

      })


      const rate = data.conversion_rates[to]
      
      const convertedAmountAndType = amountsInUSDAndType.map((item, i) => {
        const convertedAmounts = Number(item.amountValue * rate).toFixed(2)
        const convertedCurrency = Array(amountsAndType.length).fill(to)

        return {
          amountValue: convertedAmounts,
          currency: convertedCurrency[i],
          type: item.type,
          
        }
      })

      convertedAmountAndType.forEach((amount) => {
        if(amount.type ==='income') {
          incomeData.forEach((item) => {
            Object.assign(item, {
              amountValue: amount.amountValue,
              currency: amount.currency
            })
          })
           saveToStorageIncome();
        }

        if(amount.type === 'expense') {
          expenseData.forEach((item) => {
            Object.assign(item, {
              amountValue: amount.amountValue,
              currency: amount.currency
            })
          })
           saveToStorageExpenses();
        }

        setTimeout(() => {
          menuIcon();
          displayMonthlyIncomeSummary();
          displayMonthlyExpenseSummary();
          displayTotalBalance();
          displayRecentTransactions();
          displayExpenses();
          displayIncome();
        }, 200)

      })
    }
  }
  catch (error) {
    console.error(error)
  }
}


displayMonthlyIncomeSummary();
displayMonthlyExpenseSummary();
displayTotalBalance();

function getMonthlyIncomeSum() {
  const monthlyIncomeSum = monthlyIncomeSummary();
  let monthlyIncomeResult = 0

  Object.values(monthlyIncomeSum).forEach((incomeValue) => {
    monthlyIncomeResult += incomeValue
  })

  return monthlyIncomeResult;
}

function displayMonthlyIncomeSummary() {
  const monthlyIncomeResult = getMonthlyIncomeSum();
  document.querySelector('.js-income-header-summary').innerHTML = `+${currencySymbol !== 'Kč' ? currencySymbol : ''}${monthlyIncomeResult} ${currencySymbol === 'Kč' ? currencySymbol : ''}`
  
}

function getMonthlyExpenseSum() {
  const monthlyExpenseSum = monthlyExpenseSummary();

  let monthlyExpenseResult = 0

  Object.values(monthlyExpenseSum).forEach((expenseValue) => {
    monthlyExpenseResult += expenseValue
  })

  return monthlyExpenseResult;
}

function displayMonthlyExpenseSummary() {
  const monthlyExpenseResult = getMonthlyExpenseSum()
  document.querySelector('.js-expense-header-summary').innerHTML = `-${currencySymbol !== 'Kč' ? currencySymbol : ''}${monthlyExpenseResult} ${currencySymbol === 'Kč' ? currencySymbol : ''}`
}

function getTotalBalance() {
  const monthlyIncomeResult = getMonthlyIncomeSum();
  const monthlyExpenseResult = getMonthlyExpenseSum()

  const totalBalance = Number(monthlyIncomeResult - monthlyExpenseResult).toFixed(2) 


  return totalBalance;
}

function displayTotalBalance() {
  const totalBalance = getTotalBalance();
  const formattedBalance = `${totalBalance >= 0 ? '+' : ''}${currencySymbol !== 'Kč' ? currencySymbol : ''}${totalBalance} ${currencySymbol === 'Kč' ? currencySymbol : ''}`
  document.querySelector('.js-total-balance-header-summary')
    .innerHTML = `${formattedBalance}`
}





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
            
            <div class="transactions-amount-minus">-${currencySymbol !== 'Kč' ? currencySymbol: ''}${sharedData[i].amountValue} ${currencySymbol === 'Kč' ? currencySymbol : ''}</div>
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
            
            <div class="transactions-amount-plus">+${currencySymbol !== 'Kč' ? currencySymbol: ''}${sharedData[i].amountValue} ${currencySymbol === 'Kč' ? currencySymbol : ''}</div>
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
          
          <div class="transactions-amount-minus">-${currencySymbol !== 'Kč' ? currencySymbol: ''}${expenseData[i].amountValue} ${currencySymbol === 'Kč' ? currencySymbol : ''}</div>
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
          
          <div class="transactions-amount-plus">+${currencySymbol !== 'Kč' ? currencySymbol: ''}${incomeData[i].amountValue} ${currencySymbol === 'Kč' ? currencySymbol : ''}</div>
        </div>
      </div>
    `
    incomeDataHTML += html
  }
  document.querySelector('.js-income-transactions-info-grid').innerHTML = incomeDataHTML;
}

renderFinancialOverviewChart();

function renderFinancialOverviewChart() {
  const labels = ['Total Balance', 'Total Income', 'Total Expenses']

  const data = [getTotalBalance(), getMonthlyIncomeSum(), getMonthlyExpenseSum()]


  const financialOverview = document.getElementById('financial-overview-chart')

  const doughnutLabel ={
    id: 'doughnutLabel',
    beforeDatasetsDraw(chart, args, pluginOptions) {
      const {ctx, data } = chart;
      ctx.save();

      const xCoor = chart.getDatasetMeta(0).data[0].x
      const yCoor = chart.getDatasetMeta(0).data[0].y
      
      const fontSize = Math.round(chart.height / 16);
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.textBaseLine = 'middle';
      ctx.fillText(`${data.labels[0]}:`, xCoor, yCoor - 10)
      
      ctx.fillText(`${currencySymbol !== 'Kč' ? currencySymbol : ''}${data.datasets[0].data[0]} ${currencySymbol === 'Kč' ? currencySymbol : ''}`, xCoor, yCoor + 20)
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
                return `Amount: + ${currencySymbol !== 'Kč' ? currencySymbol : ''}${context.formattedValue} ${currencySymbol === 'Kč' ? currencySymbol : ''}`
              }else if (context.label === 'Total Expenses') {
                return  `Amount: -${currencySymbol !== 'Kč' ? currencySymbol : ''}${context.formattedValue} ${currencySymbol === 'Kč' ? currencySymbol : ''}`
              }else {
                return `Amount: ${currencySymbol !== 'Kč' ? currencySymbol : ''}${context.formattedValue} ${currencySymbol === 'Kč' ? currencySymbol : ''}`
              }
            }
          }
        }
      }
    },
    plugins: [doughnutLabel]
      
  })
}

renderExpenseChart();

function renderExpenseChart() {
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
}

renderIncomeChart();

function renderIncomeChart() {
  const incomeCtx = document.getElementById('main-page-income-chart')


  const today1 = new Date()
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
      
      const fontSize = Math.round(chart.height / 16);
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.fillStyle = 'black'
      ctx.textAlign = 'center';
      ctx.textBaseLine = 'middle'
      ctx.fillText('Total Income:', xCoor, yCoor - 10)
      ctx.fillText(`${currencySymbol !== 'Kč' ? currencySymbol : ''}${last60DaysIncomeSum} ${currencySymbol === 'Kč' ? currencySymbol : ''}`, xCoor, yCoor + 10)
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
              size: 14,
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
              return `Amount: ${currencySymbol !== 'Kč' ? currencySymbol : ''}${context.formattedValue} ${currencySymbol === 'Kč' ? currencySymbol : ''}`
            }
          }
        }
      }
    },
    plugins: [incomeDoughnutLabel]
  })

}