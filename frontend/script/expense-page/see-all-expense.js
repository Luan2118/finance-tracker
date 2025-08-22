import { expenseData, loadExpenseData, updateDate, setExpenseData, monthlyExpenseSummary } from "../../data/expenseData.js";
import { formatCurrency, loadGetSymbol } from "../utils/currencySymbols.js";
import { expenseChart } from "../chartJS/expense-page/see-all-expenses-page-chart.js";
import getUsername from "../utils/getrUserName.js";


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
  await updateDate();
  
  if(data) setExpenseData(data);

  let expenseHTML = '';
  
  expenseData.forEach((expense) => {
    const {emoji, expenseSourceValue, dateValue, amountValue} = expense;

    const formattedDate = dateValue.substring(8,10) + '-' + dateValue.substring(5,7) + '-' +  dateValue.substring(0, 4)

    let html = `
     <div class="expense-info-inner-grid">
     <div class="expense-img-grid">${emoji}</div>
     <div class="expense-info">
     <div>
     <div>
     ${expenseSourceValue}
     </div>
     <div class="expense-date">${formattedDate}</div>
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
const filterTimeCustonBtn = document.querySelector('.filter-button-timeline-custom-js')
let customTimelineClicked;


const timeFromId = document.getElementById('time-from');
const timeToId = document.getElementById('time-to');

filterTimeCustonBtn.addEventListener('click', () => {
  customTimelineClicked = true;

  document.querySelector('.special')?.classList.remove('special');
  filterTimeCustonBtn.classList.add('special');
  
  timeFromId.innerHTML = 'From<input class="time-from-js" type="date">';
  timeToId.innerHTML =  'To<input class="time-to-js" type="date">';
  
  if (timeFromId.style.display === 'block' || timeToId.style.display === 'block') {
    timeFromId.style.display = 'none';
    timeToId.style.display = 'none';
  } else {
    timeFromId.style.display = 'block';
    timeToId.style.display = 'block';
  }
})

// Time line Filter
const filterTime = document.querySelectorAll('.filter-button-timeline')
let filterTimeValue;

filterTime.forEach((buttonTime) => {
  buttonTime.addEventListener('click', () => {
    customTimelineClicked = false;
    timeFromId.style.display = 'none';
    timeToId.style.display = 'none';

    document.querySelector('.special')?.classList.remove('special');
    buttonTime.classList.add('special');
    filterTimeValue = buttonTime.value;
  })
})



// Get the Date / Days
const today = new Date();
const formattedToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`


const last7Days = new Date(new Date().setDate(today.getDate() - 7))
const formattedLast7Days = `${last7Days.getFullYear()}-${String(last7Days.getMonth() + 1).padStart(2, '0')}-${String(last7Days.getDate()).padStart(2, '0')}`



const last30Days = new Date(new Date().setDate(today.getDate() - 30))
const formattedLast30Days = `${last30Days.getFullYear()}-${String(last30Days.getMonth() + 1).padStart(2, '0')}-${String(last30Days.getDate()).padStart(2, '0')}`


const last60Days = new Date(new Date().setDate(today.getDate() - 60))
const formattedLast60Days = `${last60Days.getFullYear()}-${String(last60Days.getMonth() + 1).padStart(2, '0')}-${String(last60Days.getDate()).padStart(2, '0')}`

const maxPastDate = new Date(new Date().setDate(today.getDate() - 1000))
const formattedMaxPastDate = `${maxPastDate.getFullYear()}-${String(maxPastDate.getMonth() + 1).padStart(2, '0')}-${String(maxPastDate.getDate()).padStart(2, '0')}`

const maxFutureDate = new Date(new Date().setDate(today.getDate() + 1000))
const formattedMaxFutureDate = `${maxFutureDate.getFullYear()}-${String(maxFutureDate.getMonth() + 1).padStart(2, '0')}-${String(maxFutureDate.getDate()).padStart(2, '0')}`




// Expense range CUSTOM
const filterAmountCustonBtn = document.querySelector('.filter-button-amount-custom-js')
let customAmountClicked;


const minAmountId = document.getElementById('min-amount');
const maxAmountId = document.getElementById('max-amount');

filterAmountCustonBtn.addEventListener('click', () => {
  customAmountClicked = true;

  document.querySelector('.special2')?.classList.remove('special2');
  filterAmountCustonBtn.classList.add('special2');
  
  minAmountId.innerHTML = 'Min<input class="min-amount-js" type="number">';
  maxAmountId.innerHTML =  'Max<input class="max-amount-js" type="number">';
  
  if (minAmountId.style.display === 'block' || maxAmountId.style.display === 'block') {
    minAmountId.style.display = 'none';
    maxAmountId.style.display = 'none';
  } else {
    minAmountId.style.display = 'block';
    maxAmountId.style.display = 'block';
  }
})




// Expense range filter
const filterAmount = document.querySelectorAll('.filter-button-amount')
let filterAmountValue;
let filteramountclicked;

filterAmount.forEach((buttonAmount) => {
  buttonAmount.addEventListener('click', () => {
    filteramountclicked = true
    customAmountClicked = false
    console.log(customAmountClicked)
    minAmountId.style.display = 'none';
    maxAmountId.style.display = 'none';
    document.querySelector('.special2')?.classList.remove('special2')
    buttonAmount.classList.add('special2')
    filterAmountValue = Number(buttonAmount.value)

  })
})


// After selecting an amount range / expense range
const MAX_VALUE = 100_000_000



// Filter button - filtering expense
const filterButton = document.querySelector('.filter-submit-button-js')

filterButton.addEventListener('click', async () => {

  document.querySelector('.expense-validation').innerHTML = ''

  if (category.value === '') {
    return document.querySelector('.category-validation-js').innerHTML = '<div>Please select a category</div>'
  }

  document.querySelector('.category-validation-js').innerHTML = ''
  
  
  filterAmountValue = Number.isNaN(filterAmountValue) || filterAmountValue === undefined ? MAX_VALUE : filterAmountValue
  

 
  if (customAmountClicked === false  && category.value === 'see-all' && filterTimeValue === 'see-all' && filterAmountValue === MAX_VALUE ) {
    console.log('all see alls called')
    
    const monthlySums = await monthlyExpenseSummary();
  
    const labels = Object.keys(monthlySums)
    const data = Object.values(monthlySums)

    expenseChart.data.labels = labels;
    expenseChart.data.datasets[0].data = data; 

    expenseChart.options.scales.x.time.unit = 'month';
    expenseChart.update();

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
    
    const formattedTimeFromValueDate = `${timeFromValueDate.getFullYear()}-${String(timeFromValueDate.getMonth() + 1).padStart(2, '0')}-${timeFromValueDate.getDate()}`
    const formattedTimeToValueDate = `${timeToValueDate.getFullYear()}-${String(timeToValueDate.getMonth() + 1).padStart(2, '0')}-${timeToValueDate.getDate()}`
    


    const filteredExpenseCustom = expenseData.filter(expense => {
      const categoryValue = category.value === 'see-all' ? expense.category : category.value
      return expense.dateValue >= formattedTimeFromValueDate && expense.dateValue <= formattedTimeToValueDate &&
      expense.amountValue <= filterAmountValue &&
      expense.category === categoryValue
    })


    const labels = filteredExpenseCustom.map(expense => expense.dateValue)
    const data = filteredExpenseCustom.map(expense => expense.amountValue)

    expenseChart.data.labels = labels;
    expenseChart.data.datasets[0].data = data;

    expenseChart.options.scales.x.time.min = formattedTimeFromValueDate;
    expenseChart.options.scales.x.time.max = formattedTimeToValueDate;
    expenseChart.options.scales.x.time.unit = 'day';
    expenseChart.update();

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
    console.log('called')
    // Category validation
    const categoryValue = category.value === 'see-all' ? expense.category : category.value


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
  
  
  expenseChart.data.labels = labels;
  expenseChart.data.datasets[0].data = data;
  expenseChart.options.scales.x.time.unit = 'day';
  
  expenseChart.update();
  
  if(filteredExpense.length === 0) {
    document.querySelector('.expense-validation').innerHTML = '<div> No expense matches your filter</div>'
  }
  
  
  
  console.log(filteredExpense)
  await displayExpense(filteredExpense)

  
})

