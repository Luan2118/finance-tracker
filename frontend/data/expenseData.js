// export let expenseData = JSON.parse(localStorage.getItem('expenseData')) || [{
//   expenseSourceValue : 'Example',
//   amountValue : 500,
//   currency: 'CZK',
//   dateValue: '2025-01-17',
//   id: crypto.randomUUID(),
//   emoji: ''
// }
// ]

export let expenseData;
async function getExpenseData() {
  const response = await fetch('http://localhost:3000/expenses',)
  const data = await response.json();
  expenseData = data;
  return expenseData
}

export async function loadExpenseData() {
  expenseData = await getExpenseData();
  return expenseData ;
}


export async function monthlyExpenseSummary() {
  await loadExpenseData();
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
export async function updateDate() {
  await loadExpenseData();
  expenseData.sort((a, b) => new Date(b.dateValue) - new Date(a.dateValue))
  // console.log(expenseData.sort((a, b) => new Date(b.dateValue) - new Date(a.dateValue)))
}


loadExpenseData().then( data => console.log(data))