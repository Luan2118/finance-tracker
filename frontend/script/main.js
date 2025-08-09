import { expenseData,  loadExpenseData,  monthlyExpenseSummary } from "../data/expenseData.js";
import { incomeData, loadIncomeData, monthlyIncomeSummary } from "../data/incomeData.js";
import { sharedData, loadSharedData } from "../data/sharedData.js";
import { menuIcon } from "./utils/menuIcon.js";
import {formatCurrency, loadGetSymbol} from './utils/currencySymbols.js'
import {incomeChart, renderIncomeChart, filteredIncome, incomeLast60DaysSum}  from "./chartJS/main-page/income-chart.js";
import renderExpenseChart from "./chartJS/main-page/expense-chart.js";
import  { financialOverviewChart, renderFinancialOverviewChart}  from "./chartJS/main-page/financial-overview-chart.js"
import logOut from "./logout.js";

import refreshToken from "./utils/refreshToken.js";

refreshToken();

// utils
menuIcon();

loadSharedData().then(() => document.querySelector('.js-currency').innerHTML = sharedData[0].currency)

let symbol;
let income60; 
let total;

logOut();
// Get summary of total balance/ expenses / incomes
let result;

export async function getTotalBalance() {
  
  const monthlyIncomeResult = await getMonthlyIncomeSum();
  const monthlyExpenseResult = await getMonthlyExpenseSum()
  
  result = Number(monthlyIncomeResult - monthlyExpenseResult).toFixed(2) 
  


  
  if (result < 0) {
    const  formattedResult = result.slice(1)
    const totalBalance = `${formattedResult < 0 ? '-' : ''}${formattedResult}`
    return totalBalance;
  }else {
    return result;
  }
}

export async function getMonthlyExpenseSum() {
  const monthlyExpenseSum = await monthlyExpenseSummary();
  
  let monthlyExpenseResult = 0
  
  Object.values(monthlyExpenseSum).forEach((expenseValue) => {
    monthlyExpenseResult += expenseValue
  })
  
  return Number(monthlyExpenseResult).toFixed(2);
}

export async function getMonthlyIncomeSum() {
  const monthlyIncomeSum = await monthlyIncomeSummary();
  let monthlyIncomeResult = 0
  
  Object.values(monthlyIncomeSum).forEach((incomeValue) => {
    monthlyIncomeResult += incomeValue
  })
  
  return Number(monthlyIncomeResult).toFixed(2);
}

// Display total balance / income / expenses
displayTotalBalance();
displayMonthlyIncomeSummary();
displayMonthlyExpenseSummary();

async function displayTotalBalance() {
  const totalBalance = await getTotalBalance();
  document.querySelector('.js-total-balance-header-summary')
  .innerHTML = formatCurrency(totalBalance, symbol)

}

async function displayMonthlyIncomeSummary() {
  await loadIncomeData();
  symbol = await loadGetSymbol(incomeData)
  
  const monthlyIncomeResult = await getMonthlyIncomeSum();
  document.querySelector('.js-income-header-summary').innerHTML = `+${formatCurrency(monthlyIncomeResult, symbol)}` 
  
}  

async function displayMonthlyExpenseSummary() {
  await loadExpenseData();
  symbol = await loadGetSymbol(expenseData)
  const monthlyExpenseResult = await getMonthlyExpenseSum()
  document.querySelector('.js-expense-header-summary').innerHTML = `-${formatCurrency(monthlyExpenseResult, symbol)}`
}  


// Display transactions / expenses / incomes
displayRecentTransactions();
displayExpenses();
displayIncome();

async function displayRecentTransactions() {
  await loadSharedData();
  symbol = await loadGetSymbol(sharedData);
  
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
  await loadExpenseData();
  symbol = await loadGetSymbol(expenseData)
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
  await loadIncomeData();
  symbol = await loadGetSymbol(incomeData);
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
  
  
  // Charts
  getTotalBalance().then((data) => total = data);
  renderFinancialOverviewChart(total)
  
  renderExpenseChart();
  
  incomeLast60DaysSum().then((data) => income60 = data)
  renderIncomeChart(income60);



  // Exchance Currency
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
      await renderFinancialOverviewChart();
  
      incomeChart.update();
      income60 = await incomeLast60DaysSum();
      await renderIncomeChart();
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
