import { expenseData, loadExpenseData, updateExpenseDate, setExpenseData, monthlyExpenseSummary } from "../../data/expenseData.js";
import { formatCurrency, loadGetSymbol } from "../utils/currencySymbols.js";
import { expenseChart } from "../chartJS/expense-page/see-all-expenses-page-chart.js";
import getUsername from "../utils/getUserName.js";
import getFormattedDate from "../utils/getFormattedDate.js"
import { updateChart } from "../utils/updateChart.js";
import {setupCustomAmountFilter, filterAmountValue, customAmountClicked} from "../utils/see-all-income-expense-page/setupCustomAmountFilter.js";
import { setUpCustomTimelineFilter, filterTimeValue, customTimelineClicked } from "../utils/see-all-income-expense-page/setUpCustomTimelineFilter.js";
import formatDate from "../utils/see-all-income-expense-page/FormatDate.js";
import setPastDate from "../utils/see-all-income-expense-page/setPastDate.js";
import resolveCategory from "../utils/see-all-income-expense-page/resolveCategory.js";
import { menuIcon } from "../utils/menuIcon.js";
import logOut from '../logout.js'

// logout
logOut();

// Menu icon
menuIcon();

// Get username
getUsername().then((data) => document.querySelector('.profile-name-js').innerHTML = data)

// get currency symbol
let symbol;
loadExpenseData().then(() => {
  loadGetSymbol(expenseData).then((data) => {
    symbol = data;
  })
})


// Generating html for expense
displayExpense();
async function displayExpense(data) {
  
  const allData = await loadExpenseData();
  await updateExpenseDate();
  
  if(data) setExpenseData(data);

  let expenseHTML = '';
  
  expenseData.forEach((expense) => {
    const {category, emoji, expenseSourceValue, dateValue, amountValue} = expense;

    const formattedDate = getFormattedDate(dateValue)

    let html = `
     <div class="expense-info-inner-grid">
      <div class="expense-img-grid">${emoji}</div>
      <div class="expense-info">
      <div>
        <div class="source-text">${expenseSourceValue}</div>
        <div class="expense-date">${formattedDate}</div>
        <div class="expense-category-display">Category: ${category}</div>
        </div>
      
        <div class="expense-amount-minus">-${formatCurrency(amountValue, symbol)}</div>
      </div>
     </div>
   `

   expenseHTML += html;
  })

  document.querySelector('.js-expense-info-grid').innerHTML = expenseHTML;

  await setExpenseData(allData);
}

// Category 
const label = document.querySelector('.label');
const category = label.querySelector('select');

// Time line Custom
setUpCustomTimelineFilter();

// Get the Date / Days
const today = new Date();
const formattedToday =  formatDate(today);


const last7Days = setPastDate(7);
const formattedLast7Days = formatDate(last7Days);

const last30Days = setPastDate(30);
const formattedLast30Days = formatDate(last30Days);


const last60Days = setPastDate(60);
const formattedLast60Days =  formatDate(last60Days);

const maxPastDate = setPastDate(1000);
const formattedMaxPastDate = formatDate(maxPastDate);

const maxFutureDate = new Date(new Date().setDate(today.getDate() + 1000));
const formattedMaxFutureDate = formatDate(maxFutureDate);




// Expense range CUSTOM
setupCustomAmountFilter()





// Filter button - filtering expense
const filterButton = document.querySelector('.filter-submit-button-js')

filterButton.addEventListener('click', async () => {
  console.log(filterAmountValue)
  document.querySelector('.expense-validation').innerHTML = ''

  if (category.value === '') {
    return document.querySelector('.category-validation-js').innerHTML = '<div>Please select a category</div>'
  }

  document.querySelector('.category-validation-js').innerHTML = ''
  
  

  // After selecting an amount range / expense range
  const MAX_VALUE = 100_000_000

 
  if (customAmountClicked === false  && category.value === 'see-all' && filterTimeValue === 'see-all' && filterAmountValue === MAX_VALUE ) {
    console.log('all see alls called')
    
    const monthlySums = await monthlyExpenseSummary();
  
    const labels = Object.keys(monthlySums)
    const data = Object.values(monthlySums)

    updateChart(expenseChart,labels, data, 'month');

    await displayExpense(expenseData)
    return;
  
  }
  
  
  // CUSTOM TIMELINE
  if(customTimelineClicked) {
    // Category validation
    console.log('called')
    const timeFromValue = document.querySelector('.time-from-js').value
    const timeToValue = document.querySelector('.time-to-js').value
    

    const timeFromValueDate = new Date(timeFromValue)
    const timeToValueDate = new Date(timeToValue)
    
    const formattedTimeFromValueDate = formatDate(timeFromValueDate)
    const formattedTimeToValueDate = formatDate(timeToValueDate)
    


    const filteredExpenseCustom = expenseData.filter(expense => {
      const categoryValue = resolveCategory(category, expense);
      return expense.dateValue >= formattedTimeFromValueDate && expense.dateValue <= formattedTimeToValueDate &&
      expense.amountValue <= filterAmountValue &&
      expense.category === categoryValue
    })


    const labels = filteredExpenseCustom.map(expense => expense.dateValue)
    const data = filteredExpenseCustom.map(expense => expense.amountValue)

    expenseChart.options.scales.x.time.min = formattedTimeFromValueDate;
    expenseChart.options.scales.x.time.max = formattedTimeToValueDate;
     updateChart(expenseChart,labels, data, 'day');

   

    if(filteredExpenseCustom.length === 0) {
      document.querySelector('.expense-validation').innerHTML = '<div> No expense matches your filter</div>'
    }
    
    console.log(filteredExpenseCustom)
    await displayExpense(filteredExpenseCustom)
    return;
  }

  
  
  

  
  // After selecting a time range/ time line 
  const timeResult = 
    filterTimeValue === '7' ? formattedLast7Days 
    : filterTimeValue === '30' ? formattedLast30Days
    : filterTimeValue === '60' ? formattedLast60Days
    : filterTimeValue === 'see-all' ? formattedMaxPastDate : ''

  const endDate = timeResult === formattedMaxPastDate ? formattedMaxFutureDate : formattedToday



   // MAIN FILTER - Specific days and expense range 
   let filteredExpense = expenseData.filter(expense => {
    // Category validation
    const categoryValue =  resolveCategory(category, expense);

    if(customAmountClicked) {
      const minAmountValue = document.querySelector('.min-amount-js').value
      const maxAmountValue = document.querySelector('.max-amount-js').value

      return expense.amountValue >= minAmountValue && expense.amountValue <= maxAmountValue &&
      expense.dateValue  >= timeResult && 
      expense.dateValue <= endDate &&
      expense.category === categoryValue
      
    } else {

      return expense.dateValue  >= timeResult && 
      expense.dateValue <= endDate  &&
      expense.amountValue <= filterAmountValue &&
      expense.category === categoryValue
    }

  })
  
  filteredExpense.sort((a, b) => new Date(b.dateValue) - new Date(a.dateValue))
  
  const labels = filteredExpense.map(expense => expense.dateValue)
  const data = filteredExpense.map(expense => expense.amountValue)
  
  
  updateChart(expenseChart,labels, data, 'day');
  
  if(filteredExpense.length === 0) {
    document.querySelector('.expense-validation').innerHTML = '<div> No expense matches your filter</div>'
  }

  await displayExpense(filteredExpense)

  
})





