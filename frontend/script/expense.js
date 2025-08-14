import { loadExpenseData, expenseData, updateDate, monthlyExpenseSummary } from "../data/expenseData.js";
import { myChart } from "./chartJS/expense-page-chart.js";
import {iconPicker} from './utils/icon-picker.js'
import { menuIcon } from "./utils/menuIcon.js";
import {formatCurrency, loadGetSymbol} from './utils/currencySymbols.js';
import getAccessToken from "./utils/getToken.js";
import logOut from "./logout.js";
import refreshToken from "./utils/refreshToken.js";
import getUsername from "./utils/getrUserName.js";

// utils
menuIcon();
iconPicker();
logOut();
getUsername().then((data) => document.querySelector('.profile-name-js').innerHTML = data)

// pop up 
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


// get currency symbol
let symbol;

loadExpenseData().then(() => {
  loadGetSymbol(expenseData).then((data) => {
    symbol = data;
  })
})

// submit validation
const expenseSourceInput = document.getElementById('expense-source-input')

expenseSourceInput.addEventListener('input', (event) => {
  event.target.value = event.target.value.replace(/[^a-zA-Z\- ]/g, '')
})

const expenseAmountInput = document.getElementById('expense-amount-input')

expenseAmountInput.addEventListener('input', (event) => {
  event.target.value = event.target.value.replace(/[^0-9]/g, '')
})


generateHTML();
submitExpense();

async function generateHTML() {
  await loadExpenseData();
  await updateDate();


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
            <div class="expense-delete-button-grid"><button class="expense-delete-button js-expense-delete-button" data-id="${dataObject._id}"><img class="delete-icon" src="./icons/bin-icon.png"></button></div>
            <div class="expense-amount-minus">-${formatCurrency(dataObject.amountValue, symbol)}
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
        let amountValue = document.querySelector('.js-amount-value').value;
        const dateValue = document.querySelector('.js-date-value').value;
        let emoji = document.querySelector('.js-emoji-picked').value;

         amountValue = Number(amountValue)

        // let id;

        document.querySelector('.js-expense-amount-input-alert').innerHTML = '';
        document.querySelector('.js-expense-date-input-alert').innerHTML = '';

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

      
        const newExpense = {
          expenseSourceValue,
          amountValue,
          currency: 'CZK',
          dateValue,
          emoji
        };

        console.log(newExpense)
        try {
          let token = getAccessToken();
          let response = await fetch('http://localhost:3000/expenses', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newExpense)
          }) 

          if (response.status === 401) {  
            token = await refreshToken();
            sessionStorage.setItem('accessToken', token)
            response = await fetch('http://localhost:3000/expenses', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newExpense)
          }) 
          }

          if(!response.ok) throw new Error('Failed to add expense')
          
          const monthlySum = monthlyExpenseSummary();
  
          myChart.data.labels = Object.keys(monthlySum);
          myChart.data.datasets[0].data = Object.values(monthlySum);
          myChart.update()
  
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
    button.addEventListener('click', async () => {
      const deleteExpenseId = button.dataset.id;

      try {
        const response = await fetch(`http://localhost:3000/expenses/${deleteExpenseId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) throw new Error('Failed to delete expense')
        
          const monthlySum = monthlyExpenseSummary();
    
          myChart.data.labels = Object.keys(monthlySum);
          myChart.data.datasets[0].data = Object.values(monthlySum);
          myChart.update()
          

          generateHTML();
      } catch (error) {
        console.log(error.message)
      }
    })
  })
  
}
