import { incomeData, saveToStorageIncome, deleteIncome, updateDate, monthlyIncomeSummary } from "../data/incomeData.js";
import { myChart,   } from "./chartJS/incomeChartJS.js";
import textFieldEdit from 'https://cdn.jsdelivr.net/npm/text-field-edit@^4/index.js';



const dialog = document.getElementById('add-income-dialog')

document.querySelector('.js-add-income-button')
  .addEventListener('click', () => {
    dialog.showModal();
  })

document.querySelector('.js-add-income-popup-close')
  .addEventListener('click', () => {
    dialog.close();
  })

  const emojiInput = document.getElementById('emoji-input')

  emojiInput.addEventListener('keydown', (event) => {
    const allowedKeys = [
      'Backspace',
    ];

    if (!allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  })


document.querySelector('.js-emoji-picker')
  .addEventListener('click', () => {
    document.querySelector('.js-emoji-picker-element').innerHTML = '<emoji-picker class="emoji-element light"></emoji-picker'


    document.querySelector('emoji-picker')
      .addEventListener('emoji-click', (event) => {
        document.getElementById('emoji-input').value = '';
        document.querySelector('.js-emoji-picker-element').innerHTML = ''
        textFieldEdit.insert(document.querySelector('.js-emoji-picked'), event.detail.unicode)
      })
  })

/*
<emoji-picker></emoji-picker>
*/



const amountInput = document.getElementById('income-amount-input')

amountInput.addEventListener('input', (event) => {
  event.target.value = event.target.value.replace(/[^0-9]/g,'')
})


const incomeSourceInput = document.getElementById('income-source-input')

incomeSourceInput.addEventListener('input', (event) => {
  event.target.value = event.target.value.replace(/[^a-zA-Z]/g, '')
})

generateHTML();
submitIncome();
deleteButton();


function generateHTML() {
  let dataHTML = '';
  incomeData.forEach((dataObject) => {

  const {incomeSourceValue, amountValue, dateValue, id, emoji } = dataObject;
  
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
          <div class="income-delete-button-grid"><button class="income-delete-button js-income-delete-button" data-id="${id}">X</button></div>
          <div class="income-amount-plus">+${amountValue} Kč</div>
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
      click.addEventListener('click', (event) => {
      const incomeSourceValue = document.querySelector('.js-income-value').value;
      const amountValue = document.querySelector('.js-amount-value').value;
      const dateValue = document.querySelector('.js-date-value').value;
      const emoji = document.querySelector('.js-emoji-picked').value

      console.log(emoji)
      
      document.querySelector('.js-income-amount-input-alert').innerHTML = '';
      document.querySelector('.js-income-date-input-alert').innerHTML = '';

      if (emoji === '') {
        document.querySelector('.js-emoji-input-alert').innerHTML = '<p>Please pick an icon!</p>'
        return;
      }

      if (Number(amountValue) <= 0 ) {
        document.querySelector('.js-income-amount-input-alert')
          .innerHTML = '<p>Amount has to be greater than 0!</p>'
        return;
      }
      
      if (!dateValue) {
        document.querySelector('.js-income-date-input-alert')
          .innerHTML = '<p>Please pick a date!</p>'
        return;
      }

      incomeData.push({
      incomeSourceValue: incomeSourceValue,
      amountValue: amountValue,
      dateValue: dateValue,
      id: crypto.randomUUID(),
      emoji
      })
      
      saveToStorageIncome();
     
      updateDate();
      generateHTML();

      const monthlySums = monthlyIncomeSummary();

      myChart.data.labels = Object.keys(monthlySums)
      myChart.data.datasets[0].data = Object.values(monthlySums)

      myChart.update()
      
      dialog.close();
      
      


    });
  });

}

function deleteButton() {
document.querySelectorAll('.js-income-delete-button')
  .forEach((link) => {
    link.addEventListener('click', () => {
      const deleteButtonId = link.dataset.id

      deleteIncome (deleteButtonId);
      

      const monthlySums = monthlyIncomeSummary();

      myChart.data.labels = Object.keys(monthlySums)
      myChart.data.datasets[0].data = Object.values(monthlySums)

      myChart.update()

      saveToStorageIncome();

      generateHTML();
      
    })
  })

}


