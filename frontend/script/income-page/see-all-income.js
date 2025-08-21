import { incomeData, loadIncomeData, updateDate, setIncomeData, monthlyIncomeSummary } from "../../data/incomeData.js";
import { formatCurrency, loadGetSymbol } from "../utils/currencySymbols.js";
import { incomeChart } from "../chartJS/income-page/see-all-page-chart.js";

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
  await updateDate();
  
  if(data) setIncomeData(data);

  console.log(allData)
  console.log(data)
  let incomeHTML = '';
  
  incomeData.forEach((income) => {
    const {emoji, incomeSourceValue, dateValue, amountValue} = income;

    const formattedDate = dateValue.substring(8,10) + '-' + dateValue.substring(5,7) + '-' +  dateValue.substring(0, 4)

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


// Income range filter
const filterAmount = document.querySelectorAll('.filter-button-amount')
let filterAmountValue;

filterAmount.forEach((buttonAmount) => {
  buttonAmount.addEventListener('click', () => {
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
  
  if (category.value === 'see-all' && filterTimeValue === 'see-all' && filterAmountValue === MAX_VALUE) {

    const monthlySums = await monthlyIncomeSummary();
  
    const labels = Object.keys(monthlySums)
    const data = Object.values(monthlySums)

    incomeChart.data.labels = labels;
    incomeChart.data.datasets[0].data = data; 

    incomeChart.options.scales.x.time.unit = 'month';
    incomeChart.update();

    await displayIncome(incomeData)
    return;
  
  }
  
  
 console.log(customTimelineClicked)
  
  // CUSTOM TIMELINE
  if(customTimelineClicked) {
    // Category validation
    console.log('called')
    const timeFromValue = document.querySelector('.time-from-js').value
    const timeToValue = document.querySelector('.time-to-js').value
    
    console.log(timeFromValue)
    console.log(timeToValue)
    const timeFromValueDate = new Date(timeFromValue)
    const timeToValueDate = new Date(timeToValue)
    
    const formattedTimeFromValueDate = `${timeFromValueDate.getFullYear()}-${String(timeFromValueDate.getMonth() + 1).padStart(2, '0')}-${timeFromValueDate.getDate()}`
    const formattedTimeToValueDate = `${timeToValueDate.getFullYear()}-${String(timeToValueDate.getMonth() + 1).padStart(2, '0')}-${timeToValueDate.getDate()}`
    


    const filteredIncomeCustom = incomeData.filter(income => {
      const categoryValue = category.value === 'see-all' ? income.category : category.value
      return income.dateValue >= formattedTimeFromValueDate && income.dateValue <= formattedTimeToValueDate &&
      income.amountValue <= filterAmountValue &&
      income.category === categoryValue
    })


    const labels = filteredIncomeCustom.map(income => income.dateValue)
    const data = filteredIncomeCustom.map(income => income.amountValue)

    incomeChart.data.labels = labels;
    incomeChart.data.datasets[0].data = data;

    incomeChart.options.scales.x.time.min = formattedTimeFromValueDate;
    incomeChart.options.scales.x.time.max = formattedTimeToValueDate;
    incomeChart.options.scales.x.time.unit = 'day';
    incomeChart.update();

    if(filteredIncomeCustom.length === 0) {
      document.querySelector('.income-validation').innerHTML = '<div> No income matches your filter</div>'
    }
    
    console.log(filteredIncomeCustom)
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
    console.log('called')
      // Category validation
      const categoryValue = category.value === 'see-all' ? income.category : category.value
      // console.log(categoryValue)    
      // console.log(timeResult)
      // console.log(filterAmountValue)
     return income.dateValue  >= timeResult && 
     income.dateValue <= endDate  &&
     income.amountValue <= filterAmountValue &&
     income.category === categoryValue
    })
    
    filteredIncome.sort((a, b) => new Date(b.dateValue) - new Date(a.dateValue))
 
    const labels = filteredIncome.map(income => income.dateValue)
    const data = filteredIncome.map(income => income.amountValue)
    

    incomeChart.data.labels = labels;
    incomeChart.data.datasets[0].data = data;
    incomeChart.options.scales.x.time.unit = 'day';
 
    incomeChart.update();

    if(filteredIncome.length === 0) {
      document.querySelector('.income-validation').innerHTML = '<div> No income matches your filter</div>'
    }



    console.log(filteredIncome)
    await displayIncome(filteredIncome)
     
    })

