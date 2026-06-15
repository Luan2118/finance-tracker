import { expenseData, loadExpenseData, updateExpenseDate, setExpenseData, monthlyExpenseSummary } from "../../data/expenseData.js";
import { formatCurrency, loadGetSymbol } from "../utils/currencySymbols.js";
import { expenseChart } from "../chartJS/expense-page/see-all-expenses-page-chart.js";
import getUsername from "../utils/getUsername.js";
import getFormattedDate from "../utils/getFormattedDate.js"
import { updateChart } from "../utils/updateChart.js";
import {setupCustomAmountFilter, filterAmountValue, customAmountClicked, amountBtnsClicked} from "../utils/see-all-income-expense-page/setupCustomAmountFilter.js";
import { setUpCustomTimelineFilter, filterTimeValue, customTimelineClicked, filterTimelineBtnsClicked } from "../utils/see-all-income-expense-page/setUpCustomTimelineFilter.js";
import formatDate from "../utils/see-all-income-expense-page/formatDate.js";
import setPastDate from "../utils/see-all-income-expense-page/setPastDate.js";
import resolveCategory from "../utils/see-all-income-expense-page/resolveCategory.js";
import { menuIcon } from "../utils/menuIcon.js";
import logOut from '../logout.js'
import getAccessToken from "../utils/getAccessToken.js";
import refreshToken from "../utils/refreshToken.js";
import { API_BASE_URL } from "../utils/apiConfig.js";

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
    const {category, emoji, expenseSourceValue, dateValue, _id, amountValue} = expense;

    const formattedDate = getFormattedDate(dateValue)

    let html = `
     <li class="expense-info-inner-grid">
      <div class="expense-img-grid" aria-hidden="true">${emoji}</div>
      <div class="expense-info">
      <div>
        <div class="source-text">${expenseSourceValue}</div>
        <div class="expense-date">${formattedDate}</div>
        <div class="expense-category-display">Category: ${category}</div>
        </div>
      
        <div class="expense-right-side">
            <button type="button" class="expense-delete-button js-expense-delete-button" data-id="${_id}" aria-label="Delete expense"><img class="delete-icon" src="./icons/bin-icon.png" alt=""></button>
            <div class="expense-amount-minus">-${formatCurrency(amountValue, symbol)}
            </div>
          </div>
      </div>
     </li>
   `

   expenseHTML += html;
  })

  document.querySelector('.js-expense-info-grid').innerHTML = expenseHTML;

  await setExpenseData(allData);
  deleteExpenseButton();
}

function deleteExpenseButton () {
  document.querySelectorAll('.js-expense-delete-button') 
  .forEach((button) => {
    button.addEventListener('click', async () => {
      const deleteExpenseId = button.dataset.id;

      let token = getAccessToken();
      try {
        const response = await fetch(`${API_BASE_URL}/expenses/${deleteExpenseId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.status === 401) {  
          token = await refreshToken();
          sessionStorage.setItem('accessToken', token)
          response = await fetch(`${API_BASE_URL}/expenses/${deleteExpenseId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }) 
        }

        if (!response.ok) throw new Error('Failed to delete expense')
        
        const monthlySums = await monthlyExpenseSummary();
              
        const labels = Object.keys(monthlySums)
        const data = Object.values(monthlySums)

        updateChart(expenseChart, labels, data, 'month');
        
        await updateExpenseDate();
        await displayExpense();
      } catch (error) {
        console.error(error.message)
      }
    })
  })
  
}


// Category 
const label = document.querySelector('.label');
const category = document.getElementById('category');
const categoryValidation = document.querySelector('.category-validation-js');
const expenseFilterValidation = document.querySelector('.expense-validation');

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

  document.querySelector('.expense-validation').textContent = ''

  let hasError;
  
  if (category.value === '') {
    hasError = true;
    category.setAttribute('aria-invalid', 'true');
    categoryValidation.setAttribute('role', 'alert');
    categoryValidation.textContent = 'Please select a category'
  }else {
    categoryValidation.textContent = ''
    category.setAttribute('aria-invalid', 'false');
    categoryValidation.removeAttribute('role');
  }

  const timelineValidationMsg = document.querySelector('.timeline-error-message-js');

  if(!customTimelineClicked && !filterTimelineBtnsClicked) {
    hasError = true;
    timelineValidationMsg.setAttribute('role', 'alert')
    timelineValidationMsg.textContent = 'Please select a timeline filter';
  }else {
    timelineValidationMsg.textContent = '';
    timelineValidationMsg.removeAttribute('role')
  }

  const amountValidationMsg = document.querySelector('.amount-validation-js');

  if(!customAmountClicked && !amountBtnsClicked) {
    hasError = true;
    amountValidationMsg.setAttribute('role', 'alert')
    amountValidationMsg.textContent = 'Please select an amount filter';
  }else {
    amountValidationMsg.textContent = '';
    amountValidationMsg.removeAttribute('role')
  }
  
    if(hasError) return;


  // After selecting an amount range / expense range
  const MAX_VALUE = 100_000_000

 
  if (customAmountClicked === false  && category.value === 'see-all' && filterTimeValue === 'see-all' && filterAmountValue === MAX_VALUE ) {
    
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
    const timeFromValue = document.querySelector('.time-from-js').value
    const timeToValue = document.querySelector('.time-to-js').value
    
    const filteredExpenseCustom = expenseData.filter(expense => {

    if(customAmountClicked) {
    const minAmountValue = document.querySelector('.min-amount-js').value
    const maxAmountValue = document.querySelector('.max-amount-js').value

    return expense.amountValue >= minAmountValue && expense.amountValue <= maxAmountValue &&
    expense.dateValue  >= timeFromValue && 
    expense.dateValue <= timeToValue &&
    expense.category === categoryValue
  
    }else {
      const categoryValue = resolveCategory(category, expense);
      return expense.dateValue >= timeFromValue && expense.dateValue <= timeToValue &&
      expense.amountValue <= filterAmountValue &&
      expense.category === categoryValue
    }
  })


    const labels = filteredExpenseCustom.map(expense => expense.dateValue)
    const data = filteredExpenseCustom.map(expense => expense.amountValue)

    expenseChart.options.scales.x.time.min = timeFromValue;
    expenseChart.options.scales.x.time.max = timeToValue;
     updateChart(expenseChart,labels, data, 'day');

   

    if(filteredExpenseCustom.length === 0) {
      expenseFilterValidation.setAttribute('role', 'status');
      expenseFilterValidation.textContent = 'No expense matches your filter'
    }
    else {
      expenseFilterValidation.removeAttribute('role');
    }
    
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
    expenseFilterValidation.setAttribute('role', 'status');
    expenseFilterValidation.textContent = ' No expense matches your filter'
  }
  else {
      expenseFilterValidation.removeAttribute('role');
  }
  await displayExpense(filteredExpense)

  
})





