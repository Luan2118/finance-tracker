import { expenseData, saveToStorageExpenses, deleteExpense, updateDate, monthlyExpenseSummary } from "../data/expenseData.js";
import { myChart } from "./chartJS/expenseChartJS.js";
import {iconPicker} from './utils/icon-picker.js'
import { menuIcon } from "./utils/menuIcon.js";
import {getSymbol} from './utils/currencySymbols.js'


menuIcon();

const dialog = document.getElementById('add-expense-dialog')

document.querySelector('.js-add-expense-button')
  .addEventListener('click', () => {
    dialog.showModal();
  })

function handleClosePopUp(event) {
  if (event.type === 'click') {
    dialog.close();
  }

  if (event.type === 'keydown' && event.key === 'Enter') {
    event.preventDefault();
  }
}

const popUpCloseButton = document.querySelector('.js-add-expense-popup-close')

popUpCloseButton.addEventListener('click', handleClosePopUp)


popUpCloseButton.addEventListener('keydown', handleClosePopUp)



iconPicker();


const expenseSourceInput = document.getElementById('expense-source-input')

expenseSourceInput.addEventListener('input', (event) => {
  event.target.value = event.target.value.replace(/[^a-zA-Z\- ]/g, '')
})

const expenseAmountInput = document.getElementById('expense-amount-input')

expenseAmountInput.addEventListener('input', (event) => {
  event.target.value = event.target.value.replace(/[^0-9]/g, '')
})

const dialogForm = document.querySelector('.js-add-expense-form')



generateHTML();
submitExpense();

console.log(expenseData)





function generateHTML() {
  const currencySymbol = getSymbol(expenseData);

  let dataHTML = '';

  expenseData.forEach((dataObject) => {
    const html = `
      <div class="each-expense">
        <div class="expense-info-inner-grid">
        <div class="expense-img-grid">${dataObject.emoji}</div>
        <div class="expense-info">
          <div>
            <div>${dataObject.expenseSourceValue}</div>
            <div class="expense-date">${dataObject.dateValue}</div>
          </div>
          
          <div class="expense-right-side">
            <div class="expense-delete-button-grid"><button class="expense-delete-button js-expense-delete-button" data-id="${dataObject.id}"><img class="delete-icon" src="../icons/bin-icon.png"></button></div>
            <div class="expense-amount-minus">-${currencySymbol !== 'Kč' ? [currencySymbol] : ''}${dataObject.amountValue} 
            ${currencySymbol === 'Kč' ? [currencySymbol] : ''}
            </div>
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
    .forEach((event) => {
      event.addEventListener('click', async () => {
        const expenseSourceValue = document.querySelector('.js-expense-value').value;
        const amountValue = document.querySelector('.js-amount-value').value;
        const dateValue = document.querySelector('.js-date-value').value;
        const emoji = document.querySelector('.js-emoji-picked').value;
        const id = crypto.randomUUID();

        document.querySelector('.js-expense-amount-input-alert').innerHTML = '';
        document.querySelector('.js-expense-date-input-alert').innerHTML = '';

        if (emoji === '') {
          document.querySelector('.js-emoji-input-alert').innerHTML = '<p>Please pick an icon!</p>'
          return;
        }

        if (expenseSourceValue === '') {
          document.querySelector('.js-expense-source-input-alert')
            .innerHTML = "<p>Expense Source can't be empty!</p>"
          return;
        }
        
        if (Number(amountValue) <= 0) {
          document.querySelector('.js-expense-amount-input-alert')
            .innerHTML = "<p>Amount can't be empty and has to be greater than 0!</p>"
    
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
          currency: 'CZK',
          dateValue,
          id,
          emoji
        });

        const newExpense = {
          expenseSourceValue,
          amountValue,
          currency: 'CZK',
          dateValue,
          emoji
        };

        console.log(dateValue)
        try {
          const response = await fetch('http://localhost:3000/expenses', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newExpense)
          }) 

          if(!response.ok) throw new Error('Failed to add expense')
  
          const data =  await response.json()
          
          const monthlySum = monthlyExpenseSummary();
  
          myChart.data.labels = Object.keys(monthlySum);
          myChart.data.datasets[0].data = Object.values(monthlySum);
          myChart.update()
  
          saveToStorageExpenses();
          updateDate();
          generateHTML();
          
          dialog.close();
        } catch (error) {
          console.error('Error adding expense:', error)
        }
      
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

      const monthlySum = monthlyExpenseSummary();

      myChart.data.labels = Object.keys(monthlySum);
      myChart.data.datasets[0].data = Object.values(monthlySum);
      myChart.update()
      
      
      generateHTML();
    })
  })
  
}
