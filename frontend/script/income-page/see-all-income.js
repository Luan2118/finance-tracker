import { incomeData, loadIncomeData, updateDate } from "../../data/incomeData.js";
import { formatCurrency, loadGetSymbol } from "../utils/currencySymbols.js";


displayIncome();
 
// get currency symbol
let symbol;

loadIncomeData().then(() => {
  loadGetSymbol(incomeData).then((data) => {
    symbol = data;
  })
})

async function displayIncome() {
  await loadIncomeData();
  await updateDate();
  let incomeHTML = '';


  incomeData.forEach((income) => {
    let html = `
     <div class="income-info-inner-grid">
     <div class="income-img-grid">${income.emoji}</div>
     <div class="income-info">
     <div>
     <div>
     ${income.incomeSourceValue}
     </div>
     <div class="income-date">${income.dateValue}</div>
     </div>
     
     <div class="income-amount-minus">+${formatCurrency(income.amountValue, symbol)}</div>
     </div>
     </div>
   `

   incomeHTML += html;
  })

 

  document.querySelector('.js-income-info-grid').innerHTML = incomeHTML;
}


