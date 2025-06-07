import { expenseData, saveToStorageExpenses, deleteExpense, updateDate } from "../data/expenseData.js";

import { myChart } from "./chartJS/expenseChartJS.js";

const dialog = document.getElementById('add-expense-dialog')


document.querySelector('.js-add-expense-button')
  .addEventListener('click', () => {
    dialog.showModal();
  })

document.querySelector('.js-add-expense-popup-close')
  .addEventListener('click', () => {
    dialog.close();
  })

generateHTML();
submitExpense();
deleteExpenseButton();


function generateHTML() {
let dataHTML = '';

expenseData.forEach((dataObject) => {
  const html = `
    <div class="each-expense">
      <div class="expense-info-inner-grid">
      <div class="expense-img-grid"><img class="expense-img" src="icons/shopping-icon.png"></div>
      <div class="expense-info">
        <div>
          <div>${dataObject.expenseSourceValue}</div>
          <div class="expense-date">${dataObject.dateValue}</div>
        </div>
        
        <div class="expense-right-side">
          <div class="expense-delete-button-grid"><button class="expense-delete-button js-expense-delete-button" data-id="${dataObject.id}">X</button></div>
          <div class="expense-amount-minus">-${dataObject.amountValue}Kč</div>
        </div>
      </div>
      </div>
    </div>
  `
  dataHTML += html;
})

document.querySelector('.js-each-expense-grid')
  .innerHTML = dataHTML;

deleteExpenseButton();

}

function submitExpense() {
  document.querySelectorAll('.js-add-expense-button-submit')
    .forEach((click) => {
      click.addEventListener('click', () => {
        const expenseSourceValue = document.querySelector('.js-expense-value').value
        const amountValue = document.querySelector('.js-amount-value').value
        const dateValue = document.querySelector('.js-date-value').value
        const id = crypto.randomUUID()

        expenseData.push({
          expenseSourceValue,
          amountValue,
          dateValue,
          id
        });

        

        saveToStorageExpenses();
        updateDate();
        generateHTML();
        const labels = expenseData.map(item => item.dateValue);
        const data = expenseData.map(item => item.amountValue);

        myChart.data.labels = labels
        myChart.data.datasets[0].data = data
        myChart.update()

        
        
        dialog.close();
      })
    })
  
}

function deleteExpenseButton () {
  document.querySelectorAll('.js-expense-delete-button') 
  .forEach((button) => {
    button.addEventListener('click', () => {
      const deleteExpenseId = button.dataset.id;
      deleteExpense(deleteExpenseId);
      saveToStorageExpenses();
      generateHTML();
      const labels = expenseData.map(item => item.dateValue)
      const data = expenseData.map(item => item.amountValue)

      myChart.data.labels = labels
      myChart.data.datasets[0].data = data
      myChart.update()
      

    })
  })
  
}
