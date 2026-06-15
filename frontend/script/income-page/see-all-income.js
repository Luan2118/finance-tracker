import { incomeData, loadIncomeData, updateIncomeDate, setIncomeData, monthlyIncomeSummary } from "../../data/incomeData.js";
import { formatCurrency, loadGetSymbol } from "../utils/currencySymbols.js";
import { incomeChart } from "../chartJS/income-page/see-all-income-page-chart.js";
import getUsername from "../utils/getUsername.js";
import getFormattedDate from "../utils/getFormattedDate.js";
import { setupCustomAmountFilter, filterAmountValue, customAmountClicked, amountBtnsClicked } from "../utils/see-all-income-expense-page/setupCustomAmountFilter.js";
import { setUpCustomTimelineFilter, filterTimeValue, customTimelineClicked, filterTimelineBtnsClicked } from "../utils/see-all-income-expense-page/setUpCustomTimelineFilter.js";
import formatDate from "../utils/see-all-income-expense-page/formatDate.js";
import setPastDate from "../utils/see-all-income-expense-page/setPastDate.js";
import resolveCategory from "../utils/see-all-income-expense-page/resolveCategory.js";
import { updateChart } from "../utils/updateChart.js";
import { menuIcon } from "../utils/menuIcon.js";
import getAccessToken from "../utils/getAccessToken.js";
import refreshToken from "../utils/refreshToken.js";
import { API_BASE_URL } from "../utils/apiConfig.js";


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
    const {category, emoji, incomeSourceValue, dateValue, _id, amountValue} = income;

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
        <div class="income-right-side">
          <button type="button" class="income-delete-button js-income-delete-button" data-id="${_id}" aria-label="Delete income"><img class="delete-icon" src="./icons/bin-icon.png" alt=""></button>
          <div class="income-amount-plus">+${formatCurrency(amountValue, symbol)}</div>
        </div>
      </div>
    </li>
   `

   incomeHTML += html;
  })

  document.querySelector('.js-income-info-grid').innerHTML = incomeHTML;

  await setIncomeData(allData);

  deleteButton(); 
}

function deleteButton() {
document.querySelectorAll('.js-income-delete-button')
  .forEach((link) => {
    link.addEventListener('click', async () => {
      const deleteButtonId = link.dataset.id

      let token = getAccessToken();
      try {
        let response = await fetch(`${API_BASE_URL}/income/${deleteButtonId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.status === 401) {  
          token = await refreshToken();
          sessionStorage.setItem('accessToken', token)
          response = await fetch(`${API_BASE_URL}/income/${deleteButtonId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }) 
        }

        if(!response.ok) throw new Error('Failed to delete income')

        const monthlySums = await monthlyIncomeSummary();
    
        const labels = Object.keys(monthlySums)
        const data = Object.values(monthlySums)

        updateChart(incomeChart, labels, data, 'month');

        await updateIncomeDate();
        await displayIncome();

      } catch (error) {
        console.log(error.message)
      }
        
      
    })
  })

}



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



// Category 
const category = document.getElementById('category');

// Validation msgs
const categoryValidation = document.querySelector('.category-validation-js');
const incomeFilterValidation = document.querySelector('.income-validation');


// Income range CUSTOM
setupCustomAmountFilter();

// After selecting an amount range / income range
const MAX_VALUE = 100_000_000


// Filter button - filtering income
const filterButton = document.querySelector('.filter-submit-button-js')

filterButton.addEventListener('click', async () => {
  
  document.querySelector('.income-validation').textContent = ''

  // If nothing is selected validation
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

    const filteredIncomeCustom = incomeData.filter(income => {
      const categoryValue = resolveCategory(category, income);
      if(customAmountClicked) {
        const minAmountValue = document.querySelector('.min-amount-js').value
        const maxAmountValue = document.querySelector('.max-amount-js').value

        return income.amountValue >= minAmountValue && income.amountValue <= maxAmountValue &&
        income.dateValue  >= timeFromValue && 
        income.dateValue <= timeToValue &&
        income.category === categoryValue
      }else {
        return income.amountValue <= filterAmountValue &&
        income.dateValue >= timeFromValue && income.dateValue <= timeToValue &&
        income.category === categoryValue
      }
    })

    const labels = filteredIncomeCustom.map(income => income.dateValue)
    const data = filteredIncomeCustom.map(income => income.amountValue)

    
    incomeChart.options.scales.x.time.min = timeFromValue;
    incomeChart.options.scales.x.time.max = timeToValue;
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




