
const dialog = document.getElementById('add-income-dialog')

// const showPopUpDialog = (show) => show ? dialog.showModal() : dialog.close();

document.querySelector('.js-add-income-button')
  .addEventListener('click', () => {
    dialog.showModal();
  })

document.querySelector('.js-add-income-popup-close')
  .addEventListener('click', () => {
    dialog.close();
  })



let incomeData =  JSON.parse(localStorage.getItem('incomeData')) || [
  {
    incomeSourceValue: 'Example',
    amountValue: 10000,
    dateValue: '2025-05-17',
    id: crypto.randomUUID()
  }
]




generateHTML();


function generateHTML() {
  let dataHTML = '';
  incomeData.forEach((dataObject) => {

  const {incomeSourceValue, amountValue, dateValue, id } = dataObject;
  
  const html = `
    <div class="each-income">
      <div class="income-info-inner-grid">
      <div class="income-img-grid"><img class="income-img" src="icons/shopping-icon.png"></div>
      <div class="income-info">
        <div>
          <div>${incomeSourceValue}</div>
          <div class="income-date">>${dateValue}</div>
        </div>

        <div class="income-right-side">
          <div class="income-delete-button-grid"><button class="income-delete-button js-income-delete-button" data-id="${id}">X</button></div>
          <div class="income-amount-plus">+${amountValue}Kč</div>
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



submitIncome();

function submitIncome() {
  
  document.querySelectorAll('.js-add-income-button-submit')
    .forEach((click) => {
      click.addEventListener('click', () => {
      let id = crypto.randomUUID()
      const incomeSourceValue = document.querySelector('.js-income-value').value;
      const amountValue = document.querySelector('.js-amount-value').value;
      const dateValue = document.querySelector('.js-date-value').value;


      incomeData.push({
        incomeSourceValue: incomeSourceValue,
        amountValue: amountValue,
        dateValue: dateValue,
        id: id
      })
      
      localStorage.setItem('incomeData', JSON.stringify(incomeData));

      
      
      dialog.close();
      generateHTML();


    });
  });

}

deleteButton();


function deleteButton() {
document.querySelectorAll('.js-income-delete-button')
  .forEach((link) => {
    link.addEventListener('click', () => {
      const deleteButtonId = link.dataset.id
      
      deleteIncome (deleteButtonId);
      generateHTML();

    })
  })

}

function deleteIncome (deleteButtonId) {

  const newData = [];

  incomeData.forEach((dataObject) => {
    if (dataObject.id !== deleteButtonId) {
      newData.push(dataObject)
    } 

  })

  incomeData = newData;
  
  localStorage.setItem('incomeData', JSON.stringify(incomeData));
}

