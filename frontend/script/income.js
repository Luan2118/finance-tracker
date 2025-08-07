import { incomeData, loadIncomeData, updateDate, monthlyIncomeSummary } from "../data/incomeData.js";
import { myChart,   } from "./chartJS/income-page-chart.js";
import {iconPicker} from './utils/icon-picker.js'
import { menuIcon } from "./utils/menuIcon.js";
import {formatCurrency, loadGetSymbol } from "./utils/currencySymbols.js";
import getAccessToken from "./utils/getToken.js";
import logOut from "./logout.js";

// utils
menuIcon();
iconPicker();
logOut();

// get currency symbol
let symbol;

loadIncomeData().then(() => {
  loadGetSymbol(incomeData).then((data) => {
    symbol = data;
  })
})

// pop up
const dialog = document.getElementById('add-income-dialog')

document.querySelector('.js-add-income-button')
  .addEventListener('click', () => {
    dialog.showModal();
    document.body.style.overflow = 'hidden';
  })

function handleClosePopUp(event) {
  if (event.type === 'click') {
    dialog.close();
    document.body.style.overflow = '';
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
  event.target.value = event.target.value.replace(/[^a-zA-Z\- ]/g, '')
})



generateHTML();
submitIncome();

async function generateHTML() {
  await loadIncomeData();
  await updateDate();
  let dataHTML = '';

  incomeData.forEach((dataObject) => {

  const {incomeSourceValue, amountValue, dateValue, _id, emoji } = dataObject;
  
  const html = `
    <div class="each-income">
      <div class="income-info-inner-grid">
      <div class="income-img-grid">${emoji}</div>
      <div class="income-info">
        <div>
          <div>${incomeSourceValue}</div>
          <div class="income-date">>${dateValue}</div>
        </div>

        <div class="income-right-side">
          <div class="income-delete-button-grid"><button class="income-delete-button js-income-delete-button" data-id="${_id}"><img class="delete-icon" src="./icons/bin-icon.png"></button></div>
          <div class="income-amount-plus">+${formatCurrency(amountValue, symbol)}</div>
        </div>
      </div>
      </div>
    </div>
  `
  dataHTML += html;
  });

  document.querySelector('.js-each-income-grid').innerHTML = dataHTML;
  deleteButton();

}

function submitIncome() {
  
  document.querySelectorAll('.js-add-income-button-submit')
    .forEach((click) => {
      click.addEventListener('click', async (event) => {
      const incomeSourceValue = document.querySelector('.js-income-value').value;
      let amountValue = document.querySelector('.js-amount-value').value;
      const dateValue = document.querySelector('.js-date-value').value;
      const emoji = document.querySelector('.js-emoji-picked').value
  
      amountValue = Number(amountValue)
      document.querySelector('.js-income-amount-input-alert').innerHTML = '';
      document.querySelector('.js-income-date-input-alert').innerHTML = '';

      if (emoji === '') {
        document.querySelector('.js-emoji-input-alert').innerHTML = '<p>Please pick an icon!</p>'
        return;
      }
      
      if (incomeSourceValue === '') {
        document.querySelector('.js-income-source-input-alert').innerHTML = "<p>Income Source can't be empty!</p>"
        return;
      }

      if (Number(amountValue) <= 0 ) {
        document.querySelector('.js-income-amount-input-alert')
          .innerHTML = "<p>Amount can't be empty and has to be greater than 0!</p>"
        return;
      }
      
      if (!dateValue) {
        document.querySelector('.js-income-date-input-alert')
          .innerHTML = '<p>Please pick a date!</p>'
        return;
      }

      const newIncome = {
        incomeSourceValue,
        amountValue,
        currency: 'CZK',
        dateValue,
        emoji
      }

      const token = getAccessToken();

      try {
        const response = await fetch('http://localhost:3000/income', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(newIncome)
        })

        if (!response.ok) throw new Error('Failed to add income')
          const monthlySums = monthlyIncomeSummary();
      
          myChart.data.labels = Object.keys(monthlySums)
          myChart.data.datasets[0].data = Object.values(monthlySums)
      
          myChart.update()
          
          dialog.close();
          

         
          updateDate();
          generateHTML();
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

      try {
        const response = await fetch(`http://localhost:3000/income/${deleteButtonId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if(!response.ok) throw new Error('Failed to delete income')

          const monthlySums = monthlyIncomeSummary();
      
          myChart.data.labels = Object.keys(monthlySums)
          myChart.data.datasets[0].data = Object.values(monthlySums)
      
          myChart.update()
      
          
          generateHTML();

      } catch (error) {
        console.log(error.message)
      }
        
      
    })
  })

}


