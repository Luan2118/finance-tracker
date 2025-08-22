import { incomeData, loadIncomeData, updateDate, setIncomeData, monthlyIncomeSummary } from "../../data/incomeData.js";
import { formatCurrency, loadGetSymbol } from "../utils/currencySymbols.js";
import { incomeChart } from "../chartJS/income-page/see-all-income-page-chart.js";
import getUsername from "../utils/getUserName.js";
import getFormattedDate from "../utils/getFormattedDate.js";

// Get username
getUsername().then((data) => document.querySelector('.profile-name-js').innerHTML = data)

// get currency symbol
let symbol;
loadIncomeData().then(() => {
  loadGetSymbol(incomeData).then((data) => {
    symbol = data;
    console.log(symbol)
  })
})


// Generating html for income
displayIncome();
async function displayIncome(data) {
  const allData = await loadIncomeData();
  await updateDate();
  
  if(data) setIncomeData(data);

  let incomeHTML = '';
  
  incomeData.forEach((income) => {
    const {emoji, incomeSourceValue, dateValue, amountValue} = income;

    const formattedDate = getFormattedDate(dateValue)

    let html = `
     <div class="income-info-inner-grid">
     <div class="income-img-grid">${emoji}</div>
     <div class="income-info">
     <div>
     <div>
     ${incomeSourceValue}
     </div>
     <div class="income-date">${formattedDate}</div>
     </div>
     
     <div class="income-amount-minus">+${formatCurrency(amountValue, symbol)}</div>
     </div>
     </div>
   `

   incomeHTML += html;
  })

  document.querySelector('.js-income-info-grid').innerHTML = incomeHTML;

  await setIncomeData(allData);
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
const formattedToday = formatDate(today);


const last7Days = setDate(7);
const formattedLast7Days = formatDate(last7Days);



const last30Days = setDate(30);
const formattedLast30Days = formatDate(last30Days);


const last60Days = setDate(60);
const formattedLast60Days = formatDate(last60Days);

const maxPastDate = setDate(1000);
const formattedMaxPastDate = formatDate(maxPastDate);

const maxFutureDate = new Date(new Date().setDate(today.getDate() + 1000));
const formattedMaxFutureDate =  formatDate(maxFutureDate);



// Income range CUSTOM
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


// Income range filter
const filterAmount = document.querySelectorAll('.filter-button-amount')
let filterAmountValue;
let filteramountclicked;

filterAmount.forEach((buttonAmount) => {
  buttonAmount.addEventListener('click', () => {
    filteramountclicked = true
    customAmountClicked = false
    
    minAmountId.style.display = 'none';
    maxAmountId.style.display = 'none';
    document.querySelector('.special2')?.classList.remove('special2')
    buttonAmount.classList.add('special2')
    filterAmountValue = Number(buttonAmount.value)

  })
})


// After selecting an amount range / income range
const MAX_VALUE = 100_000_000



// Filter button - filtering income
const filterButton = document.querySelector('.filter-submit-button-js')

filterButton.addEventListener('click', async () => {

  document.querySelector('.income-validation').innerHTML = ''
  if (category.value === '') {
    return document.querySelector('.category-validation-js').innerHTML = '<div>Please select a category</div>'
  }
  document.querySelector('.category-validation-js').innerHTML = ''
  
  
  filterAmountValue = Number.isNaN(filterAmountValue) || filterAmountValue === undefined ? MAX_VALUE : filterAmountValue
  

 
  if (customAmountClicked === false  && category.value === 'see-all' && filterTimeValue === 'see-all' && filterAmountValue === MAX_VALUE ) {

    
    const monthlySums = await monthlyIncomeSummary();
  
    const labels = Object.keys(monthlySums)
    const data = Object.values(monthlySums)

    updateChart(labels, data, 'month');

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
      const categoryValue = resolveCategory(income);
      return income.dateValue >= formattedTimeFromValueDate && income.dateValue <= formattedTimeToValueDate &&
      income.amountValue <= filterAmountValue &&
      income.category === categoryValue
    })


    const labels = filteredIncomeCustom.map(income => income.dateValue)
    const data = filteredIncomeCustom.map(income => income.amountValue)

    
    incomeChart.options.scales.x.time.min = formattedTimeFromValueDate;
    incomeChart.options.scales.x.time.max = formattedTimeToValueDate;
    updateChart(labels, data, 'day');

    if(filteredIncomeCustom.length === 0) {
      document.querySelector('.income-validation').innerHTML = '<div> No income matches your filter</div>'
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
    const categoryValue = resolveCategory(income);

    console.log(customAmountClicked)
    if(customAmountClicked) {
      const minAmountValue = document.querySelector('.min-amount-js').value
      const maxAmountValue = document.querySelector('.max-amount-js').value

      console.log(minAmountValue);
      console.log(maxAmountValue);
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
  
  console.log(filteredIncome);
  
  filteredIncome.sort((a, b) => new Date(b.dateValue) - new Date(a.dateValue))
  
  const labels = filteredIncome.map(income => income.dateValue)
  const data = filteredIncome.map(income => income.amountValue)
  
  
  updateChart(labels, data, 'day');
  
  if(filteredIncome.length === 0) {
    document.querySelector('.income-validation').innerHTML = '<div> No income matches your filter</div>'
  }
  
  await displayIncome(filteredIncome)

  
})


function resolveCategory(income) {
 return category.value === 'see-all' ? income.category : category.value
  e
}

function updateChart(labels, data, unit) {
  incomeChart.data.labels = labels;
  incomeChart.data.datasets[0].data = data;
  incomeChart.options.scales.x.time.unit = unit;
  
  incomeChart.update();
}

function setDate(number) {
  return new Date(new Date().setDate(today.getDate() - number))
}

function formatDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}