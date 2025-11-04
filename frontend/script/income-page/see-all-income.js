import { incomeData, loadIncomeData, updateIncomeDate, setIncomeData, monthlyIncomeSummary } from "../../data/incomeData.js";
import { formatCurrency, loadGetSymbol } from "../utils/currencySymbols.js";
import { incomeChart } from "../chartJS/income-page/see-all-income-page-chart.js";
import getUsername from "../utils/getUsername.js";
import getFormattedDate from "../utils/getFormattedDate.js";
import { setupCustomAmountFilter, filterAmountValue, customAmountClicked } from "../utils/see-all-income-expense-page/setupCustomAmountFilter.js";
import { setUpCustomTimelineFilter, filterTimeValue, customTimelineClicked } from "../utils/see-all-income-expense-page/setUpCustomTimelineFilter.js";
import formatDate from "../utils/see-all-income-expense-page/FormatDate.js";
import setPastDate from "../utils/see-all-income-expense-page/setPastDate.js";
import resolveCategory from "../utils/see-all-income-expense-page/resolveCategory.js";
import { updateChart } from "../utils/updateChart.js";
import { menuIcon } from "../utils/menuIcon.js";


// Menu icon
menuIcon();

// Get username
getUsername().then((data) => document.querySelector('.profile-name-js').innerHTML = data)

// get currency symbol
let symbol;
loadIncomeData().then(() => {
  loadGetSymbol(incomeData).then((data) => {
    symbol = data;
  })
})


// Generating html for income
displayIncome();
async function displayIncome(data) {
  const allData = await loadIncomeData();
  await updateIncomeDate();
  
  if(data) setIncomeData(data);

  let incomeHTML = '';
  
  incomeData.forEach((income) => {
    const {category, emoji, incomeSourceValue, dateValue, amountValue} = income;

    const formattedDate = getFormattedDate(dateValue)

    let html = `
    <li class="income-info-inner-grid">
      <div class="income-img-grid" aria-hidden="true">${emoji}</div>
      <div class="income-info">
        <div>
          <div class="source-text">${incomeSourceValue}</div>
          <div class="income-date">${formattedDate}</div>
          <div class="income-category-display">Category: ${category}</div>
        </div>
        <div class="income-amount-minus">+${formatCurrency(amountValue, symbol)}</div>
      </div>
    </li>
   `

   incomeHTML += html;
  })

  document.querySelector('.js-income-info-grid').innerHTML = incomeHTML;

  await setIncomeData(allData);
}

// Category 

const category = document.getElementById('category');
const categoryValidation = document.querySelector('.category-validation-js');
const incomeFilterValidation = document.querySelector('.income-validation');

// Time line Custom
setUpCustomTimelineFilter();

// Get the Date / Days
const today = new Date();
const formattedToday = formatDate(today);


const last7Days = setPastDate(7);
const formattedLast7Days = formatDate(last7Days);



const last30Days = setPastDate(30);
const formattedLast30Days = formatDate(last30Days);


const last60Days = setPastDate(60);
const formattedLast60Days = formatDate(last60Days);

const maxPastDate = setPastDate(1000);
const formattedMaxPastDate = formatDate(maxPastDate);

const maxFutureDate = new Date(new Date().setDate(today.getDate() + 1000));
const formattedMaxFutureDate =  formatDate(maxFutureDate);



// Income range CUSTOM
setupCustomAmountFilter();

// After selecting an amount range / income range
const MAX_VALUE = 100_000_000




// Filter button - filtering income
const filterButton = document.querySelector('.filter-submit-button-js')

filterButton.addEventListener('click', async () => {

  

  document.querySelector('.income-validation').textContent = ''
  if (category.value === '') {
    category.setAttribute('aria-invalid', 'true');
    categoryValidation.setAttribute('role', 'alert');
    return categoryValidation.textContent = 'Please select a category'
  }
  document.querySelector('.category-validation-js').textContent = ''
  category.setAttribute('aria-invalid', 'false');
  categoryValidation.removeAttribute('role');

  
  if (customAmountClicked === false  && category.value === 'see-all' && filterTimeValue === 'see-all' && filterAmountValue === MAX_VALUE ) {

    
    const monthlySums = await monthlyIncomeSummary();
  
    const labels = Object.keys(monthlySums)
    const data = Object.values(monthlySums)

    updateChart(incomeChart, labels, data, 'month');

    await displayIncome(incomeData)
    return;
  
  }
  
  
  // CUSTOM TIMELINE
  if(customTimelineClicked) {
    // Category validation
    const timeFromValue = document.querySelector('.time-from-js').value
    const timeToValue = document.querySelector('.time-to-js').value
    

    const timeFromValueDate = new Date(timeFromValue);
    const timeToValueDate = new Date(timeToValue);
    
    const formattedTimeFromValueDate = formatDate(timeFromValueDate);
    const formattedTimeToValueDate =formatDate(timeToValueDate);
    


    const filteredIncomeCustom = incomeData.filter(income => {
      const categoryValue = resolveCategory(category, income);
      return income.dateValue >= formattedTimeFromValueDate && income.dateValue <= formattedTimeToValueDate &&
      income.amountValue <= filterAmountValue &&
      income.category === categoryValue
    })


    const labels = filteredIncomeCustom.map(income => income.dateValue)
    const data = filteredIncomeCustom.map(income => income.amountValue)

    
    incomeChart.options.scales.x.time.min = formattedTimeFromValueDate;
    incomeChart.options.scales.x.time.max = formattedTimeToValueDate;
    updateChart(incomeChart, labels, data, 'day');

    if(filteredIncomeCustom.length === 0) {

      incomeFilterValidation.setAttribute('role', 'status');
       incomeFilterValidation.textContent = ' No income matches your filter'
    }
    else {
      incomeFilterValidation.removeAttribute('role');
    }

    await displayIncome(filteredIncomeCustom)
  
    return;
  }


  
  

  
  // After selecting a time range/ time line 
  const timeResult = 
    filterTimeValue === '7' ? formattedLast7Days 
    : filterTimeValue === '30' ? formattedLast30Days
    : filterTimeValue === '60' ? formattedLast60Days
    : filterTimeValue === 'see-all' ? formattedMaxPastDate : ''

  const endDate = timeResult === formattedMaxPastDate ? formattedMaxFutureDate : formattedToday



   // MAIN FILTER - Specific days and income range 
   let filteredIncome = incomeData.filter(income => {
    // Category validation
    const categoryValue = resolveCategory(category, income);

   
    if(customAmountClicked) {
      const minAmountValue = document.querySelector('.min-amount-js').value
      const maxAmountValue = document.querySelector('.max-amount-js').value

      return income.amountValue >= minAmountValue && income.amountValue <= maxAmountValue &&
      income.dateValue  >= timeResult && 
      income.dateValue <= endDate &&
      income.category === categoryValue
      
    } else {

      return income.dateValue  >= timeResult && 
      income.dateValue <= endDate  &&
      income.amountValue <= filterAmountValue &&
      income.category === categoryValue
    }

  })
  

  
  filteredIncome.sort((a, b) => new Date(b.dateValue) - new Date(a.dateValue))
  
  const labels = filteredIncome.map(income => income.dateValue)
  const data = filteredIncome.map(income => income.amountValue)
  
  
  updateChart(incomeChart, labels, data, 'day');
  
  if(filteredIncome.length === 0) {
     incomeFilterValidation.setAttribute('role', 'status');
     incomeFilterValidation.textContent = 'No income matches your filter'
  }
  else {
      incomeFilterValidation.removeAttribute('role');
    }
  await displayIncome(filteredIncome)

  
})




