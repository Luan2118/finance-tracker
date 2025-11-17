import { loadExpenseData, expenseData, updateExpenseDate, monthlyExpenseSummary } from "../../data/expenseData.js";
import { myExpenseChart } from "../chartJS/expense-page/expense-page-chart.js";
import {iconPicker} from '../utils/icon-picker.js'
import { menuIcon } from "../utils/menuIcon.js";
import {formatCurrency, loadGetSymbol} from '../utils/currencySymbols.js';
import getAccessToken from "../utils/getAccessToken.js";
import logOut from "../logout.js";
import refreshToken from "../utils/refreshToken.js";
import getUsername from "../utils/getUsername.js";
import getFormattedDate from "../utils/getFormattedDate.js";
import { updateChart } from "../utils/updateChart.js";

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
  const symbol = await loadGetSymbol(expenseData)
  await updateExpenseDate();


  let dataHTML = '';

  expenseData.forEach((dataObject) => {
    const {category, expenseSourceValue, amountValue, dateValue, _id, emoji } = dataObject;

     const formattedDate = getFormattedDate(dateValue);
    

    const html = `
      <li class="each-expense">
        <div class="expense-img-grid" aria-hidden="true">${emoji}</div>
        <div class="expense-info">
          <div>
            <div class="source-text">${expenseSourceValue}</div>
            <div class="expense-date">${formattedDate}</div>
            <div class="expense-category">Category: ${category}</div>
          </div>
          
          <div class="expense-right-side">
            <button type="button" class="expense-delete-button js-expense-delete-button" data-id="${_id}" aria-label="Delete expense"><img class="delete-icon" src="./icons/bin-icon.png" alt=""></button>
            <div class="expense-amount-minus">-${formatCurrency(amountValue, symbol)}
            </div>
          </div>
        </div>
      </li>
    `
    dataHTML += html;

})

document.querySelector('.js-each-expense-grid')
  .innerHTML = dataHTML;

  
deleteExpenseButton();

}

const categoryInput = document.querySelector('.category-input');
const expenseInput = document.querySelector('.js-expense-value');
const amountInput = document.querySelector('.js-amount-value');
const dateInput = document.querySelector('.js-date-value');

const categoryValidation = document.querySelector('.js-category-input-alert');
const expenseValidation = document.querySelector('.js-expense-source-input-alert');
const amountValidation = document.querySelector('.js-expense-amount-input-alert');
const dateValidation = document.querySelector('.js-expense-date-input-alert');

function submitExpense() {
  document.querySelectorAll('.js-add-expense-button-submit')
    .forEach((event) => {
      event.addEventListener('click', async (event) => {
        event.preventDefault();
        const category = categoryInput.value
        const expenseSourceValue = expenseInput.value;
        let amountValue = amountInput.value;
        const dateValue = dateInput.value;
        let emoji = document.querySelector('.js-emoji-picked').value;

         amountValue = Number(amountValue)

        // let id;
        
        document.querySelector('.js-expense-amount-input-alert').innerHTML = '';
        document.querySelector('.js-expense-date-input-alert').innerHTML = '';

        let hasError = false;


        if (category === '') {
          categoryInput.setAttribute('aria-invalid', 'true');
          categoryValidation.setAttribute('role', 'alert');
          categoryValidation.textContent = 'Please select a category!'
          hasError = true;
        }else {
          categoryInput.removeAttribute('aria-invalid');
          categoryValidation.removeAttribute('role');
          categoryValidation.textContent = '';
        }

        if (expenseSourceValue === '') {
          expenseInput.setAttribute('aria-invalid', 'true');
          expenseValidation.setAttribute('role', 'alert');
          expenseValidation.textContent = "Expense Source can't be empty!"
          hasError = true;
        }else {
          expenseInput.removeAttribute('aria-invalid');
          expenseValidation.removeAttribute('role');
          expenseValidation.textContent = '';
        }
        
        if (Number(amountValue) <= 0 ) {
          amountInput.setAttribute('aria-invalid', 'true');
          amountValidation.setAttribute('role', 'alert');
          amountValidation.textContent = "Amount can't be empty and has to be greater than 0!"
          hasError = true;
        }else {
          amountInput.removeAttribute('aria-invalid');
          amountValidation.removeAttribute('role');
          amountValidation.textContent = '';
        }
        
        if (!dateValue) {
          dateInput.setAttribute('aria-invalid', 'true');
          dateValidation.setAttribute('role', 'alert');
          dateValidation.textContent = 'Please pick a date!'
          hasError = true;
        }else {
          dateInput.removeAttribute('aria-invalid');
          dateValidation.removeAttribute('role');
          dateValidation.textContent = '';
        }

        if(hasError) return;
        
        const newExpense = {
          category,
          expenseSourceValue,
          amountValue,
          currency: 'CZK',
          dateValue,
          emoji
        };

        
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
          
          const monthlySums = await monthlyExpenseSummary();
                
          const labels = Object.keys(monthlySums)
          const data = Object.values(monthlySums)

          updateChart(myExpenseChart, labels, data, 'month');
                
  
          updateExpenseDate();
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

      let token = getAccessToken();
      try {
        const response = await fetch(`http://localhost:3000/expenses/${deleteExpenseId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.status === 401) {  
          token = await refreshToken();
          sessionStorage.setItem('accessToken', token)
          response = await fetch(`http://localhost:3000/expenses/${deleteExpenseId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }) 
        }

        if (!response.ok) throw new Error('Failed to delete expense')
        
        const monthlySums = await monthlyExpenseSummary();
              
        const labels = Object.keys(monthlySums)
        const data = Object.values(monthlySums)

        updateChart(myExpenseChart, labels, data, 'month');
        

        generateHTML();
      } catch (error) {
        console.error(error.message)
      }
    })
  })
  
}
