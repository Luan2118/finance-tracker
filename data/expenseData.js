export let expenseData = JSON.parse(localStorage.getItem('expenseData')) || [{
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

export function updateDate() {
  expenseData.sort((a, b) => new Date(b.dateValue) - new Date(a.dateValue))
}


export function saveToStorageExpenses() {
  localStorage.setItem('expenseData', JSON.stringify(expenseData)) 
}

/*
export function updateExpenseData(newData) {
  expenseData.length = 0;
  expenseData.push(...newData);
  saveToStorageExpenses();
}
*/


export function deleteExpense(deleteExpenseId) {
  let newData = [];

  expenseData.forEach((dataObject) => {
    if (dataObject.id !== deleteExpenseId) {
      newData.push(dataObject);
    }
  })

  expenseData = newData;
  saveToStorageExpenses(); 
}

  
