import { expenseData, saveToStorageExpenses, deleteExpense, updateDate, monthlyExpenseSummary } from "../data/expenseData.js";

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


const expenseSourceInput = document.getElementById('expense-source-input')

expenseSourceInput.addEventListener('input', (event) => {
  event.target.value = event.target.value.replace(/[^a-zA-Z]/g, '')
})

const expenseAmountInput = document.getElementById('expense-amount-input')

expenseAmountInput.addEventListener('input', (event) => {
  event.target.value = event.target.value.replace(/[^0-9]/g, '')
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
          <div class="expense-amount-minus">-${dataObject.amountValue} Kč</div>
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
        const expenseSourceValue = document.querySelector('.js-expense-value').value;
        const amountValue = document.querySelector('.js-amount-value').value;
        const dateValue = document.querySelector('.js-date-value').value;

        document.querySelector('.js-expense-amount-input-alert').innerHTML = '';
        document.querySelector('.js-expense-date-input-alert').innerHTML = '';

        if (Number(amountValue) <= 0) {
          document.querySelector('.js-expense-amount-input-alert')
            .innerHTML = '<p>Amount has to be greater than 0!</p>'
    
          return;
        }

        if (!dateValue) {
          document.querySelector('.js-expense-date-input-alert')
            .innerHTML= '<p>Please pick a date!</p>'
          return;
        }

        expenseData.push({
          expenseSourceValue,
          amountValue,
          dateValue,
          id: crypto.randomUUID()
        });

        
        
        saveToStorageExpenses();
        updateDate();
        generateHTML();

        const monthlySum = monthlyExpenseSummary();

        myChart.data.labels = Object.keys(monthlySum);
        myChart.data.datasets[0].data = Object.values(monthlySum);
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


      const monthlySum = monthlyExpenseSummary();

      myChart.data.labels = Object.keys(monthlySum);
      myChart.data.datasets[0].data = Object.values(monthlySum);
      myChart.update()
      
      saveToStorageExpenses();
      generateHTML();
    })
  })
  
}
