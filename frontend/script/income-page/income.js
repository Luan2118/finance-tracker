import { incomeData, loadIncomeData, updateIncomeDate, monthlyIncomeSummary } from "../../data/incomeData.js";
import { myChart,   } from "../chartJS/income-page/income-page-chart.js";
import {iconPicker} from '../utils/icon-picker.js'
import { menuIcon } from "../utils/menuIcon.js";
import {formatCurrency, loadGetSymbol } from "../utils/currencySymbols.js";
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
const dialog = document.getElementById('add-income-dialog')

document.querySelector('.js-add-income-button')
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

const popUpCloseButton = document.querySelector('.js-add-income-popup-close')

popUpCloseButton.addEventListener('click', handleClosePopUp)
popUpCloseButton.addEventListener('keydown', handleClosePopUp)


// submit validation
const amountInput = document.getElementById('income-amount-input')

amountInput.addEventListener('input', (event) => {
  event.target.value = event.target.value.replace(/[^0-9]/g,'')
})


const incomeSourceInput = document.getElementById('income-source-input')

incomeSourceInput.addEventListener('input', (event) => {
  event.target.value = event.target.value.replace(/[^\p{L}\- ]/gu, '');
});



generateHTML();
submitIncome();

async function generateHTML() {
  await loadIncomeData();
  const symbol = await loadGetSymbol(incomeData)
  await updateIncomeDate();
  let dataHTML = '';

  incomeData.forEach((dataObject) => {

  const {category, incomeSourceValue, amountValue, dateValue, _id, emoji } = dataObject;
  

  const formattedDate = getFormattedDate(dateValue);
    
  
  const html = `
    <li class="each-income">
      <div class="income-img-grid" aria-hidden="true">${emoji}</div>
      <div class="income-info">
        <div class="income-left-side">
          <div class="source-text">${incomeSourceValue}</div>
          <div class="income-date">${formattedDate}</div>
          <div class="income-category">Category: ${category}</div>
        </div>

        <div class="income-right-side">
          <button type="button" class="income-delete-button js-income-delete-button" data-id="${_id}" aria-label="Delete income"><img class="delete-icon" src="./icons/bin-icon.png" alt=""></button>
          <div class="income-amount-plus">+${formatCurrency(amountValue, symbol)}</div>
        </div>
      </div>
    </li>
  `
  dataHTML += html;
  });

  document.querySelector('.js-each-income-grid').innerHTML = dataHTML;
  deleteButton();
 
}

function submitIncome() {
  
  const categoryInput = document.querySelector('.category-input');
  const incomeInput =  document.querySelector('.income-input-js');
  const amountInput = document.querySelector('.amount-input-js');
  const dateInput = document.querySelector('.date-input-js');

  const categoryValidation = document.querySelector('.js-category-input-alert');
  const incomeValidation = document.querySelector('.js-income-source-input-alert');
  const amountValidation = document.querySelector('.js-income-amount-input-alert');
  const dateValidation = document.querySelector('.js-income-date-input-alert')

  document.querySelectorAll('.js-add-income-button-submit')
    .forEach((click) => {
      click.addEventListener('click', async (event) => {

      event.preventDefault();

      const category = categoryInput.value
      const incomeSourceValue = incomeInput.value;
      let amountValue = amountInput.value;
      const dateValue = dateInput.value;
      const emoji = document.querySelector('.js-emoji-picked').value


  
      amountValue = Number(amountValue)
      
      let hasError = false;


      if (category === '' ) {
        categoryInput.setAttribute('aria-invalid', 'true');
        categoryValidation.setAttribute('role', 'alert');
        categoryValidation.textContent = 'Please select a category!'
        hasError = true
      }else {
        categoryInput.removeAttribute('aria-invalid');
        categoryValidation.removeAttribute('role');
        categoryValidation.textContent = '';

      }

      if (incomeSourceValue === '') {
        incomeInput.setAttribute('aria-invalid', 'true');
        incomeValidation.setAttribute('role', 'alert');
        incomeValidation.textContent = "Income Source can't be empty!"
        hasError = true
      }else {
        incomeInput.removeAttribute('aria-invalid');
        incomeValidation.removeAttribute('role');
        incomeValidation.textContent = '';

      }
      
      if (Number(amountValue) <= 0 ) {
        amountInput.setAttribute('aria-invalid', 'true');
        amountValidation.setAttribute('role', 'alert');
        amountValidation.textContent = "Amount can't be empty and has to be greater than 0!"
        hasError = true
        
      }else {
        amountInput.removeAttribute('aria-invalid');
        amountValidation.removeAttribute('role');
        amountValidation.textContent = '';

      }
      
      if (!dateValue) {
        dateInput.setAttribute('aria-invalid', 'true');
        dateValidation.setAttribute('role', 'alert');
        dateValidation.textContent = 'Please pick a date!'
        hasError = true
      }else {
        dateInput.removeAttribute('aria-invalid');
        dateValidation.removeAttribute('role');
        dateValidation.textContent = '';

      }

      if(hasError) return;


      
      
      
      const newIncome = {
        category,
        incomeSourceValue,
        amountValue,
        currency: 'CZK',
        dateValue,
        emoji
      }
      
      try {
        let token = getAccessToken();

        let response = await fetch('http://localhost:3000/income', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(newIncome)
        })

        if(response.status === 401) {
          token = await refreshToken();
          sessionStorage.setItem('accessToken', token)
          response = await fetch('http://localhost:3000/income', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(newIncome)
        })
        }

        if (!response.ok) throw new Error('Failed to add income')
        const monthlySums = await monthlyIncomeSummary();

        const labels = Object.keys(monthlySums)
        const data = Object.values(monthlySums)
        
        
        updateChart(myChart,labels, data, 'month');
        
        dialog.close();
        

        
        await updateIncomeDate();
        await generateHTML();
      } catch (error) {
        console.log(error.message)
      }


    });
  });

}

function deleteButton() {
document.querySelectorAll('.js-income-delete-button')
  .forEach((link) => {
    link.addEventListener('click', async () => {
      const deleteButtonId = link.dataset.id

      let token = getAccessToken();
      try {
        const response = await fetch(`http://localhost:3000/income/${deleteButtonId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.status === 401) {  
          token = await refreshToken();
          sessionStorage.setItem('accessToken', token)
          response = await fetch(`http://localhost:3000/income/${deleteButtonId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }) 
        }

        if(!response.ok) throw new Error('Failed to delete income')

        const monthlySums = await monthlyIncomeSummary();
    
        const labels = Object.keys(monthlySums)
        const data = Object.values(monthlySums)

        updateChart(myChart, labels, data, 'month');

        await updateIncomeDate();
        await generateHTML();

      } catch (error) {
        console.log(error.message)
      }
        
      
    })
  })

}

