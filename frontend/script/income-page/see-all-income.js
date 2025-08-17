import { incomeData, loadIncomeData, updateDate, setIncomeData } from "../../data/incomeData.js";
import { formatCurrency, loadGetSymbol } from "../utils/currencySymbols.js";
import { incomeChart } from "../chartJS/income-page/see-all-page-chart.js";

incomeData;
const MAX_VALUE = 100_000_000

displayIncome();
 
// get currency symbol
let symbol;

loadIncomeData().then(() => {
  loadGetSymbol(incomeData).then((data) => {
    symbol = data;
  })
})

async function displayIncome(data) {
  const allData = await loadIncomeData();
  await updateDate();

  if(data) setIncomeData(data)

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

  await setIncomeData(allData)
}

const label = document.querySelector('.label')
const category = label.querySelector('select')




const filterTime = document.querySelectorAll('.filter-button-timeline')
let filterTimeValue;

filterTime.forEach((buttonTime) => {
  buttonTime.addEventListener('click', () => {
    document.querySelector('.special')?.classList.remove('special')
     buttonTime.classList.add('special')
     filterTimeValue = buttonTime.value
  })
})


const filterAmount = document.querySelectorAll('.filter-button-amount')
let filterAmountValue;

filterAmount.forEach((buttonAmount) => {
  buttonAmount.addEventListener('click', () => {
    document.querySelector('.special2')?.classList.remove('special2')
    buttonAmount.classList.add('special2')
    filterAmountValue = Number(buttonAmount.value)
  })
})


const filterButton = document.querySelector('.filter-submit-button-js')

filterButton.addEventListener('click', async () => {
  

  if (category.value === '') {
    return document.querySelector('.category-validation-js').innerHTML = '<div>Please select a category</div>'
  }

  document.querySelector('.category-validation-js').innerHTML = ''

  const today = new Date();
  const formattedToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

 
  const last7Days = new Date(new Date().setDate(today.getDate() - 7))
  const formattedLast7Days = `${last7Days.getFullYear()}-${String(last7Days.getMonth() + 1).padStart(2, '0')}-${String(last7Days.getDate()).padStart(2, '0')}`



  const last30Days = new Date(new Date().setDate(today.getDate() - 30))
  const formattedLast30Days = `${last30Days.getFullYear()}-${String(last30Days.getMonth() + 1).padStart(2, '0')}-${String(last30Days.getDate()).padStart(2, '0')}`


  const last60Days = new Date(new Date().setDate(today.getDate() - 60))
  const formattedLast60Days = `${last60Days.getFullYear()}-${String(last60Days.getMonth() + 1).padStart(2, '0')}-${String(last60Days.getDate()).padStart(2, '0')}`


  const timeResult = 
    filterTimeValue === '7' ? formattedLast7Days 
    : filterTimeValue === '30' ? formattedLast30Days
    : filterTimeValue === '60' ? formattedLast60Days
    // :  filterTimeValue === 'see-all' ? ''
    : ''

  
   filterAmountValue = Number.isNaN(filterAmountValue) ? MAX_VALUE : filterAmountValue

   
   let filteredIncome = incomeData.filter(income => {
     const categoryValue = category.value === 'see-all' ? income.category : category.value
     return income.dateValue <= formattedToday && income.dateValue >= timeResult &&
     income.amountValue <= filterAmountValue &&
     income.category === categoryValue
   }
    
  )

  
   await displayIncome(filteredIncome)
})

