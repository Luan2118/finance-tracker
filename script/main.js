import { expenseData, saveToStorageExpenses } from "../data/expenseData.js";
import { incomeData, saveToStorageIncome } from "../data/incomeData.js";
import { sharedData } from "../data/sharedData.js";

displayRecentTransactions();
displayExpenses();
displayIncome();


function displayRecentTransactions() {
  let sharedDataHTML = '';

  for (let i = 0 ; i < sharedData.length && i < 8;  i++) {
    if (sharedData[i].type === 'expense') {
      const html = `
        <div class="transactions-info-inner-grid">
          <div class="transaction-img-grid"><img class="transactions-img" src="icons/shopping-icon.png"></div>
          <div class="transactions-info">
            <div>
              <div>
              ${sharedData[i].expenseSourceValue}
              </div>
              <div class="transactions-date">${sharedData[i].dateValue}</div>
            </div>
            
            <div class="transactions-amount-minus">-${sharedData[i].amountValue}Kč</div>
          </div>
        </div>
      `
      sharedDataHTML += html

    }else if (sharedData[i].type === 'income') {
      const html = `
        <div class="transactions-info-inner-grid">
          <div class="transaction-img-grid"><img class="transactions-img" src="icons/salary-icon.png"></div>
          <div class="transactions-info">
            <div>
              <div>${sharedData[i].incomeSourceValue}</div>
              <div class="transactions-date">${sharedData[i].dateValue}</div>
            </div>
            
            <div class="transactions-amount-plus">+${sharedData[i].amountValue}Kč</div>
          </div>
        </div>
      `
      sharedDataHTML += html
    }
  }
  
  document.querySelector('.js-transactions-info-grid')
    .innerHTML = sharedDataHTML;
}

function displayExpenses() {
  let expenseDataHTML = '';

  for (let i = 0 ; i < expenseData.length && i < 5 ; i ++) {
    const html = `
      <div class="transactions-info-inner-grid">
        <div class="transaction-img-grid"><img class="transactions-img" src="icons/shopping-icon.png"></div>
        <div class="transactions-info">
          <div>
            <div>${expenseData[i].expenseSourceValue}</div>
            <div class="transactions-date">${expenseData[i].dateValue}</div>
          </div>
          
          <div class="transactions-amount-minus">-${expenseData[i].amountValue}Kč</div>
        </div>
      </div>  
    `

    expenseDataHTML += html;
  }

  document.querySelector('.js-expense-transactions-info-grid').innerHTML = expenseDataHTML;

}


function displayIncome() {
  let incomeDataHTML = '';

  for (let i = 0 ; i < incomeData.length && i < 5 ; i ++ ) {
     let html = `
      <div class="transactions-info-inner-grid">
        <div class="transaction-img-grid"><img class="transactions-img" src="icons/shopping-icon.png"></div>
        <div class="transactions-info">
          <div>
            <div>${incomeData[i].incomeSourceValue}</div>
            <div class="transactions-date">${incomeData[i].dateValue}</div>
          </div>
          
          <div class="transactions-amount-plus">+${incomeData[i].amountValue}Kč</div>
        </div>
      </div>
    `
    incomeDataHTML += html
  }
  document.querySelector('.js-income-transactions-info-grid').innerHTML = incomeDataHTML;
}


const num1 = 1;
const num2 = '1';

const result = num1 === num2;

const num3 = 'luan';

console.log(result);