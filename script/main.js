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

const expenseByDate = expenseData.sort((a, b) => new Date(a.dateValue) - new Date(b.dateValue))

let expenseDataHTML = '';

expenseData.forEach((dataObject) => {
  const html = `
    <div class="transactions-info-inner-grid">
      <div class="transaction-img-grid"><img class="transactions-img" src="icons/shopping-icon.png"></div>
      <div class="transactions-info">
        <div>
          <div>${dataObject.expenseSourceValue}</div>
          <div class="transactions-date">${dataObject.dateValue}</div>
        </div>
        
        <div class="transactions-amount-minus">-${dataObject.amountValue}Kč</div>
      </div>
    </div>  
  `

  expenseDataHTML += html;
})

document.querySelector('.js-expense-transactions-info-grid').innerHTML = expenseDataHTML;






let incomeData =  JSON.parse(localStorage.getItem('incomeData')) || [
  {
    incomeSourceValue: 'Example',
    amountValue: 10000,
    dateValue: '2025-05-17',
    id: crypto.randomUUID()
  }
]


const incomeByDate = incomeData.sort((a, b) => new Date(a.dateValue) - new Date(b.dateValue))



let incomeDataHTML = '';


incomeData.forEach((dataObject) => {
  let html = `
    <div class="transactions-info-inner-grid">
      <div class="transaction-img-grid"><img class="transactions-img" src="icons/shopping-icon.png"></div>
      <div class="transactions-info">
        <div>
          <div>${dataObject.incomeSourceValue}</div>
          <div class="transactions-date">${dataObject.dateValue}</div>
        </div>
        
        <div class="transactions-amount-plus">+${dataObject.amountValue}Kč</div>
      </div>
    </div>
  `
  incomeDataHTML += html
})

document.querySelector('.js-income-transactions-info-grid').innerHTML = incomeDataHTML;


const sharedData = [
  ...expenseData.map(item => ({...item, type: 'expense'})),
  ...incomeData.map(item => ({...item, type: 'income'}))
]


sharedData.sort((a, b) => new Date(a.dateValue) - new Date(b.dateValue))

console.log(sharedData)




let sharedDataHTML = '';
sharedData.forEach((dataObject) => {
  if (dataObject.type === 'expense') {
    const html = `
      <div class="transactions-info-inner-grid">
        <div class="transaction-img-grid"><img class="transactions-img" src="icons/shopping-icon.png"></div>
        <div class="transactions-info">
          <div>
            <div>
            ${dataObject.expenseSourceValue}
            </div>
            <div class="transactions-date">${dataObject.dateValue}</div>
          </div>
          
          <div class="transactions-amount-minus">-${dataObject.amountValue}Kč</div>
        </div>
      </div>
    `
    sharedDataHTML += html
  }else if (dataObject.type === 'income') {
     const html = `
      <div class="transactions-info-inner-grid">
        <div class="transaction-img-grid"><img class="transactions-img" src="icons/salary-icon.png"></div>
        <div class="transactions-info">
          <div>
            <div>${dataObject.incomeSourceValue}</div>
            <div class="transactions-date">${dataObject.dateValue}</div>
          </div>
          
          <div class="transactions-amount-plus">+${dataObject.amountValue}Kč</div>
        </div>
      </div>
    `
    sharedDataHTML += html
  }

  
});

document.querySelector('.js-transactions-info-grid')
  .innerHTML = sharedDataHTML;