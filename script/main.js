import { expenseData, saveToStorageExpenses } from "../data/expenseData.js";
import { incomeData, saveToStorageIncome } from "../data/incomeData.js";
import { sharedData } from "../data/sharedData.js";

displayRecentTransactions();
displayExpenses();
displayIncome();


function displayRecentTransactions() {
  let sharedDataHTML = '';
  
  sharedData.forEach((dataObject) => {
    if (dataObject.type === 'expense') {
      const html = `
        <div class="transactions-info-inner-grid">
          <div class="transaction-img-grid"><img class="transactions-img" src="icons/shopping-icon.png"></div>
          <div class="transactions-info">
            <div>
              <div>
              ${dataObject.expenseSourceValue}
              </div>
              <div class="transactions-date">${dataObject.dateValue}</div>
            </div>
            
            <div class="transactions-amount-minus">-${dataObject.amountValue}Kč</div>
          </div>
        </div>
      `
      sharedDataHTML += html
    }else if (dataObject.type === 'income') {
      const html = `
        <div class="transactions-info-inner-grid">
          <div class="transaction-img-grid"><img class="transactions-img" src="icons/salary-icon.png"></div>
          <div class="transactions-info">
            <div>
              <div>${dataObject.incomeSourceValue}</div>
              <div class="transactions-date">${dataObject.dateValue}</div>
            </div>
            
            <div class="transactions-amount-plus">+${dataObject.amountValue}Kč</div>
          </div>
        </div>
      `
      sharedDataHTML += html
    }

  
  });

  document.querySelector('.js-transactions-info-grid')
    .innerHTML = sharedDataHTML;
}

function displayExpenses() {
  let expenseDataHTML = '';

  expenseData.forEach((dataObject) => {
    const html = `
      <div class="transactions-info-inner-grid">
        <div class="transaction-img-grid"><img class="transactions-img" src="icons/shopping-icon.png"></div>
        <div class="transactions-info">
          <div>
            <div>${dataObject.expenseSourceValue}</div>
            <div class="transactions-date">${dataObject.dateValue}</div>
          </div>
          
          <div class="transactions-amount-minus">-${dataObject.amountValue}Kč</div>
        </div>
      </div>  
    `

    expenseDataHTML += html;
  })

  document.querySelector('.js-expense-transactions-info-grid').innerHTML = expenseDataHTML;

}


function displayIncome() {
  let incomeDataHTML = '';

  incomeData.forEach((dataObject) => {
    let html = `
      <div class="transactions-info-inner-grid">
        <div class="transaction-img-grid"><img class="transactions-img" src="icons/shopping-icon.png"></div>
        <div class="transactions-info">
          <div>
            <div>${dataObject.incomeSourceValue}</div>
            <div class="transactions-date">${dataObject.dateValue}</div>
          </div>
          
          <div class="transactions-amount-plus">+${dataObject.amountValue}Kč</div>
        </div>
      </div>
    `
    incomeDataHTML += html
  })

  document.querySelector('.js-income-transactions-info-grid').innerHTML = incomeDataHTML;
}
