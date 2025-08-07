import getAccessToken from "../script/utils/getToken.js";

export let expenseData;

const token = getAccessToken();

async function getExpenseData() {
  const response = await fetch('http://localhost:3000/expenses', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  const data = await response.json();
  expenseData = data;
  return expenseData
}

export async function loadExpenseData() {
  return await getExpenseData();

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
}


