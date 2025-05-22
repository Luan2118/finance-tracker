const dialog = document.getElementById('add-expense-dialog')


document.querySelector('.js-add-expense-button')
  .addEventListener('click', () => {
    dialog.showModal();
  })

document.querySelector('.js-add-expense-popup-close')
  .addEventListener('click', () => {
    dialog.close();
  })


let expenseData = JSON.parse(localStorage.getItem('expenseData')) || [{
  expenseSourceValue : 'Shopping',
  amountValue : 500,
  dateValue: '2025-05-17',
  id: crypto.randomUUID()
},
{
  expenseSourceValue : 'Food',
  amountValue : 1000,
  dateValue: '2025-05-17',
  id: crypto.randomUUID()
},
]

generateHTML();

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



submitExpense();


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

        dialog.close();

        localStorage.setItem('expenseData', JSON.stringify(expenseData))
        generateHTML();

      })
    })
  
}

deleteExpenseButton();
function deleteExpenseButton () {
  document.querySelectorAll('.js-expense-delete-button') 
  .forEach((button) => {
    button.addEventListener('click', () => {
      const deleteExpenseId = button.dataset.id;
      deleteExpense(deleteExpenseId);

      generateHTML();
    })
  })
  
}



function deleteExpense(deleteExpenseId) {
  let newData = [];

  expenseData.forEach((dataObject) => {
    if (dataObject.id !== deleteExpenseId) {
      newData.push(dataObject);
    }
  })

  expenseData = newData;

  localStorage.setItem('expenseData', JSON.stringify(expenseData)) 
}