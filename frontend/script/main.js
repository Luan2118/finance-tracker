import { expenseData,  loadExpenseData,  monthlyExpenseSummary } from "../data/expenseData.js";
import { incomeData, loadIncomeData, monthlyIncomeSummary } from "../data/incomeData.js";
import { sharedData, loadSharedData } from "../data/sharedData.js";
import { menuIcon } from "./utils/menuIcon.js";
import {formatCurrency, loadGetSymbol} from './utils/currencySymbols.js'

menuIcon();

loadSharedData().then(() => document.querySelector('.js-currency').innerHTML = sharedData[0].currency)

let symbol;

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



currencyOptions.addEventListener('change', async (event) => {
  await loadSharedData();
  iconSrc.src = dropDownIcon;
  const inputCurrencyId = event.target.id
  exchangeCurrency(sharedData, inputCurrencyId)
  currencyOptions.style.display = 'none';
  document.querySelector('.js-currency').innerHTML = `${inputCurrencyId}`
  
})


async function exchangeCurrency(sharedData, to) {
  try {
    await loadSharedData();

    const response = await fetch("https://api.frankfurter.dev/v1/latest?base=CAD");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);

    }

    const data =  await response.json();


    const amountsAndType = sharedData.map(item => ({
      amountValue: item.amountValue,
      type: item.type
    }))


    const from = sharedData.map(item => item.currency)
    

    const amountsInUSDAndType = amountsAndType.map((item, i) => {

      const fromCurrencies = from[i]
      const convertedToUSD =  item.amountValue / data.rates[fromCurrencies]

      return {
        amountValue: convertedToUSD,
        type: item.type
      }

    })


    const rate = data.rates[to]
    
    const convertedAmountAndType = amountsInUSDAndType.map((item, i) => {
      const convertedAmounts = to === 'CZK' ? Math.round(item.amountValue * rate) : Number(item.amountValue * rate).toFixed(2)
      const convertedCurrency = Array(amountsAndType.length).fill(to)

      return {
        amountValue: convertedAmounts,
        currency: convertedCurrency[i],
        type: item.type,
        
      }
    })
    

    sharedData.forEach((item, i) => {
      item.amountValue = convertedAmountAndType[i].amountValue;
      item.currency = convertedAmountAndType[i].currency;
      item.type = convertedAmountAndType[i].type
    });
    

    const updatedIncomes = convertedAmountAndType.filter(item => item.type === 'income')
    const updatedExpenses = convertedAmountAndType.filter(item => item.type === 'expense')

    incomeData.forEach((item, i) => {
      item.amountValue = updatedIncomes[i].amountValue,
      item.currency =  updatedIncomes[i].currency
    })
    
    try {
      const  incomeResponse = await fetch('http://localhost:3000/income', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(incomeData)
      })
      
    } catch (error) {
      console.error(error.message)
    }

    expenseData.forEach((item, i) => {
      item.amountValue = updatedExpenses[i].amountValue,
      item.currency =  updatedExpenses[i].currency
    })


    try {
      const  expenseResponse = await fetch('http://localhost:3000/expenses', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expenseData)
      })
      
    } catch (error) {
      console.error(error.message)
    }

    const totalBalance = await getTotalBalance();


    financialOverviewChart.data.datasets[0].data = [await getTotalBalance(), await getMonthlyIncomeSum(), await getMonthlyExpenseSum()]
    let filteredIncomeData = await filteredIncome();
    incomeChart.data.datasets[0].data = filteredIncomeData.map(item => item.amountValue)

    financialOverviewChart.update();
    total = await getTotalBalance();
    incomeChart.update();
    income60 = await incomeLast60DaysSum();
    menuIcon();
    await displayMonthlyIncomeSummary();
    await displayMonthlyExpenseSummary();
    await displayTotalBalance();
    await displayRecentTransactions();
    await displayExpenses();
    await displayIncome();
    

  }
  catch (error) {
    console.error(error)
  }
}



displayMonthlyIncomeSummary();
displayMonthlyExpenseSummary();
displayTotalBalance();

async function getMonthlyIncomeSum() {
  const monthlyIncomeSum = await monthlyIncomeSummary();
  let monthlyIncomeResult = 0

  Object.values(monthlyIncomeSum).forEach((incomeValue) => {
    monthlyIncomeResult += incomeValue
  })

  return monthlyIncomeResult;
}

async function displayMonthlyIncomeSummary() {
   loadExpenseData().then(() => {
    loadGetSymbol(expenseData).then((data) => {
      symbol = data
    })
  })

  const monthlyIncomeResult = await getMonthlyIncomeSum();
  document.querySelector('.js-income-header-summary').innerHTML = `+${formatCurrency(monthlyIncomeResult, symbol)}` 

}


async function getMonthlyExpenseSum() {
  const monthlyExpenseSum = await monthlyExpenseSummary();

  let monthlyExpenseResult = 0

  Object.values(monthlyExpenseSum).forEach((expenseValue) => {
    monthlyExpenseResult += expenseValue
  })

  return monthlyExpenseResult;
}

async function displayMonthlyExpenseSummary() {
   loadExpenseData().then(() => {
    loadGetSymbol(expenseData).then((data) => {
      symbol = data
    })
  })
  const monthlyExpenseResult = await getMonthlyExpenseSum()
  document.querySelector('.js-expense-header-summary').innerHTML = `-${formatCurrency(monthlyExpenseResult, symbol)}`
}

