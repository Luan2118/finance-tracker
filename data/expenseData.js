export let expenseData = JSON.parse(localStorage.getItem('expenseData')) || [{
  expenseSourceValue : 'Example',
  amountValue : 500,
  dateValue: '2025-01-17',
  id: crypto.randomUUID(),
  emoji: ''
}
]

export function monthlyExpenseSummary() {
  const monthlySum = {};
  expenseData.forEach((data) => {
  const date = new Date(data.dateValue)
  const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}` 

  if(!monthlySum[monthKey]) {
    monthlySum[monthKey] = 0
  }

  monthlySum[monthKey] += Number(data.amountValue);

  })
  return monthlySum;
}

updateDate();
export function updateDate() {
  expenseData.sort((a, b) => new Date(b.dateValue) - new Date(a.dateValue))
}


export function saveToStorageExpenses() {
  localStorage.setItem('expenseData', JSON.stringify(expenseData)) 
}


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

  