let result;

async function getTotalBalance() {
  
  const monthlyIncomeResult = await getMonthlyIncomeSum();
  const monthlyExpenseResult = await getMonthlyExpenseSum()

   result = Number(monthlyIncomeResult - monthlyExpenseResult).toFixed(2) 



  if (result < 0) {
    const  formattedResult = result.slice(1)
    const totalBalance = `${formattedResult < 0 ? '-' : ''}${formatCurrency(formattedResult, symbol)}`
    return totalBalance;
  }else {
    return result
  }
}


async function displayTotalBalance() {
  const totalBalance = await getTotalBalance();
  document.querySelector('.js-total-balance-header-summary')
    .innerHTML = formatCurrency(totalBalance, symbol)
}





displayRecentTransactions();
displayExpenses();
displayIncome();



async function displayRecentTransactions() {
  loadSharedData().then(() => {
    loadGetSymbol(sharedData).then((data) => {
      symbol = data
    })
  })

  await loadSharedData();
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
            
            <div class="transactions-amount-minus">-${formatCurrency(sharedData[i].amountValue, symbol)}</div>
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
            
            <div class="transactions-amount-plus">+${formatCurrency(sharedData[i].amountValue, symbol)} </div>
          </div>
        </div>
      `
      sharedDataHTML += html
    }
  }
  
  document.querySelector('.js-transactions-info-grid')
    .innerHTML = sharedDataHTML;
}

async function displayExpenses() {
  loadExpenseData().then(() => {
    loadGetSymbol(expenseData).then((data) => {
      symbol = data
    })
  })

  await loadExpenseData();
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
          
          <div class="transactions-amount-minus">-${formatCurrency(expenseData[i].amountValue, symbol)} </div>
        </div>
      </div>  
    `

    expenseDataHTML += html;
  }

  document.querySelector('.js-expense-transactions-info-grid').innerHTML = expenseDataHTML;

}


async function displayIncome() {
  loadIncomeData().then(() => {
    loadGetSymbol(incomeData).then((data) => {
      symbol = data
    })
  })
  await loadIncomeData();
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
          
          <div class="transactions-amount-plus">+${formatCurrency(incomeData[i].amountValue, symbol)} </div>
        </div>
      </div>
    `
    incomeDataHTML += html
  }
  document.querySelector('.js-income-transactions-info-grid').innerHTML = incomeDataHTML;
}



  const labels = ['Total Balance', 'Total Income', 'Total Expenses']


  financialOverview();

let financialOverviewChart;
let total;
getTotalBalance().then((data) => total = data)

async function financialOverview() {
  let  monthlyIncomeResult = await getMonthlyIncomeSum();
  let  monthlyExpenseResult = await getMonthlyExpenseSum()

  const data = [total, monthlyIncomeResult, monthlyExpenseResult] 
  
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
      ctx.textBaseline = 'middle';
      ctx.fillText(`${data.labels[0]}:`, xCoor, yCoor - 10)
;
      ctx.fillText(formatCurrency(total, symbol), xCoor, yCoor + 20)
      
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
                return `Amount: + ${formatCurrency(context.formattedValue, symbol)} `
              }else if (context.label === 'Total Expenses') {
                return  `Amount: -${formatCurrency(context.formattedValue, symbol)}`
              }else {
                return `Amount:${formatCurrency(context.formattedValue, symbol)} }`
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


renderExpenseChart();

async function renderExpenseChart() {
  await loadExpenseData();
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




  const incomeCtx = document.getElementById('main-page-income-chart')


  const today1 = new Date()
  const yearMonthToday = `${today1.getFullYear()}-${String(today1.getMonth() + 1).padStart(2, '0')}`

  const last60 = new Date(new Date().setDate(today1.getDate() - 60))
  const yearMonthLast60 = `${last60.getFullYear()}-${String(last60.getMonth() + 1).padStart(2, '0')}`




async function filteredIncome() {
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


  let filteredIncomeData;

async function incomeLast60DaysSum() {
  filteredIncomeData = await filteredIncome();
  const last60DaysIncomeSum = filteredIncomeData.reduce((sum, item) => {
  const result = sum + Number(item.amountValue);
    return result;
  }, 0)

  return last60DaysIncomeSum.toFixed(2);
}




  let incomeChartLabels;
  let incomeChartData;

async function setupIncomeChart() {
  filteredIncomeData = await filteredIncome();
  incomeChartLabels = filteredIncomeData.map(item => item.incomeSourceValue);
  incomeChartData = filteredIncomeData.map(item => item.amountValue);
}

setupIncomeChart();

incomeChartMain();

let incomeChart;
let income60;

incomeLast60DaysSum().then((data) => income60 = data)
async function incomeChartMain() {
  await setupIncomeChart();
  await filteredIncome();

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
      ctx.fillText(`${formatCurrency(income60, symbol)} `, xCoor, yCoor + 10)
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
              return `Amount: ${formatCurrency(context.formattedValue, symbol)}`
            }
          }
        }
      }
    },
    plugins: [incomeDoughnutLabel]
  })

  
}  
